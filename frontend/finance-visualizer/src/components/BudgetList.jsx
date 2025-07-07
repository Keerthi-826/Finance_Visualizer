import React, { useEffect, useState } from "react";
import { getBudgets } from "../services/api";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function BudgetList({
  year,
  onEdit,
  onSelectMonth,
  selectedMonth,
  refreshKey,
}) {
  const [monthlyBudgets, setMonthlyBudgets] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getBudgets(year);
        const budgetsArray = Array.isArray(data) ? data : [];

        const grouped = {};
        budgetsArray.forEach((b) => {
          grouped[b.month] = (grouped[b.month] || 0) + b.amount;
        });
        setMonthlyBudgets(grouped);
      } catch (error) {
        console.error("Error fetching budgets:", error);
        setMonthlyBudgets({});
      }
    }
    if (year) fetchData();
  }, [year, refreshKey]);

  return (
    <div className="list-group">
      {monthNames.map((name, idx) => {
        const monthNum = idx + 1;
        const totalBudget = monthlyBudgets[monthNum] || 0;
        const active = selectedMonth === monthNum ? "active" : "";
        return (
          <div
            key={monthNum}
            className={`list-group-item d-flex justify-content-between align-items-center ${active}`}
            style={{ cursor: "pointer" }}
            onClick={() => onSelectMonth(monthNum)}
          >
            <span>{name}</span>
            <div>
              <span className="badge bg-secondary me-2">${totalBudget}</span>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(monthNum);
                }}
              >
                Edit
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
