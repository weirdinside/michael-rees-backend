const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser } = require("../controllers/user");

router.use(auth);

router.get("/me", getCurrentUser);
