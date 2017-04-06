#!/usr/bin/env node
const APP = require('./app'),
      PORT = '8080';

//app.set('port', 8080);

APP.listen(PORT, function() {
  console.log("Listening on server_port " + PORT);
});