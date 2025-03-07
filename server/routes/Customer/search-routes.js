const express = require("express");

const { searchProducts } = require("../../controllers/Customer/search-controller");

const router = express.Router();

router.get("/:keyword", searchProducts);

module.exports = router;
