const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../utils/config");
const { BadRequestError } = require("../utils/errors/BadRequestError");
const { UnauthorizedError } = require("../utils/errors/UnauthorizedError");
const { ConflictError } = require("../utils/errors/ConflictError");

function getCurrentUser(req, res, next) {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid Data"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Document not found"));
      }
      next(err);
    });
}

const register = (req, res) => {
  const { name, password, secret } = req.body;

  if (!name) {
    throw new BadRequestError("A name is required to sign up");
  }

  if (secret !== process.env.SECRET_PHRASE) {
    throw new UnauthorizedError("The secret phrase is wrong");
  }

  User.findOne({ name }).then((existingUser) => {

    if (existingUser) {
      throw new ConflictError("Someone is using that name already");
    }

    return bcrypt
      .hash(password, 10)
      .then((hash) => {
        console.log(hash);
        return User.create({ name, password: hash });
      })
      .then((user) => {
        res.send({ name: user.name });
      });
  });
};

const login = (req, res, next) => {
  const { name, password } = req.body;
  if (!name || !password) {
    throw new BadRequestError("name or password incorrect");
  }

  return User.findUserByCredentials(name, password)
    .then((user) => {
      console.log(user)
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect name or password") {
        next(new UnauthorizedError("User not authorized"));
      }
      next(err);
    });
};

module.exports = {
  login,
  register,
  getCurrentUser,
};
