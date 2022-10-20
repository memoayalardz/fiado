const express = require("express");
let router = express.Router();
const transactionController = require('../controllers/transactions.controller');
router.route("/").post(transactionController.makeTransaction);
module.exports = router;
