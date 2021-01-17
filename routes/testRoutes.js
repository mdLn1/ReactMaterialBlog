const router = require("express").Router();
const exceptionHandler = require("../utils/exceptionHandler");
const { getUsers } = require("../controllers/testController");

router.get("/test", exceptionHandler(getUsers));

module.exports = router;
