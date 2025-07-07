import React, { useEffect, useState } from "react";
import { getTransactions } from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  const month = label;
  const transactions = payload[0].payload.transactions || [];

  return (
    <div
      style={{
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "6px",
        padding: "8px",
        maxWidth: "90vw",
        maxHeight: "200px",
        overflowY: "auto",
      }}
    >
      <strong>{month}</strong>
      <hr style={{ margin: "4px 0" }} />
      {transactions.length === 0 ? (
        <p className="text-muted mb-0">No expenses</p>
      ) : (
        <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
          {transactions.map((txn, i) => (
            <li key={i}>
              ₹{txn.amount.toFixed(2)} — {txn.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function MonthlyExpenseChart() {
  const [allTransactions, setAllTransactions] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const availableYears = Array.from(
    new Set(allTransactions.map(txn => new Date(txn.date).getFullYear()))
  ).sort((a, b) => b - a);

  useEffect(() => {
    async function fetchData() {
      const res = await getTransactions();
      const data = Array.isArray(res.data) ? res.data : [];
      setAllTransactions(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const txnsThisYear = allTransactions.filter(
      (txn) => new Date(txn.date).getFullYear() === year
    );

    const groupedByMonth = {};
    for (let i = 0; i < 12; i++) groupedByMonth[i] = [];
    txnsThisYear.forEach((txn) => {
      const m = new Date(txn.date).getMonth();
      groupedByMonth[m].push(txn);
    });

    const data = months.map((m, idx) => ({
      month: m,
      total: groupedByMonth[idx].reduce((sum, t) => sum + t.amount, 0),
      transactions: groupedByMonth[idx],
    }));

    setChartData(data);
  }, [allTransactions, year]);

  useEffect(() => {
    function handleResize() {
      setIsSmallScreen(window.innerWidth < 768); 
    }

    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "1rem auto",
        backgroundColor: "#ffffff",
        border: "1px solid #dee2e6",
        borderRadius: "8px",
        padding: "0.5rem",
      }}
    >
      <div
        className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-2"
        style={{ gap: "0.5rem" }}
      >
        <h3 className="mb-1 mb-md-0" style={{ fontSize: "1.25rem", color: "#343a40" }}>
          Monthly Expenses - {year}
        </h3>
        <select
          className="form-select w-50 w-md-auto"
          style={{
            maxWidth: "180px",
            borderRadius: "6px",
            fontSize: "0.95rem",
            border: "1px solid #ced4da",
            padding: "0.25rem 0.5rem",
          }}
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
        >
          {availableYears.length === 0 && <option value={year}>{year}</option>}
          {availableYears.map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>
      </div>

      <div style={{ width: "100%", height: "300px" }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              interval={0}
              angle={isSmallScreen ? -45 : 0} 
              textAnchor={isSmallScreen ? "end" : "middle"}
            />
            <YAxis
              width={50}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total" fill="#007bff" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
