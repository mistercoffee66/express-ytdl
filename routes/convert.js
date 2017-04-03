"use strict";

const express = require('express'),
  router = express.Router(),
  fs = require('fs-extra'),
  path = require('path'),
  ytdl = require('ytdl-core'),
  ffmpeg = require('fluent-ffmpeg'),
  sanitize = require('sanitize-filename'),
  mime = require('mime'),
  streamBuffers = require('stream-buffers');

  let myReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer();

router.get('/', (req, res) => {

  convert(req.query.yturl, function(filename){

    let mimetype = mime.lookup(filename);
    res.set('Content-disposition', 'attachment; filename=' + filename);
    res.set('Content-type', mimetype);
    myReadableStreamBuffer.pipe(res);
    myReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer();
  })
});

function convert(url, cb) {

  let ffStream, filename, ytStream, ff;

  ytdl.getInfo(url, (err, info) => {
    if (err) {
      console.log('An error occurred: ' + process.cwd() + ' ' + err.message);
    }
    else {
      filename = path.join(sanitize(info.title) + '.mp3');
      ytStream = ytdl(url, {});
      ffStream = ffmpeg(ytStream)
        .on('error', (err) => {
          console.log('An error occurred: ' + process.cwd() + ' ' + err.message);
        })
        .noVideo()
        .audioChannels(2)
        .audioBitrate('128k')
        .audioCodec('libmp3lame')
        .format('mp3')
      ;

      ff = ffStream.pipe();

      ff.on('data', function(chunk) {
        myReadableStreamBuffer.put(chunk);
      })
      .on('end', () => {
        myReadableStreamBuffer.stop();
        cb(filename);
      });
    }
  });
}

module.exports = router;