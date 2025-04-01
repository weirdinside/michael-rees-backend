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
  personalWorkOrder: {
    type: [String],
    required: false,
    default: [],
  },
  clientWorkOrder: {
    type: [String],
    required: false,
    default: [],
  },
  homeClientList: {
    type: [String],
    required: false,
    default: [],
  },
  veronikaVideos: {
    type: [String],
    required: false,
    default: [],
  },
  personalWorkDescription: {
    type: String,
    required: false,
    default: "",
  },
  clientWorkDescription: {
    type: String,
    required: false,
    default: "",
  },
  veronikaWorkDescription: {
    type: String,
    required: false,
    default: "",
  },
});

module.exports = mongoose.model("siteData", siteDataSchema);
