const { Schema, model } = require("mongoose");

const urlSchema = new Schema({
  original_url: String,
  short_url: String,
});

const Url = model("Url", urlSchema);

module.exports = Url;
