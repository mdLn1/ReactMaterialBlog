const router = require("express").Router();
const { check, body } = require("express-validator");
const exceptionHandler = require("../utils/exceptionHandler");
const {
  errorCheckerMiddleware,
  authenticationMiddleware,
  authorizationMiddleware,
} = require("../middleware");
const { getUsers } = require("../controllers/testController");

router.get("/test", exceptionHandler(getUsers));

router.post(
  "/",
  [
    check("isTemporary", "is temporary not provided").isBoolean(),
    check("restrictionTimeInDays", "restrictionTimeInDays not provided").custom(
      (value, { req }) => {
        if (!!req.body.isTemporary) {
          return !isNaN(value);
        }
        return true;
      }
    ),
    errorCheckerMiddleware,
  ],
  function (req, res) {
    return res.status(200).json({ message: "success" });
  }
);

module.exports = router;
