var express = require('express');
var app = express();

var fs = require("fs"),
    json;


app.use(express.static(__dirname));

app.use('/yo', function(req, res){
  res.send(json);
  //res.send('hey');
  res.end();
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
