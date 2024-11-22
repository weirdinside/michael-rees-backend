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

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  name,
  password,
) {
  return this.findOne({ name })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect name or password"));
      }

      console.log('Password from login attempt:', password)
      console.log('Password from database:', user.password)

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect name or password"));
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);