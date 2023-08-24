const express = require("express");
let router = express.Router();
const clientsController = require('../controllers/clients.controller');
router.route("/account/:email").get(clientsController.getClientDataAccount);
router.route("/").get(clientsController.getAllClients);
module.exports = router;
