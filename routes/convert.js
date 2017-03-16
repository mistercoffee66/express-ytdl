"use strict";

const express = require('express'),
  router = express.Router(),
  fs = require('fs-extra'),
  path = require('path'),
  ytdl = require('ytdl-core'),
  ffmpeg = require('fluent-ffmpeg'),
  sanitize = require('sanitize-filename'),
  mime = require('mime');

router.get('/', (req, res) => {

  convert(req.query.yturl, function(filepath){

    //console.log('callback ',filepath);
    let filename = path.basename(filepath),
      mimetype = mime.lookup(filename);

    res.set('Content-disposition', 'attachment; filename=' + filename);
    res.set('Content-type', mimetype);
    res.download(filepath, filename, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('download complete');
        fs.unlink(filepath);
      }
    });
  })
});

function convert(url, cb) {

  let dest = 'public/.tmp',
    stream, filepath;

  ytdl.getInfo(url, (err, info) => {
    if (err) {
      console.log('An error occurred: ' + process.cwd() + ' ' + err.message);
    }
    else {
      //console.log(info);
      if (!fs.existsSync(dest)){
        fs.mkdirSync(dest);
      }
      filepath = path.join(process.cwd(), dest, sanitize(info.title) + '.mp3');
      stream = ytdl(url, {});
      ffmpeg(stream)
        .on('error', (err) => {
          console.log('An error occurred: ' + process.cwd() + ' ' + err.message);
        })
        .on('end', () => {
          console.log('Processing finished! ', filepath);
          cb(path.join(filepath));
        })
        .noVideo()
        .audioChannels(2)
        .audioBitrate('128k')
        .audioCodec('libmp3lame')
        .save(filepath);
    }
  });


/*  vstream = youtubedl(url,
    ['--format=mp4']
  );

  vstream.on('info', function(info) {
    console.log('info',info);
    filepath = path.join(process.cwd(), dest, sanitize(info.title) + '.mp3');
    ffmpeg(vstream)
      .on('error', (err) => {
        console.log('An error occurred: ' + process.cwd() + ' ' + err.message);
      })
      .on('end', () => {
        console.log('Processing finished! ', filepath);
        cb(path.join(filepath));
      })
      .noVideo()
      .audioChannels(2)
      .audioBitrate('128k')
      .audioCodec('libmp3lame')
      .save(filepath);
  });*/
}

module.exports = router;