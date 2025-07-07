const express = require("express");
const router = express.Router();
const Budget = require("../../models/Budget");

// CORS middleware for budget routes
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://finance-visualizer-q89z.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Helper function for validation
const validateBudgetInput = (year, month, budgets) => {
  if (!year || isNaN(year)) return "Year must be a valid number";
  if (month && isNaN(month)) return "Month must be a valid number";
  if (!Array.isArray(budgets)) return "Budgets must be an array";
  
  for (const item of budgets) {
    if (!item.category || typeof item.category !== 'string') 
      return "Each budget item must have a valid category";
    if (!item.amount || isNaN(item.amount)) 
      return "Each budget item must have a valid amount";
  }
  return null;
};

// Create or Update Budgets
router.post("/", async (req, res) => {
  const { year, month, budgets } = req.body;
  if (!year || !month || !budgets) {
    return res.status(400).json({ error: "Year, month, and budgets are required" });
  }

  try {
    for (const item of budgets) {
      await Budget.findOneAndUpdate(
        { year, month, category: item.category },
        { amount: item.amount },
        { upsert: true, new: true }
      );
    }
    res.status(200).json({ message: "Budgets saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save budgets" });
  }
});

// Get Budgets for a Month or Year
router.get("/", async (req, res) => {
  const { year, month } = req.query;
  if (!year) {
    return res.status(400).json({ error: "Year query param is required" });
  }

  try {
    const query = { year: parseInt(year) };
    if (month) query.month = parseInt(month);
    const budgets = await Budget.find(query);
    res.status(200).json(budgets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch budgets" });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const result = await Budget.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Budget not found" });
    }
    res.status(200).json({ message: "Budget deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete budget" });
  }
});

// Handle preflight requests
router.options("*", (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
