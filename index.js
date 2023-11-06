require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const dns = require("dns");
const url = require("url");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", function (req, res) {
  const urlInput = req.body.url;
  const parsedUrl = url.parse(urlInput);
  dns.lookup(parsedUrl.hostname, (err, addresses) => {
    if (err || addresses === undefined) {
      res.json({ error: "invalid url" });
    } else {
      res.json({ original_url: req.body.url });
    }
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
