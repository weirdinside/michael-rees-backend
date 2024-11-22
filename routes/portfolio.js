const router = require("express").Router();
const auth = require("../middlewares/auth");
const { validateProjectBody, validateId } = require("../middlewares/validation");

const {
  createProject,
  getProjects,
  deleteProject,
} = require("../controllers/project");

router.post("/", auth, validateProjectBody, createProject);
router.delete("/:id", auth, validateId, deleteProject);
router.get("/", getProjects);

module.exports = router;
