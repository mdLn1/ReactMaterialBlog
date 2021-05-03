const router = require("express").Router();
const { check } = require("express-validator");
const {
  asyncMiddlewareExceptionHandler,
  exceptionHandler,
} = require("../utils");
const {
  errorCheckerMiddleware,
  authenticationMiddleware,
  authorizationMiddleware,
} = require("../middleware");

const {
  getUser,
  restrictUserAccess,
} = require("../controllers/userController");

const { BAN_IS_TEMPORARY_ERROR, BAN_TIME_IN_DAYS_ERROR } = require("../utils/inputErrorMessages");

//@route api/auth
//@desc Get user data
//@access Public
router.get("/:userId", exceptionHandler(getUser));

//@route api/auth
//@desc Ban user
//@access Private and restricted
router.post(
  "/:userId/ban",
  [
    check("isTemporary", BAN_IS_TEMPORARY_ERROR).isBoolean(),
    check("restrictionTimeInDays", BAN_TIME_IN_DAYS_ERROR).custom(
      (value, { req }) => {
        // if "isTemporary" provided and true must check that restrictionTimeInDays is a number
        if (!!req.body.isTemporary) {
          return !isNaN(value);
        }
        return true;
      }
    ),
    errorCheckerMiddleware,
    authenticationMiddleware,
    asyncMiddlewareExceptionHandler(authorizationMiddleware),
  ],
  exceptionHandler(restrictUserAccess)
);

module.exports = router;
