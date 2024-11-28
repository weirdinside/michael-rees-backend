const Project = require("../models/project");
const { BadRequestError } = require("../utils/errors/BadRequestError");
const { NotFoundError } = require("../utils/errors/NotFoundError");

const createProject = async (req, res, next) => {
  const { title, showTitle, link, role, thumbnail } = req.body;
  try {
    const item = await Project.create({
      title,
      showTitle,
      link,
      role,
      thumbnail,
    });
    res.send({ data: item });
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new BadRequestError("Invalid Data"));
    }
    next(err);
  }
};

const getProjects = async (req, res, next) =>{
  try {
    const projects = await Project.find({})
    res.send(projects);
  } catch(err) {
    next(err);
  }
}

const editProject = async (req, res, next) => {
  const { _id, title, showTitle, link, role, thumbnail } = req.body;
  const update = { title, showTitle, link, role, thumbnail };
  try {
    const data = Project.findByIdAndUpdate(_id, update, {
      new: true,
    }).orFail();
    res.status(200).send(data);

  } catch (err){
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid Data"));
    }
    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError("Document not found"));
    }
    return next(err);
  }
}

const deleteProject = async (req, res, next) => {
  const { id } = req.params;

  try {
    const project = await Project.findById(id).orFail();
    await project.deleteOne();
    res.status(200).send(project);
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid Data"));
    }
    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError("Document not found"));
    }
    return next(err);
  }
};

module.exports = {
  createProject,
  editProject,
  getProjects,
  deleteProject,
};
