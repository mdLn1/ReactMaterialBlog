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

  let { contentId, contentType } = req.params;

  if (
    !contentType &&
    typeof contentType === "string" &&
    CONTENT_TYPES.findIndex(contentType.toLowerCase()) === -1
  )
    throw new HttpError(
      `Content type must match one of the following ${CONTENT_TYPES.join(",")}`,
      400
    );

  contentType = contentType.toLowerCase();
  let content = null;

  // for a post
  if (contentType === CONTENT_TYPES[0]) {
    content = await Post.findById(contentId, "_id");
  }

  // for news
  if (contentType === CONTENT_TYPES[1]) {
    content = await News.findById(contentId, "_id");
  }

  // for a comment
  if (contentType === CONTENT_TYPES[2]) {
    content = await Comment.findById(contentId, "_id");
  }

  if (!content) throw new HttpError(`Reported ${contentType} not found`);

  const user = await User.findById(req.user.id, "_id");

  if (!user)
    throw new HttpError(
      `Could not find the user reporting this ${contentType}`
    );

  const foundReport = await Report.findOne({
    contentId: contentId,
    contentReportedType: contentType,
    author: user,
  });

  if (foundReport)
    throw new HttpError(
      `You already submitted a report for this ${contentType}`
    );

  const newReport = new Report({
    contentReportedType: contentType,
    contentId: contentId,
    author: user,
    reason: reason,
  });

  await newReport.save();

  res.status(204).end();
}

async function getReports(req, res) {
  let { sortOrder, pageNumber, pageSize, contentType, dismissed } = req.query;

  if (!pageNumber) pageNumber = 1;
  if (!sortOrder || ALLOWED_MONGO_SORT_FILTERS.indexOf(sortOrder) === -1)
    sortOrder = -1;

  if (typeof pageSize !== "number" || pageSize < 1) {
    pageSize = DEFAULT_PAGES_SIZE;
  }

  if (
    typeof contentType === "string" &&
    CONTENT_TYPES.indexOf(contentType.toLowerCase()) === -1
  )
    throw new HttpError(
      `Content type must match one of the following ${CONTENT_TYPES.join(",")}`,
      400
    );
  let filter = {};

  if (contentType) {
    contentType = contentType.toLowerCase();
    filter.contentReportedType = contentType;
  }

  if (dismissed === true || dismissed === false) filter.dismissed = dismissed;

  let totalResults = await Report.countDocuments(filter);

  const totalPages = Math.ceil(totalResults / pageSize);

  if (totalPages < pageNumber) pageNumber = totalPages;

  let results = await Report.find(filter)
    .skip(pageSize * (pageNumber - 1))
    .limit(pageSize)
    // default descending
    .sort({ reportedDate: sortOrder ? sortOrder : -1 });

  res.status(200).json({
    pageNumber,
    sortOrder,
    reports: results,
    contentType: contentType ? contentType : "ALL TYPES",
    totalPages: Math.ceil(totalResults / pageSize),
    totalReportsCount: totalResults,
  });
}

async function getReportsByContentId(req, res) {
  const { contentId } = req.params;

  let { sortOrder, pageNumber, pageSize, contentType, dismissed } = req.query;

  if (!pageNumber || !isNaN(pageNumber)) pageNumber = 1;

  if (!sortOrder || ALLOWED_MONGO_SORT_FILTERS.indexOf(sortOrder) === -1)
    sortOrder = -1;

  if (!contentId) throw new HttpError("You need to provide a content id", 400);

  if (typeof pageSize !== "number" || pageSize < 1) {
    pageSize = DEFAULT_PAGES_SIZE;
  }

  if (
    !contentType ||
    typeof contentType !== "string" ||
    CONTENT_TYPES.indexOf(contentType.toLowerCase()) === -1
  )
    throw new HttpError(
      `Content type must match one of the following ${CONTENT_TYPES.join(",")}`,
      400
    );

  contentType = contentType.toLowerCase();

  let totalResults =
    typeof dismissed === "boolean"
      ? await Report.countDocuments({
          contentId: contentId,
          contentReportedType: contentType,
          dismissed: dismissed,
        })
      : await Report.countDocuments({
          contentId: contentId,
          contentReportedType: contentType,
        });

  const totalPages = Math.ceil(totalResults / pageSize);

  if (totalPages < pageNumber) pageNumber = totalPages;

  let skipVal = pageSize * (pageNumber - 1);

  let results =
    typeof dismissed === "boolean"
      ? await Report.find({
          contentId: contentId,
          contentReportedType: contentType,
          dismissed: dismissed,
        })
          .skip(skipVal)
          .limit(pageSize)
          // default descending
          .sort({ reportedDate: sortOrder })
      : await Report.find({
          contentId: contentId,
          contentReportedType: contentType,
        })
          .skip(skipVal)
          .limit(pageSize)
          // default descending
          .sort({ reportedDate: sortOrder });

  res.status(200).json({
    pageNumber,
    sortOrder,
    reports: results,
    contentType,
    totalPages: Math.ceil(totalResults / pageSize),
    totalReportsCount: totalResults,
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
  getReportsByContentId,
};
