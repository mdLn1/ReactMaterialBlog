const router = require("express").Router();
const { check } = require("express-validator");
const {
  exceptionHandler,
  asyncMiddlewareExceptionHandler,
} = require("../utils");
const {
  createPost,
  getPosts,
  deletePost,
  editPost,
  getPostById,
} = require("../controllers/postController");
const {
  authenticationMiddleware,
  authorizationMiddleware,
  errorCheckerMiddleware,
  userCreateContentMiddleware
} = require("../middleware");
const {
  isPostContentValid,
  isPostTitleValid,
} = require("../utils/customValidators");
const {
  POST_CONTENT_ERROR,
  POST_TITLE_ERROR,
} = require("../utils/inputErrorMessages");

//@route api/posts/
//@desc Get all the posts
//@access Public
router.get("/", exceptionHandler(getPosts));

//@route api/posts/:postId
//@desc Get a post by id
//@access Public
router.get("/:postId", exceptionHandler(getPostById));

//@route api/posts/
//@desc Create a post
//@access Private and special privileges
router.post(
  "/",
  [
    check("title", POST_TITLE_ERROR)
      .trim()
      .custom((val) => isPostTitleValid(val)),
    check("content", POST_CONTENT_ERROR)
      .trim()
      .custom((val) => isPostContentValid(val)),
    errorCheckerMiddleware,
    authenticationMiddleware,
    asyncMiddlewareExceptionHandler(userCreateContentMiddleware),
    asyncMiddlewareExceptionHandler(authorizationMiddleware),
  ],
  exceptionHandler(createPost)
);

//@route api/posts/:id
//@desc Edit a post
//@access Private and special privileges
router.patch(
  "/:postId",
  [
    authenticationMiddleware,
    asyncMiddlewareExceptionHandler(userCreateContentMiddleware),
    asyncMiddlewareExceptionHandler(authorizationMiddleware),
  ],
  exceptionHandler(editPost)
);

//@route api/posts/:id
//@desc Delete a post
//@access Private and special privileges
router.delete(
  "/:postId",
  [
    authenticationMiddleware,
    asyncMiddlewareExceptionHandler(authorizationMiddleware),
  ],
  exceptionHandler(deletePost)
);

module.exports = router;
