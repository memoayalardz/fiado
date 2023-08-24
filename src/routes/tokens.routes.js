const express = require("express");
let router = express.Router();
const jwtController = require('../controllers/jwt');
router.route("/generatetoken").get(jwtController.generateJWT);
router.route("/validatetoken").get(jwtController.verifyJWT);
module.exports = router;