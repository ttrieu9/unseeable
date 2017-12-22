var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
})

var server = app.listen(8080, () => {
  console.log('Example app listening at http://localhost:8080');
})

