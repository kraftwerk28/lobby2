'use strict'
const { Pool } = require('pg')

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  DB_PORT
} = process.env

const conn = new Pool({
  connectionString: `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`
})

const dbConnect = () => conn.connect()
const dbDisconnect = () => conn.end()

/**
 * 
 * @param {string} query 
 * @param {string[]=} values 
 */
const dbQuery = (query, values) =>
  conn.query(query, values ? values : undefined)

module.exports = { dbQuery, dbConnect, dbDisconnect }
