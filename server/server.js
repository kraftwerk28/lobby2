'use strict';

// const http = require('http');
const fs = require('fs');
const express = require('express');
const mysql = require('mysql');
const TABLENAME = 'statistics';
const { json, urlencoded } = require('body-parser');

const connConfig = JSON.parse(
  fs.readFileSync(__dirname + '/connConfig.json', 'utf8')
);

const app = express();

app.use(
  express.static(__dirname + '/../dist/'),
  express.static(__dirname + '/../'),
  json(),
  urlencoded({ extended: false }),
);


app.get('/', (req, res) => {
  res.statusCode = 200;
  res.sendFile('')
});

app.post('/stats', (req, res) => {
  const { platform, timestamp } = req.body;
  const conn = mysql.createConnection(connConfig);
  conn.connect();
  conn.query(
    `INSERT INTO ${TABLENAME} VALUES(?, ?, ?)`,
    [platform, req.connection.remoteAddress.substring(7), timestamp]
  );
  conn.end();
});

app.listen(80, () => { console.log('Listening on port :80'); });
