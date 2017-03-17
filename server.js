#!/usr/bin/env node
var app = require('./app');

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");

var server = app.listen(app.get('port'), app.get('ip'), function() {
  console.log("Listening on " + app.get('ip') + ", server_port " + app.get('port'));
});