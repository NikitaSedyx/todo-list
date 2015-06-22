var express = require("express");
var bodyParser = require('body-parser');
var fs = require("fs");

var tasksJSON = require("./tasks.json");
var isFirst = !tasksJSON.length ? true : false;

var app = express();

app.use(express.static('build'));
app.use(bodyParser.json());

app.get("/", function(req, res){
  res.sendFile(__dirname + "/build/index.html")
});

app.get("/tasks", function(req, res){
  fs.readFile('./tasks.json', 'utf8', function (err,buffer) {
    res.send(buffer);
  })
});

app.post("/tasks", function(req, res){
  var data = req.body;
  fs.stat('./tasks.json', function(err, stats){
    fs.truncate('./tasks.json', stats["size"]-1, function(err){
      if (err) return err;
      var line = JSON.stringify(data)+"]";
      if (isFirst){
        isFirst = false;
      }else{
        line = "," + line;
      }
      fs.appendFile('./tasks.json', line, function(err){
        if (err) return err;
      });
    });
  });
  res.status(200);
});

app.put("/tasks", function(req, res){
  var original = JSON.stringify(req.body.original);
  var edited = JSON.stringify(req.body.edited);
  fs.readFile('./tasks.json', 'utf8', function (err,buffer) {
    if (err) return err;
    var result = buffer.replace(original, edited);
    fs.writeFile('./tasks.json', result, 'utf8', function (err) {
    if (err) return console.log(err);
    });
  });
  res.status(200);
});

app.listen(8000);
