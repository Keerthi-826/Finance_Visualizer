import React, { useState, useEffect, useMemo } from "react";
import BudgetEditModal from "./BudgetEditModal";
import ComparisonChart from "./ComparisonChart";
import { getBudgets, getTransactions } from "../services/api";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function BudgetManager() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; 
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [year, setYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [editMonth, setEditMonth] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [data, setData] = useState({ budgets: [], transactions: [] });

  const yearsRange = useMemo(() => {
    const range = isMobile ? 3 : 5;
    return Array.from({ length: range * 2 + 1 }, (_, i) => currentYear - range + i);
  }, [currentYear, isMobile]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [budgetsRes, transactionsRes] = await Promise.all([
          getBudgets(year, selectedMonth),
          getTransactions(year, selectedMonth),
        ]);

        setData({
          budgets: Array.isArray(budgetsRes.data) ? budgetsRes.data : [],
          transactions: Array.isArray(transactionsRes.data) ? transactionsRes.data : [],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setData({ budgets: [], transactions: [] });
      }
    }

    fetchData();
  }, [year, selectedMonth, refreshKey]);

  const memoizedChartProps = useMemo(() => ({
    selectedYear: year,
    selectedMonth,
    budgets: data.budgets,
    transactions: data.transactions,
    isMobile
  }), [year, selectedMonth, data.budgets, data.transactions, isMobile]);

  const openEditModal = (month) => setEditMonth(month);
  const closeEditModal = () => setEditMonth(null);
  const onSaveBudgets = () => {
    setRefreshKey((k) => k + 1);
    closeEditModal();
  };
  const onMonthClick = (month) => setSelectedMonth(month);


  const getMonthGridColumns = () => {
    if (isMobile) return "row-cols-3 row-cols-sm-4";
    if (window.innerWidth < 992) return "row-cols-4 row-cols-md-6";
    return "row-cols-6";
  };

  return (
    <div className="container-fluid px-2 px-md-3 px-lg-4">
      <div className="mb-3 d-flex flex-wrap justify-content-between align-items-center gap-3">
        <h2 className="mb-0" style={{ fontSize: isMobile ? "1.5rem" : "1.75rem" }}>
          Budget Manager
        </h2>
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="yearSelect" className="fw-semibold mb-0" style={{ fontSize: isMobile ? "0.9rem" : "1rem" }}>
            Year:
          </label>
          <select
            id="yearSelect"
            className="form-select form-select-sm"
            style={{ width: isMobile ? "100px" : "120px" }}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {yearsRange.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <div className={`row ${getMonthGridColumns()} g-2`}>
          {monthNames.map((name, idx) => {
            const monthNum = idx + 1;
            const isSelected = monthNum === selectedMonth;
            const isCurrentMonth = year === currentYear && monthNum === currentMonth;
            
            return (
              <div key={monthNum} className="col">
                <div
                  className={`card ${isSelected ? "bg-primary text-white" : isCurrentMonth ? "border-primary" : ""}`}
                  style={{ 
                    cursor: "pointer",
                    borderWidth: isCurrentMonth ? "2px" : "1px",
                    minHeight: isMobile ? "60px" : "70px"
                  }}
                  onClick={() => onMonthClick(monthNum)}
                >
                  <div className="card-body p-2 d-flex flex-column justify-content-between">
                    <div className="d-flex justify-content-between align-items-center">
                      <span style={{ 
                        fontSize: isMobile ? "0.85rem" : "0.9rem",
                        fontWeight: isSelected ? "600" : "normal"
                      }}>
                        {isMobile ? name.substring(0, 3) : name}
                      </span>
                      {isCurrentMonth && !isSelected && (
                        <span className="badge bg-primary rounded-pill" style={{ fontSize: "0.6rem" }}>
                          Current
                        </span>
                      )}
                    </div>
                    <button
                      className={`btn btn-sm align-self-end ${
                        isSelected ? "btn-light" : "btn-outline-secondary"
                      }`}
                      style={{
                        padding: isMobile ? "0.15rem 0.4rem" : "0.25rem 0.5rem",
                        fontSize: isMobile ? "0.7rem" : "0.8rem"
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(monthNum);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-4">
        <ComparisonChart {...memoizedChartProps} />
      </div>

      {editMonth && (
        <BudgetEditModal
          year={year}
          month={editMonth}
          onClose={closeEditModal}
          onSave={onSaveBudgets}
          isMobile={isMobile}
        />
      )}
    </div>
  );
}