const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../utils/config");
const { BadRequestError } = require("../utils/errors/BadRequestError");
const { UnauthorizedError } = require("../utils/errors/UnauthorizedError");
const { ConflictError } = require("../utils/errors/ConflictError");

const getCurrentUser = async (req, res, next) => {
  try {
    const user = User.findById(req.user._id).orFail();
    res.status(200).send({ data: user });
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new BadRequestError("Invalid Data"));
    }
    if (err.name === "DocumentNotFoundError") {
      next(new NotFoundError("Document not found"));
    }
    next(err);
  }
};

const register = async (req, res, next) => {
  const { name, password, secret } = req.body;
 
  try {
    if (!name) {
      return next(new BadRequestError("A name is required to sign up"));
    }
 
    if (secret !== process.env.SECRET_PHRASE) {
      return next(new UnauthorizedError("The secret phrase is wrong"));
    }
 
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);
 
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return next(new ConflictError("Someone is using that name already"));
    }
 
    const user = await User.create({ name, password: hash });
 
    res.status(201).send({ name: user.name });
  } catch (err) {
    next(err);
  }
 };

const login = async (req, res, next) => {
  const { name, password } = req.body;
  if (!name || !password) {
    throw new BadRequestError("Name or password incorrect");
  }

  try {
    if (!name || !password) {
      throw new BadRequestError("name or password incorrect");
    }

    const user = await User.findUserByCredentials(name, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.send({ token });
  } catch (err) {
    if (err.message === "Incorrect name or password") {
      return next(new UnauthorizedError("User not authorized"));
    }
    next(err);
  }
};

module.exports = {
  login,
  register,
  getCurrentUser,
};
