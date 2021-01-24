const router = require("express").Router();
const { check } = require("express-validator");
const {
  exceptionHandler,
  asyncMiddlewareExceptionHandler,
} = require("../utils");
const {
  authenticationMiddleware,
  authorizationMiddleware,
  errorCheckerMiddleware,
} = require("../middleware");
const {
  isNewsContentValid,
  isNewsTitleValid,
} = require("../utils/customValidators");
const {
  NEWS_CONTENT_ERROR,
  NEWS_TITLE_ERROR,
} = require("../utils/inputErrorMessages");
const {
  createNews,
  deleteNews,
  editNews,
  getAllNews,
  reportNews,
} = require("../controllers/newsController");

//@route api/news/
//@desc Get all the news
//@access Public
router.get("/", exceptionHandler(getAllNews));

//@route api/news/
//@desc Create news
//@access Private and special privileges
router.post(
  "/",
  [
    check("title", NEWS_TITLE_ERROR)
      .trim()
      .custom((val) => isNewsTitleValid(val)),
    check("content", NEWS_CONTENT_ERROR)
      .trim()
      .custom((val) => isNewsContentValid(val)),
    errorCheckerMiddleware,
    authenticationMiddleware,
    asyncMiddlewareExceptionHandler(authorizationMiddleware),
  ],
  exceptionHandler(createNews)
);

//@route api/news/:id
//@desc Edit a news
//@access Private and special privileges
router.patch(
  "/:newsId",
  [
    authenticationMiddleware,
    asyncMiddlewareExceptionHandler(authorizationMiddleware),
  ],
  exceptionHandler(editNews)
);

//@route api/news/:id
//@desc Delete a news
//@access Private and special privileges
router.delete(
  "/:newsId",
  [
    authenticationMiddleware,
    asyncMiddlewareExceptionHandler(authorizationMiddleware),
  ],
  exceptionHandler(deleteNews)
);

//@route api/news/:id/report
//@desc Report news
//@access Private and special privileges
router.post(
  "/:newsId/report",
  [authenticationMiddleware],
  exceptionHandler(reportNews)
);

module.exports = router;
