if (require("dotenv")) require("dotenv").config();
const News = require("../models/news");
const User = require("../models/user");
const {
  isNewsContentValid,
  isNewsTitleValid,
} = require("../utils/customValidators");
const HttpError = require("../utils/httpError");

async function createNews(req, res) {
  const { title, content, link, displayFromDate, displayUntilDate } = req.body;

  const user = await User.findById(req.user.id, "email username name _id");

  let newNews = new News({
    title,
    content,
    link,
    displayUntilDate,
    displayFromDate,
    author: user,
  });

  await newNews.save();

  res.status(201).json({ news: newNews });
}

async function getAllNews(req, res) {
  res.status(200).json({ news: await News.find({}) });
}

async function getNewsById(req, res) {
  const { newsId } = req.params;

  if (!newsId || typeof newsId !== "string")
    throw new HttpError("News not found");

  const foundNews = await News.findById(newsId).populate(
    "author",
    "name username _id "
  );

  if (!foundNews) throw new HttpError("News not found");

  res.status(200).json(foundNews);
}

async function editNews(req, res) {
  const { title, content } = req.body;
  const { newsId } = req.params;

  if (!newsId || typeof newsId !== "string")
    throw new HttpError("News not found");

  const foundNews = await News.findById(newsId, "_id author title content");

  if (!foundNews) throw new HttpError("News not found");

  let isNewsEdited = false;

  if (title && title !== foundNews.title && isNewsTitleValid(title)) {
    foundNews.title = title;
    isNewsEdited = true;
  }

  if (content && content !== foundNews.content && isNewsContentValid(content)) {
    foundNews.content = content;
    isNewsEdited = true;
  }

  if (isNewsEdited) await foundNews.save();

  res.status(200).json({ news: foundNews });
}

async function deleteNews(req, res) {
  const { newsId } = req.query;

  if (!newsId || typeof newsId !== "string")
    throw new HttpError("News not found", 404);

  if (process.env.ACTUAL_DELETE_DATA_ENABLED) {
    const newsDeleted = await News.findByIdAndDelete(newsId);

    if (!newsDeleted) throw new HttpError("Failed to delete post", 400);
  } else {
    const newsDeleted = await News.findById(newsId);

    newsDeleted.deleted = true;

    await newsDeleted.save();
  }
  res.status(204).end();
}

module.exports = { createNews, getAllNews, getNewsById, editNews, deleteNews };
