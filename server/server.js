'use strict';

// const http = require('http');
const fs = require('fs');
const express = require('express');
const mysql = require('mysql');
const TABLENAME = 'statistics';

const connConfig = JSON.parse(
  fs.readFileSync(__dirname + '/connConfig.json', 'utf8')
);

const app = express();

app.use(
  express.static(__dirname + '/../dist/'),
  express.static(__dirname + '/../')
);

app.get('/', (req, res) => {
  res.statusCode = 200;
  res.sendFile('')
});

app.post('/stats', (req, res) => {
  console.log(req.body);
  // const {platfor}
  // const conn = mysql.createConnection(connConfig);
  // conn.connect();
  // conn.query(`INSERT INTO ${TABLENAME} (${123})`);
});

app.listen(80, () => { console.log('Listening on port :80'); });
