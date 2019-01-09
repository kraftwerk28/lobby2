'use strict';

const { readFileSync } = require('fs');
const express = require('express');
const mysql = require('mysql');
const TABLENAME = 'statistics';
const { json, urlencoded } = require('body-parser');
const { resolve } = require('path');

const { createServer } = require('https');
const PORT = 443;

const connConfig = JSON.parse(
  readFileSync(__dirname + '/connConfig.json', 'utf8')
);

const app = express();

app.use(
  express.static(__dirname + '/../dist/'),
  express.static(__dirname + '/../data/'),
  json(),
  urlencoded({ extended: false }),
);

const indexRoutes = [
  'cube-switch',
  'dev-helper',
  'hue-game',
  'kpi-labs',
];

// routing
app.get(['/', ...indexRoutes.map(_ => '/' + _)], (req, res) => {
  res.statusCode = 200;
  res.sendFile(resolve(__dirname + '/../dist/index.html'));
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
  res.status(200).end();
});

const httpsPaths = JSON.parse(readFileSync('httpsCfg.json', 'utf8'));

const cfg = {
  key: readFileSync(httpsPaths.key),
  cert: readFileSync(httpsPaths.cert),
};

createServer(cfg, app)
  .listen(443, () => console.log('Listening on port :' + PORT));
