const router = require("express").Router();
const portfolio = require("./portfolio");
const siteData = require("./siteData");
const { unlink } = require("node:fs");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "thumbnails/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.originalname
        .replaceAll(" ", "_")
        .substring(0, file.originalname.lastIndexOf(".")) +
        uniqueSuffix +
        "." +
        file.originalname.split(".").pop(),
    );
  },
});

const upload = multer({ storage });

const {
  validateLogin,
  validateRegister,
} = require("../middlewares/validation");

const { login, register } = require("../controllers/user");
const auth = require("../middlewares/auth");

router.use("/portfolio", portfolio);

router.use("/data", siteData);

router.post("/signin", validateLogin, login);
router.post("/register", validateRegister, register);

router.post("/api/upload", auth, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "File upload failed" });
  }

  const filePath = `${req.file.destination}${req.file.filename}`;

  return res.status(200).json({ filePath });
});

router.delete("/api/delete/:fileName", auth, (req, res) => {
  const { fileName } = req.params;
  unlink(`thumbnails/${fileName}`, (err) => {
    if (err) {
      throw err;
    }
    res.status(200).json({ fileName });
  });
});

router.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: err.message });
});

module.exports = router;
