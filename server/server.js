'use strict';

// const http = require('http');
const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.static(__dirname + '/../dist/', { index: true }));

app.get('/', (req, res) => {
  res.statusCode = 200;
  res.sendFile('')
});

app.listen(80, () => { console.log('Listening on port :80'); });

// http.createServer((req, res) => {
//   let path = '';
//   if (req.url === '/')
//     path = '/dist/index.html';
//   else
//     path = /\/(?:bundle.js|style.css)/i.test(req.url) ? '/dist' + req.url :
//       req.url;

//   fs.readFile(__dirname + path, { encoding: 'utf8' }, (err, data) => {
//     if (err)
//       console.log(err.message);

//     console.log(path);
//     res.statusCode = 200;
//     res.end(data);
//   });
// }).listen(80, () => { console.log('Server running at port :80'); });
