const Project = require("../models/project");
const { BadRequestError } = require('../utils/errors/BadRequestError')
const { NotFoundError } = require('../utils/errors/NotFoundError')

const createProject = (req, res, next) => {
  const { title, showTitle, link, role, thumbnail } = req.body;
  console.log(thumbnail)
  Project.create({
    title,
    showTitle,
    link,
    role,
    thumbnail
  })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.log('something went wrong', err)
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid Data"));
      }
      next(err);
    });
};

const getProjects = (req, res, next) => {
  Project.find({})
    .then((projects) => res.send(projects))
    .catch((err) => next(err));
};

const deleteProject = (req, res, next) => {
  const { projectID } = req.params;
  Project.findById(projectID)
    .orFail()
    .then(async (project) => {
      await project.deleteOne();
        res.status(200).send({ message: `${project._id} has been deleted` });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid Data"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Document not found"));
      }
      return next(err);
    });
};

module.exports = {
  createProject,
  getProjects,
  deleteProject,
};
