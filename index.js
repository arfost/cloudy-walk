'use strict'

var express = require('express')
var app = express()

var fs = require('fs');
var path = require('path');

app.use('/static', express.static('static'));

app.get('/', function (req, res) {
  //console.log('test')
  res.status(200).sendFile(__dirname + '/index.html');
});

app.listen(26000, function () {
  console.log('Example app listening on port 8080!');
});