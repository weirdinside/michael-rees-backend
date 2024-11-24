const router = require("express").Router();
const auth = require("../middlewares/auth");
const { validateId } = require("../middlewares/validation");

const {
  createProject,
  getProjects,
  deleteProject,
} = require("../controllers/project");

router.post("/", auth, createProject);
router.delete("/:id", auth, validateId, deleteProject);
router.get("/", getProjects);

module.exports = router;
