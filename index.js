var express = require('express');
var app = express();

app.set('port', (process.env.NODE_PORT || 5000));
app.use(express.static(__dirname + (process.env.NODE_WEB_DIR || '/public')));

app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});