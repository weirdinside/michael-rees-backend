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
  const {
    order,
    personalWorkOrder,
    clientWorkOrder,
    lastEdited,
    homeClientList,
    veronikaVideos,
    personalWorkDescription,
    clientWorkDescription,
    veronikaWorkDescription,
    healthEnsuranceDescription,
  } = req.body;
  const update = {
    order,
    personalWorkOrder,
    clientWorkOrder,
    lastEdited,
    homeClientList,
    veronikaVideos,
    personalWorkOrder,
    personalWorkDescription,
    clientWorkDescription,
    veronikaWorkDescription,
    healthEnsuranceDescription,
  };
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
