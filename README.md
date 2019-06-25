# express-ytdl

This is an optionally Dockerized Nodejs Express app to convert youtube urls to mp3 downloads. You can run it as a Nodejs app in an exisiing environment or build it as a Docker image.

### Usage as a Nodejs app in an exisiing environment
#### Requirements
* [Nodejs](https://nodejs.org)
* [FFmpeg](https://ffmpeg.org)

Install [forever](https://www.npmjs.com/package/forever) globally

```bash
$ npm install -g forever
```

Install dependencies

```bash
express-ytdl $ npm install 
```

Run

```bash
express-ytdl $ npm start 
```

####Known Issues
* some YouTube videos trigger an error in [https://github.com/fent/node-ytdl-core](node-ytdl-core)
* see [https://github.com/fent/node-ytdl-core/issues/24](this issue)

### Build and run as a Docker Image
#### Requirements
* [Docker](https://www.docker.com/)

Based on [truthbean/ffmpeg-node-docker](https://github.com/truthbean/ffmpeg-node-docker)

Start Docker on your host system

Build the image

```bash
express-ytdl $ docker build -t your-optional-dockerhub-username/your-app-name .
```

Run the container. The container's exposed port is 8080. The first argument of the `-p|port` flag is your localhost port that you want to point to the container, in this example `49160`.

```bash
express-ytdl $ docker run -p 49160:8080 -d your-optional-dockerhub-username/your-app-name
```

Open [http://localhost:49160](http://localhost:49160) in your browser

### Deploy as a Docker Image

You can zip the directory contents (excluding node_modules and logs) easily from the latest git version:

```bash
express-ytdl $ git archive --format=zip HEAD > your-app-name.zip
```
