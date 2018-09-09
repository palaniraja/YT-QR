// https://ytqr.glitch.me

const express = require('express')
const app = express()

const https = require('https')
const htmlToText = require('html-to-text');
 

app.use(express.static('public'))

app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})

//Custom route to fetch srt for a youtube url

app.get("/:youtubeId", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");//cors enable
  // res.setHeader('content-type', 'text/javascript');
  // res.send(req.params);
  https.get('https://www.diycaptions.com/php/get-automatic-captions-as-srt.php?id='+req.params.youtubeId, (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });
    resp.on('end', () => {
      // res.send(data);
      var text = htmlToText.fromString(data);
      res.send({'text':text.trim()});
    });

  })
  .on("error", (err) => {
    res.send("Error: " + err.message);
  });

})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
