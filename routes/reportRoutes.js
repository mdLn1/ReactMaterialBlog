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
const { REPORT_REASON_ERROR } = require("../utils/inputErrorMessages");
const {
  createReport,
  getReports,
  dismissReport,
} = require("../controllers/reportController");
const { isReportReasonValid } = require("../utils/customValidators");

//@route api/reports/
//@desc Get reports
//@access Private and special privileges
router.get(
  "/",
  [
    authenticationMiddleware,
    asyncMiddlewareExceptionHandler(authorizationMiddleware),
  ],
  exceptionHandler(getReports)
);

//@route api/reports/
//@desc Create a report
//@access Private
router.post(
  "/:type/:contentId",
  [
    check("reason", REPORT_REASON_ERROR)
      .trim()
      .custom((val) => isReportReasonValid(val)),
    errorCheckerMiddleware,
    authenticationMiddleware,
  ],
  exceptionHandler(createReport)
);

//@route api/reports/
//@desc Dismiss a report
//@access Private and special privileges
router.patch(
  "/:contentId",
  [
    authenticationMiddleware,
    asyncMiddlewareExceptionHandler(authorizationMiddleware),
  ],
  exceptionHandler(dismissReport)
);

module.exports = router;
