'use strict';

const { resolve } = require('path');
const mysql = require('mysql');
const { readFileSync } = require('fs');

// const TABLENAME = 'statistics';

const connConfig = JSON.parse(
  readFileSync(resolve(__dirname, 'connConfig.json'), 'utf8')
);

/**
 * 
 * @param {string} query 
 * @param {string[]=} values 
 * @returns {Promise.<any>}
 */
const dbQuery = (query, values) => new Promise((resolve, reject) => {
  const conn = mysql.createConnection(connConfig);
  conn.connect();
  const callback = (err, result, fields) => {
    if (err) reject(err);
    else resolve({ err, result, fields });
  };
  if (typeof values === 'undefined') {
    conn.query(query, callback);
  } else {
    conn.query(query, values, callback);
  }
  conn.end();
});

module.exports = { dbQuery };
