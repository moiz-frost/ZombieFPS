var express = require('express');
var path = require('path');

var app = express();

var port = process.env.PORT || 3000;

app.use(express.static('./'));

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname + '/mainGame.html'));
});

app.listen(port, function () {
    console.log('Listening on %s', port)
});