const Income = require("../../models/Income");

const addIncome = async (req, res) => {
  try {
    const { date, amount, description } = req.body;
    
    const newIncome = new Income({
      date,
      amount,
      description
    });

    await newIncome.save();
    
    res.status(201).json({
      success: true,
      data: newIncome
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

const getIncomeData = async (req, res) => {
  try {
    const data = await Income.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: data.map(item => ({
        month: `${item._id.month}/${item._id.year}`,
        total: item.total
      }))
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = { addIncome, getIncomeData };