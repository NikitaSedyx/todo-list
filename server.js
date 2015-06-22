var express = require("express");
var bodyParser = require('body-parser');
var fs = require("fs");
var _ = require("underscore");

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
  res.send("ok")
  res.status(200);
});

app.get("/tasks/:id", function(req, res){
  var tasks = []
  fs.readFile('./tasks.json', 'utf8', function (err,buffer) {
    tasks = JSON.parse(buffer)
    var task = _.find(tasks, function(task){
      return task.id === req.params.id
    })  
    res.json(task)
  })
});

app.put("/tasks/:id", function(req, res){
  var taskId = req.params.id
  var editedTask = req.body
  fs.readFile('./tasks.json', 'utf8', function (err,buffer) {
    tasks = JSON.parse(buffer)
    var task = _.find(tasks, function(task, index){
      return task.id === taskId ? index : null//req.params.id
    })  
    tasks[_.indexOf(tasks, task)] = editedTask
    fs.writeFile('./tasks.json', JSON.stringify(tasks), 'utf8', function (err) {
        if (err) return console.log(err);
    });
  })
})

app.listen(8000);
