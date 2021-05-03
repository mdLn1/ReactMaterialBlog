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
  userCreateContentMiddleware
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
  getNewsById,
} = require("../controllers/newsController");

//@route api/news/
//@desc Get all the news
//@access Public
router.get("/", exceptionHandler(getAllNews));

//@route api/news/:newsId
//@desc Get the news by id
//@access Public
router.get("/:newsId", exceptionHandler(getNewsById));

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
    asyncMiddlewareExceptionHandler(userCreateContentMiddleware),
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
    asyncMiddlewareExceptionHandler(userCreateContentMiddleware),
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

module.exports = router;
