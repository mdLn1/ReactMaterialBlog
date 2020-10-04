const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const { exampleFunction } = require("../controllers/exampleController");
const exceptionHandler = require("../utils/exceptionHandler");

//@route GET api/example/
//@desc Get example
//@access Public
router.get("/", exceptionHandler(exampleFunction));


module.exports = router;