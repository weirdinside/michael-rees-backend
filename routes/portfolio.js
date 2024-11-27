const router = require("express").Router();
const auth = require("../middlewares/auth");
const { validateId } = require("../middlewares/validation");

const {
  createProject,
  getProjects,
  deleteProject,
  editProject,
} = require("../controllers/project");

router.patch("/:id", auth, editProject);
router.post("/", auth, createProject);
router.delete("/:id", auth, validateId, deleteProject);
router.get("/", getProjects);

module.exports = router;