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

  converty(req.query.yturl, function(filename){
    console.log('done')

    //let mimetype = mime.lookup(filename);
    //res.set('Content-disposition', 'attachment; filename=' + filename);
    //res.set('Content-type', mimetype);
    //myReadableStreamBuffer.pipe(res);
    //myReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer();
  })
});

function converty(url,cb) {
  let formats = [], max = 0, dlFormat, title
  ytdl.getInfo(url, (err, info) => {
    if (err) {
      console.log('An error occurred: ' + process.cwd() + ' ' + err.message);
    } else {
      title = info.title
      info.formats.map( function(format, i, arr)  {
        if (format.container === 'mp4' && format.encoding === 'H.264') {
          formats.push(format)
        }
      })
      console.log('**********')
      console.log(formats)
      formats.map(function(format, i, arr){
        let res = parseFloat(formats[i].resolution)
        if (res > max) {
          max = res
          dlFormat = format
        }
      })
      console.log(max)
      ytdl(url, {format: dlFormat})
        .pipe(fs.createWriteStream(title + '.mp4'))
      cb()
    }
  })

  //ytdl(url)
  //  .pipe(fs.createWriteStream('video.mp4'))
}

function convert(url, cb) {

  let ffStream, filename, ytStream, ff;

  ytdl.getInfo(url, (err, info) => {
    if (err) {
      console.log('An error occurred: ' + process.cwd() + ' ' + err.message);
    }
    else {
      filename = path.join(sanitize(info.title) + '.avi');
      ytStream = ytdl(url, {});
      ffStream = ffmpeg(ytStream)
        .on('error', (err) => {
          console.log('An error occurred: ' + process.cwd() + ' ' + err.message);
        })
        //.noVideo()
        //.audioChannels(2)
        //.audioBitrate('128k')
        //.audioCodec('libmp3lame')
        //.format('mp4')
        .preset('divx')
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