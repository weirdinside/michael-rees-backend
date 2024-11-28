const SiteData = require("../models/siteData");
const { NotFoundError } = require("../utils/errors/NotFoundError");

const getSiteData = async (req, res, next) => {
  try {
    const data = await SiteData.find({});
    res.send(data);
  } catch (err) {
    next(err);
  }
};

const editSiteData = async (req, res, next) => {
  const dataId = "data";
  const { order, lastEdited } = req.body;
  const update = { order, lastEdited };
  try {
    const data = await SiteData.findByIdAndUpdate({ _id: dataId }, update, {
      new: true,
      runValidators: true,
    });

    if (!data) {
      throw new NotFoundError("site data not found");
    }

    res.status(200).send({ data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSiteData,
  editSiteData,
};
