const SiteData = require("../models/siteData");
const { NotFoundError } = require("../utils/errors/NotFoundError");

const getSiteData = (req, res, next) => {
  SiteData.find({})
    .then((data) => res.send(data))
    .catch((err) => {
      next(err);
    });
};

const editSiteData = (req, res, next) => {
  const dataId = "data";
  const { order, lastEdited } = req.body;
  const update = { order, lastEdited };

  SiteData.findByIdAndUpdate({ _id: dataId }, update, {
    new: true,
    runValidators: true,
  })
    .then((data) => {
      if (!data) {
        throw new NotFoundError("site data not found");
      }

      return res.status(200).send({ data });
    })
    .catch((err) => {
      console.error(err.name);
      next(err);
    });
};

module.exports = {
  getSiteData,
  editSiteData,
};
