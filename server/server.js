'use strict'

require('dotenv').config()
const { randomBytes } = require('crypto')
const express = require('express')
const { json } = require('body-parser')
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

const password = process.env.ADMIN_PWD || 'admin'
console.log('admin password:', password)

let server

function terminator(sig) {
  console.log('=> Starting graceful shutdown')
  server.close(() => {
    dbDisconnect().then(() => {
      console.log('Gracefully stopped server...')
      process.exit(0)
    })
  })
  process.exit(0)
}

process.on('SIGINT', terminator)
process.on('SIGTERM', terminator)


const app = express()

app.use(json())

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
    [platform, ip, timestamp, country, city, org, lat, lon]
  )
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
  server = createServer(app)
    .listen(DEVPORT, () => console.log(`:DEV: Listening on port :${DEVPORT}`))
  dbConnect()
} else {
  // main server
  dbConnect().then(() => {
    server = createServer(app)
      .listen(PORT, () => console.log(`:PROD: Listening on port :${PORT}`))
  }).catch((reason) => {
    console.error(reason)
    process.exit(1)
  })
}
