const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The name field is required"],
    minLength: 2,
    maxLength: 30,
  },
  password: {
    type: String,
    required: [true, "A password is required"],
    select: false,
  },
});

userSchema.statics.findUserByCredentials = async function findUserByCredentials(
  name,
  password,
) {
  const user = await this.findOne({ name }).select("+password");

  if (!user) {
    throw new Error("Incorrect name or password");
  }

  const matched = await bcrypt.compare(password, user.password);

  if (!matched) {
    throw new Error("Incorrect name or password");
  }

  return user;
};

module.exports = mongoose.model("user", userSchema);
