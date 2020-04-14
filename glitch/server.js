// https://ytqr.glitch.me

const express = require('express')
const app = express()

const https = require('https')

var getSubtitles = require('youtube-captions-scraper').getSubtitles;


app.use(express.static('public'))

app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})

//Custom route to fetch srt for a youtube url

app.get("/:youtubeId", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");//cors enable
  getSubtitles({
    videoID: req.params.youtubeId, // youtube video id
  }).then(captions => {
    res.send(captions);
  }).catch(error => {
    res.send("Error: " + error);
  });

});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
