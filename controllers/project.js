const Project = require("../models/project");
const { BadRequestError } = require("../utils/errors/BadRequestError");
const { NotFoundError } = require("../utils/errors/NotFoundError");

const createProject = (req, res, next) => {
  const { title, showTitle, link, role, thumbnail } = req.body;
  Project.create({
    title,
    showTitle,
    link,
    role,
    thumbnail,
  })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
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

const editProject = (req, res, next) => {
  const { _id, title, showTitle, link, role, thumbnail } = req.body;
  const update = { title, showTitle, link, role, thumbnail };
  Project.findByIdAndUpdate(_id, update, {
    new: true,
  })
    .orFail()
    .then((data) => {
      res.status(200).send(data);
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

const deleteProject = (req, res, next) => {
  const { id } = req.params;
  Project.findById(id)
    .orFail()
    .then(async (project) => {
      await project.deleteOne();
      res.status(200).send(project);
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
  editProject,
  getProjects,
  deleteProject,
};
