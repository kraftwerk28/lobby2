'use strict'

const { readFileSync } = require('fs')
const { randomBytes } = require('crypto')
const express = require('express')
const { json, urlencoded } = require('body-parser')
const { resolve } = require('path')
const fetch = require('node-fetch')

const { createServer: createhttpServer } = require('http')
const { createServer } = require('https')

const { dbQuery } = require('./db')

const PORT = 443
const DEVPORT = 8081
const PAGES_SCHEMA_PATH = resolve(__dirname, '../data/pages-schema.json')

const geourl = 'http://ip-api.com/json/'

const generateToken = () => randomBytes(16).toString('hex')
let sessionToken = null
const TOKEN_TIMEOUT = 1000 * 60 * 5
let timerId = null

const password = readFileSync(__dirname + '/password', 'utf8')

const app = express()

// custom middlewares
app.use(
  express.static(__dirname + '/../dist/'),
  express.static(__dirname + '/../data/'),
  express.static(__dirname + '/../crud/dist/'),
  json(),
  urlencoded({ extended: false }),
)

const indexRoutes = [
  'cube-switch',
  'dev-helper',
  'hue-game',
  'kpi-labs',
  'index.html',
]

// routing
/** @param {Response} res */
const sendCrud = (res) => {
  res.status(200)
  res.sendFile(resolve(__dirname + '/../dist/crud.html'))
}

app.get(['/', ...indexRoutes.map(_ => '/' + _)], (req, res) => {
  res.status(200)
    .sendFile(resolve(__dirname + '/../dist/index.html'))
})

app.all('/crud', (req, res) => {
  res.status(200).sendFile(resolve(__dirname + '/../dist/crud.html'))
})

// session token (must send it back in headers)
app.post('/token', (req, res) => {
  if (req.body.pwd === password) {
    sessionToken = generateToken()
    console.log('Authorized with ' + sessionToken)
    if (timerId) {
      clearTimeout(timerId)
    }
    timerId = setTimeout(() => {
      console.log('Auth expired with ' + sessionToken)
      timerId = sessionToken = null
    }, TOKEN_TIMEOUT)

    res.status(200).send(sessionToken).end()

  } else {
    res.status(202).end()
  }
})

// applied json's
app.post('/visittable', (req, res) => {
  if (req.body.token === sessionToken) {
    dbQuery(`SELECT
      id, platform, ip,
      DATE_FORMAT(time, "%H:%i:%s, %d.%m.%Y") AS time,
      country, city, org, latitude, longtitude
      FROM statistics
      ORDER BY id DESC`
    ).then(({ result }) => {
      res.status(200).send(result).end()
    })
  }
})

app.post('/stats', async (req, res) => {
  const { platform, timestamp } = req.body
  const ip = req.connection.remoteAddress.substring(7)

  const { country, city, org, lat, lon } = await fetch(geourl + ip)
    .then(d => d.json())

  dbQuery(`INSERT INTO statistics
    (platform, ip, time, country, city, org, latitude, longtitude)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
    [platform, ip, timestamp, country, city, org, lat, lon])
  res.status(200).end()
})

app.get('/schema', (req, res) => {
  res.status(200).sendFile(PAGES_SCHEMA_PATH)
})

app.post('/schema', (req, res) => {
  const { writeFileSync } = require('fs')

  if (req.body.token === sessionToken) {
    writeFileSync(PAGES_SCHEMA_PATH, JSON.stringify(req.body.schema))
    res.status(200).end()
  }
})


// creating server
if (process.env.NODE_ENV === 'development') {
  createhttpServer(app)
    .listen(DEVPORT, () => console.log('Listening on port :' + DEVPORT))
} else {
  const httpsPaths = JSON.parse(
    readFileSync(__dirname + '/httpsCfg.json', 'utf8'))

  const cfg = {
    key: readFileSync(httpsPaths.key),
    cert: readFileSync(httpsPaths.cert),
  }

  // redirect
  createhttpServer((req, res) => {
    res.statusCode = 301
    res.setHeader('Location', 'https://' + req.headers.host + req.url)
    res.end()
  }).listen(80)

  // main server
  createServer(cfg, app)
    .listen(PORT, () => console.log('Listening on port :' + PORT))
}

