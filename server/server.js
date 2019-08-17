'use strict'

const { readFileSync } = require('fs')
const { randomBytes } = require('crypto')
const express = require('express')
const { json, urlencoded } = require('body-parser')
const { join } = require('path')
const fetch = require('node-fetch')

const { createServer } = require('http')

const { dbQuery, dbConnect, dbDisconnect } = require('./db')

const PORT = 1488
const DEVPORT = 8081
const PAGES_SCHEMA_PATH = join(__dirname, '../data/pages-schema.json')

const geourl = 'http://ip-api.com/json/'

const generateToken = () => randomBytes(16).toString('hex')
let sessionToken = null
const TOKEN_TIMEOUT = 1000 * 60 * 5
let timerId = null

const password = readFileSync(__dirname + '/password', 'utf8')

const app = express()

const indexRoutes = [
  'cube-switch',
  'dev-helper',
  'hue-game',
  'kpi-labs',
  'index.html',
]

// routing
app.use(
  json(),
  // urlencoded({ extended: false }),
)

app.post('/printjson', (req, res) => {
  console.log('JSON :', req.body)
})

app.all('/crud', (req, res) => {
  res.sendFile(join(__dirname, '../dist/crud.html'))
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
app.post('/visittable', async (req, res) => {
  if (req.body.token === sessionToken) {
    const { rows } = await dbQuery(`
      SELECT
        record_id, platform, ip,
        to_char(req_time, 'HH24:MI:SS, DD.MM.YY') AS time,
        country, city, org, latitude, longtitude
      FROM stats
      ORDER BY record_id DESC
    `)
    res.status(200).send(rows).end()
  }
})

app.post('/stats', async (req, res) => {
  const { platform, timestamp } = req.body
  const ip = req.header('x-real-ip') ||
    req.connection.remoteAddress.substring(7)

  const { country, city, org, lat, lon } = await fetch(geourl + ip)
    .then(d => d.json())

  await dbQuery(`
    INSERT INTO stats
      (platform, ip, req_time, country, city, org, latitude, longtitude)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8)
    `,
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

app.get('/assets/*', (req, res) => {
  res.set('Content-Encoding', 'gzip')
  res.sendFile(join(__dirname, `../dist${req.path}.gz`))
})

app.get('/*.js', (req, res) => {
  res.set('Content-Encoding', 'gzip')
  res.sendFile(join(__dirname, `../dist${req.path}.gz`))
})

app.get('/*.css', (req, res) => {
  res.set({
    'Content-Encoding': 'gzip',
    'Content-type': 'text/css'
  })
  res.sendFile(join(__dirname, `../dist${req.path}.gz`))
})

app.use(
  express.static(join(__dirname, '../data')),
  express.static(join(__dirname, '../dist'))
)

// index middleware
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'))
})

// creating server
if (process.env.NODE_ENV === 'development') {
  createServer(app)
    .listen(DEVPORT, () => console.log(':DEV: Listening on port :' + DEVPORT))
  dbConnect()
} else {
  // main server
  dbConnect().then(() => {
    createServer(app)
      .listen(PORT, () => console.log(':PROD: Listening on port :' + PORT))
  }).catch((reason) => {
    console.error(reason)
    process.exit(1)
  })
}
