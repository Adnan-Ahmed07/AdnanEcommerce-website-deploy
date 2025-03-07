const express = require("express");
const { addIncome, getIncomeData } = require("../../controllers/admin/income-controller");
const router = express.Router();

router.post("/add", addIncome);
router.get("/data", getIncomeData);

module.exports = router;