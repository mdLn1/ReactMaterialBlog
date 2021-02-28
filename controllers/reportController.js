if (require("dotenv")) require("dotenv").config();
const User = require("../models/user");
const Report = require("../models/report");
const Post = require("../models/post");
const Comment = require("../models/comment");
const News = require("../models/news");
const HttpError = require("../utils/httpError");
const {
  CONTENT_TYPES,
  DEFAULT_PAGES_SIZE,
  ALLOWED_MONGO_SORT_FILTERS,
} = require("../utils/constants");

async function createReport(req, res) {
  const { reason } = req.body;

  let { contentId, type } = req.params;

  if (
    !type &&
    typeof type === "string" &&
    CONTENT_TYPES.findIndex(type.toLowerCase()) === -1
  )
    throw new HttpError(
      `Content type must match one of the following ${CONTENT_TYPES.join(",")}`,
      400
    );

  type = type.toLowerCase();
  let content = null;

  // for a post
  if (type === CONTENT_TYPES[0]) {
    content = await Post.findById(contentId, "_id");
  }

  // for news
  if (type === CONTENT_TYPES[1]) {
    content = await News.findById(contentId, "_id");
  }

  // for a comment
  if (type === CONTENT_TYPES[2]) {
    content = await Comment.findById(contentId, "_id");
  }

  if (!content) throw new HttpError(`Reported ${type} not found`);

  const user = await User.findById(req.user.id, "_id");

  if (!user)
    throw new HttpError(`Could not find the user reporting this ${type}`);

  const newReport = new Report({
    contentReportedType: type,
    contentId: contentId,
    author: user,
    reason: reason,
  });

  await newReport.save();

  res.status(204).end();
}

async function getReports(req, res) {
  let { sortOrder, pageNumber, type } = req.query;

  if (!pageNumber) pageNumber = 1;

  if (!sortOrder || ALLOWED_MONGO_SORT_FILTERS.indexOf(sortOrder) === -1)
    sortOrder = -1;

  if (
    !type &&
    typeof type === "string" &&
    CONTENT_TYPES.indexOf(type.toLowerCase()) === -1
  )
    throw new HttpError(
      `Content type must match one of the following ${CONTENT_TYPES.join(",")}`,
      400
    );

  type = type.toLowerCase();

  let totalResults = await Report.countDocuments({
    contentReportedType: type,
    dismissed: false,
  });

  const totalPages = Math.ceil(totalResults / DEFAULT_PAGES_SIZE);

  if (totalPages < pageNumber) pageNumber = totalPages;

  let results = await Report.find({
    contentReportedType: type,
    dismissed: false,
  })
    .skip(DEFAULT_PAGES_SIZE * (pageNumber - 1))
    .limit(DEFAULT_PAGES_SIZE)
    // default descending
    .sort({ reportedDate: sortOrder ? sortOrder : -1 });

  res.status(200).json({
    pageNumber,
    sortOrder,
    results,
    contentType: type,
    totalPages: Math.ceil(totalResults / DEFAULT_PAGES_SIZE),
  });
}

async function dismissReport(req, res) {
  const { reportId } = req.params;
  if (!reportId || typeof reportId !== "string")
    throw new HttpError("Report not found");

  const foundReport = await Report.findById(reportId);

  if (!foundReport) throw new HttpError("Report not found");

  if (!foundReport.dismissed) {
    foundReport.dismissed = true;
    await foundReport.save();
  }
  res.status(204).end();
}

module.exports = {
  createReport,
  getReports,
  dismissReport,
};
