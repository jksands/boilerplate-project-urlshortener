require('dotenv').config();
const express = require('express');
const cors = require('cors');
let bodyParser = require('body-parser');
let dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

let urls = [];

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));


app.use(bodyParser.urlencoded({extended: false}))

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  // filter the url to 
  let url = new URL(req.body.url);
  url = url.hostname;
  // dns.lookup('https://freeCodeCamp.org', (err, addresses, family) => {
  //   if (err) {
  //     console.log("EVEN THIS MESSED UP: " + err);
  //   }
  //   console.log(addresses);
  // })
  dns.lookup(url, (err, addresses, family) => {
    if (err) {
      res.json({error: 'invalid url'});
    }
    else {
      urls[urls.length] = req.body.url;
       res.json({original_url: req.body.url, short_url: urls.length})
    }
  })
})

app.get('/api/shorturl/:num', (req, res) => {
  res.redirect(urls[Number(req.params.num) - 1]);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
