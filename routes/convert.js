'use strict';

const express = require('express'),
  router = express.Router(),
  path = require('path'),
  ytdl = require('ytdl-core'),
  ffmpeg = require('fluent-ffmpeg'),
  sanitize = require('sanitize-filename'),
  // mime = require('mime'),
  streamBuffers = require('stream-buffers');

let myReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer();

router.get('/', (req, res) => {
  try {
    convert(req.query.yturl, function (filename) {

      // let mimetype = mime.lookup(filename);
      res.set('Content-disposition', 'attachment; filename=' + filename);
      res.set('Content-type', 'audio/mpeg');
      myReadableStreamBuffer.pipe(res);
      myReadableStreamBuffer.on('end', () => true);
      myReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer();
    });
  } catch (err) {
    res.json(err)
  }
});

function convert (url, cb) {

  let ffStream, filename, ytStream, ff;

  ytdl.getInfo(url, (err, info) => {
    if (err) {
      console.log('An error occurred: ' + process.cwd() + ' ' + err.message);
    } else {
      filename = path.join(sanitize(info.title) + '.mp3').replace('’', '');
      console.log(filename);
      // const file = fs.createWriteStream(path.join(process.cwd(), filename));
      ytStream = ytdl(url, {});
      ffStream = ffmpeg(ytStream)
        .on('error', (err) => {
          console.log('An error occurred: ' + process.cwd() + ' ' + err.message);
        })
        .noVideo()
        .audioChannels(2)
        .audioBitrate('128k')
        .audioCodec('libmp3lame')
        .format('mp3');

      ff = ffStream.pipe();

      ff.on('data', function (chunk) {
          // file.write(chunk);
          myReadableStreamBuffer.put(chunk);
        })
        .on('end', () => {
          // file.end();
          myReadableStreamBuffer.stop();
          cb(filename);
        });
    }
  });
}

module.exports = router;
