const mongoose = require("mongoose");
const validator = require("validator");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  showTitle: {
    type: Boolean,
    required: true,
  },
  role: {
    type: String,
    required: [true, "The role is required"],
    minLength: 2,
    maxLength: 50,
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
  thumbnail: {
    type: String,
    required: false,
    validate: {
      validator(value) {
        if (
          value === "" ||
          value.includes(".jpg") ||
          value.includes(".png") ||
          value.includes(".jpeg")
        ) {
          return true;
        }
      },
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model("project", projectSchema);
