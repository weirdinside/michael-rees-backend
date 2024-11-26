const mongoose = require("mongoose");

const siteDataSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  order: {
    type: [String],
    required: true,
    default: [],
  },
  lastEdited: {
    type: String,
    required: false,
    default: Date.now().toString(),
  },
});

module.exports = mongoose.model("siteData", siteDataSchema);
