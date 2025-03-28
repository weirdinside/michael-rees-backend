const router = require("express").Router();
const auth = require("../utils/auth");
const { getSiteData, editSiteData } = require("../controllers/siteData");

router.get("/", getSiteData);

router.patch("/", auth, editSiteData);

module.exports = router;
