var express = require('express');
var app = express();

var fs = require("fs"),
    json;


//app.use(express.static(__dirname));

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.use('/yo', function(req, res){
  res.send("hello");
  //res.send('hey');
  res.end();
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
