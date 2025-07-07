// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const transactionRoutes = require("./apis/routes/transactionRoutes");
// const budgetRoutes = require("./apis/routes/budgets");
// require("dotenv").config();

// const app = express();

// // Middleware
// const allowedOrigins = [
//   "https://finance-visualizer-q89z.vercel.app", // production frontend
//   "http://localhost:5173"                       // local frontend
// ];

// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }));

// app.use(express.json());

// // API Routes
// app.use("/api/transactions", transactionRoutes);
// app.use("/api/budgets", budgetRoutes);

// // MongoDB connection
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// module.exports = app;


const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const transactionRoutes = require("./apis/routes/transactionRoutes");
const budgetRoutes = require("./apis/routes/budgets");
require("dotenv").config();

const app = express();

const allowedOrigins = [
  "https://finance-visualizer-q89z.vercel.app",
  "http://localhost:5173"                       
];


app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("CORS BLOCKED for origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));


app.options('*', cors());

app.use(express.json());


app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// API Routes
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = app;
