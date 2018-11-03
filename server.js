'use strict';

const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
  let path = '';
  if (req.url === '/')
    path = '/dist/index.html';
  else
    path = /\/|bundle.js$|style.css/i.test(req.url) ? '/dist' + req.url :
      req.url;

  fs.readFile(__dirname + path, { encoding: 'utf8' }, (err, data) => {
    if (err)
      console.log(err.message);

    console.log(path);
    res.statusCode = 200;
    res.end(data);
  });
}).listen(8080, () => { console.log('Server running at port :8080'); });
