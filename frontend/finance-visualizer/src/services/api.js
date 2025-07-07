import axios from "axios";

const API_BASE_URL = import.meta.env.PROD
  ? "https://finance-visualizer-keerthis-projects-474707b8.vercel.app/api"
  : "http://localhost:5173/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true // Include cookies if using authentication
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Standardize successful response format
    return {
      success: true,
      data: response.data,
      status: response.status
    };
  },
  (error) => {
    // Standardize error response format
    if (error.response) {
      // Server responded with error status
      return Promise.reject({
        success: false,
        message: error.response.data?.error || "Request failed",
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject({
        success: false,
        message: "No response from server",
        status: 503
      });
    } else {
      // Something happened in setting up the request
      return Promise.reject({
        success: false,
        message: error.message,
        status: 500
      });
    }
  }
);

// Transactions API
export const getTransactions = async () => {
  try {
    const response = await api.get("/transactions");
    return response;
  } catch (error) {
    console.error("Get transactions error:", error);
    throw error;
  }
};

export const addTransaction = async (data) => {
  try {
    const response = await api.post("/transactions", data);
    return response;
  } catch (error) {
    console.error("Add transaction error:", error);
    throw error;
  }
};

export const deleteTransaction = async (id) => {
  try {
    const response = await api.delete(`/transactions/${id}`);
    return response;
  } catch (error) {
    console.error("Delete transaction error:", error);
    throw error;
  }
};

export const updateTransaction = async (id, data) => {
  try {
    const response = await api.put(`/transactions/${id}`, data);
    return response;
  } catch (error) {
    console.error("Update transaction error:", error);
    throw error;
  }
};

// Budgets API
export const getBudgets = async (year, month) => {
  try {
    const response = await api.get(
      `/budgets?year=${year}${month ? `&month=${month}` : ""}`
    );
    return response;
  } catch (error) {
    console.error("Get budgets error:", error);
    throw error;
  }
};

export const saveBudgets = async (year, month, budgets) => {
  try {
    const response = await api.post("/budgets", { year, month, budgets });
    return response;
  } catch (error) {
    console.error("Save budgets error:", error);
    throw error;
  }
};