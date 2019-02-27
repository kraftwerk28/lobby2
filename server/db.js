'use strict';

const { resolve, join } = require('path');
const { Client } = require('pg');
const { readFileSync } = require('fs');

// const TABLENAME = 'statistics'

const connConfig = JSON.parse(
  readFileSync(join(__dirname, 'connConfig.json'), 'utf8')
);

const conn = new Client(connConfig);

const dbConnect = async () => await conn.connect();

const dbDisconnect = async () => await conn.end();

/**
 * 
 * @param {string} query 
 * @param {string[]=} values 
 */
const dbQuery = async (query, values) =>
  await conn.query(query, values ? values : undefined);

module.exports = { dbQuery, dbConnect, dbDisconnect };
