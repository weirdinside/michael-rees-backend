const router = require("express").Router();
const portfolio = require("./portfolio");

const {
  validateLogin,
  validateRegister,
} = require("../middlewares/validation");

const { login, register } = require("../controllers/user");
const { NotFoundError } = require("../utils/errors/NotFoundError");

router.use("/portfolio", portfolio);

router.post("/signin", validateLogin, login);

router.post("/register", validateRegister, register);

router.use((req, res, next) => {
  next(new NotFoundError("Requested Resource Not Found"));
});

module.exports = router;