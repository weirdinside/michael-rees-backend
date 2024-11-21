const mongoose = require("mongoose");
const validator = require("validator");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
    minLength: 2,
    maxLength: 30,
  },
  role: {
    type: String,
    required: [true, "The role is required"],
    minLength: 2,
    maxLength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: false,
  },
});

module.exports = mongoose.model("project", projectSchema);
