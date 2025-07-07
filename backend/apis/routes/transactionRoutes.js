const express = require("express");
const router = express.Router();
const {
  getTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction,
} = require("../controllers/transactionController");

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://finance-visualizer-q89z.vercel.app" 
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  next();
});

// GET all transactions
router.get("/", getTransactions);

// POST a new transaction
router.post("/", addTransaction);

// DELETE a transaction by ID
router.delete("/:id", deleteTransaction);

// UPDATE a transaction by ID
router.put("/:id", updateTransaction);

// Handle preflight requests
router.options("*", (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
