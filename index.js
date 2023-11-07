require("dotenv").config();
require("./db");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const dns = require("dns");
const url = require("url");
const Url = require("./models/Url.model");

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

//Shorten URL and save in DB
app.post("/api/shorturl", async (req, res) => {
  let urlInput = req.body.url;
  const parsedUrl = url.parse(urlInput);
  if (!/^https?:\/\//i.test(parsedUrl.href)) {
    urlInput = "http://" + parsedUrl.href;
  }
  dns.lookup(parsedUrl.hostname, async (err, addresses) => {
    if (err || addresses === undefined) {
      res.json({ error: "invalid url" });
    } else {
      let r = (Math.random() + 1).toString(36).substring(7);
      await Url.create({
        original_url: urlInput,
        short_url: r,
      });
      res.json({ original_url: urlInput, short_url: r });
    }
  });
});

//Find in DB by shorturl and redirect to original URL
app.get("/api/shorturl/:url", async (req, res) => {
  const urlObject = await Url.findOne({ short_url: req.params.url });
  res.status(301).redirect(urlObject.original_url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
