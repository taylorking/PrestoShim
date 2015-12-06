var fs = require('fs');
var https = require('https');
var express = require('express');
var app = express();
var awsregion = 'us-west-2';

var host = "http://127.0.0.1:8081";

var presto = require('presto-client');
var client = new presto.Client({host:"127.0.0.1", "port":8081, catalog:'dynamo', schema: 'us_west_2'});
var bodyParser = require('body-parser');
var urlParser = bodyParser.urlencoded({extended: false});
var keys = JSON.parse(fs.readFileSync('keys.json'));
var bot = require('./echoToChat.js');       

app.get('/', urlParser, function(req, res) {
  console.log(req.query);
  if(keys.indexOf(req.query.key) > -1) { 
    res.send();
    console.log("valid key");
    client.execute(req.query.query, function (error, data, columns) {
      console.log("Done");

      if(error) {
        bot.sendMessage(req.query.chat, "Error with query: " + JSON.stringify(error), function(err, data){
          if(err) {
              console.log(err);
            }
        });       
      } else {
        bot.sendMessage(req.query.chat, "Result of query: " + JSON.stringify(data), function(err, data) {
          if(err) {
            console.log(err);
          }
        
        });
      }
    });
  } else {
    console.log("bad key");
    res.sendStatus(403);
  }
});

https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.cer')
}, app).listen(443);
