// server.js
// where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// init sqlite db
var fs = require('fs');
var dbFile = './.data/sqlite.db';
var exists = fs.existsSync(dbFile);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbFile);

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(function(){
  if (!exists) {
    db.run('CREATE TABLE Dreams (dream TEXT)');
    console.log('New table Dreams created!');
    
    // insert default dreams
    db.serialize(function() {
      db.run('INSERT INTO Dreams (dream) VALUES ("Find and count some sheep"), ("Climb a really tall mountain"), ("Wash the dishes")');
    });
  }
  else {
    console.log('Database "Dreams" ready to go!');
    db.each('SELECT * from Dreams', function(err, row) {
      if ( row ) {
        console.log('record:', row);
      }
    });
  }
});

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// endpoint to get all the dreams in the database
// currently this is the only endpoint, ie. adding dreams won't update the database
// read the sqlite3 module docs and try to add your own! https://www.npmjs.com/package/sqlite3
app.get('/getMessages', function(request, response) {
  db.all('SELECT * from Messages', function(err, rows) {
    response.send(JSON.stringify(rows));
  });
});

app.get('/getBlocked', function(req, res) {
  db.all('SELECT * FROM Blocked', function(err, rows) {
    res.send(JSON.stringify(rows));
  });
});

app.get('/getLogs', function(req, res) {
  db.all('SELECT * FROM Logs', function(err, rows) {
    res.send(JSON.stringify(rows));
  });
});

function addLogs(log) {
  if (!log) return false;
  var d = new Date()
  db.run("INSERT INTO Logs (timestamp, log) VALUES ('" + d.getHours() + ":" + d.getMinutes + "', '" + log + "')");
  return true;
}

app.get('/mysql', function(req, res) {
  db.run('CREATE TABLE Logs (timestamp TINYTEXT, log TINYTEXT)')
});

app.get('/send', function(req, res) {
  var msg = req.query.msg
  var user = req.query.user
  if (msg && user) {
     db.run("INSERT INTO Messages (message, name) VALUES ('" + msg + "', '" + user + "')");
    addLogs(user + ' said "' + msg + '".');
     res.redirect('/')
  }
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
