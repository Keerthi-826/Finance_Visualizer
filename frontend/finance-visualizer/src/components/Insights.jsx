import React from "react";

export default function Insights({ budgets, transactions }) {
  return (
    <div>
      {budgets.map(b => {
        const spent = transactions
          .filter(t => t.category === b.category)
          .reduce((sum, t) => sum + t.amount, 0);
        const diff = b.amount - spent;
        return (
          <div
            key={b.category}
            className={`alert ${diff >= 0 ? "alert-success" : "alert-danger"} d-flex justify-content-between`}
          >
            <span>{b.category}</span>
            <span>
              {diff >= 0
                ? `Under budget by $${diff.toFixed(2)}`
                : `Over budget by $${Math.abs(diff).toFixed(2)}`}
            </span>
          </div>
        );
      })}
    </div>
  );
}
