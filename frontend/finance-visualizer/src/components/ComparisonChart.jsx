import React, { useEffect, useRef, useState } from "react";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const categories = ["Food", "Transport", "Entertainment", "Utilities", "Health", "Other"];

export default function ComparisonChart({ 
  budgets, 
  transactions, 
  selectedMonth, 
  selectedYear,
  isMobile = false 
}) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [insights, setInsights] = useState({
    totalBudget: 0,
    totalSpent: 0,
    remaining: 0,
    percentageUsed: 0,
    overspent: false,
  });

  useEffect(() => {
    // Map budgets
    const budgetMap = Object.fromEntries(budgets.map(b => [b.category, b.amount]));

    // Filter and map transactions
    const filteredTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() === (selectedMonth - 1) && date.getFullYear() === selectedYear;
    });
    const transactionMap = {};
    filteredTransactions.forEach((t) => {
      transactionMap[t.category] = (transactionMap[t.category] || 0) + t.amount;
    });

    // Prepare data
    const budgetData = categories.map((cat) => budgetMap[cat] || 0);
    const transactionData = categories.map((cat) => transactionMap[cat] || 0);

    // Update insights
    const totalBudget = budgetData.reduce((sum, amt) => sum + amt, 0);
    const totalSpent = transactionData.reduce((sum, amt) => sum + amt, 0);
    const remaining = totalBudget - totalSpent;
    const percentageUsed = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
    const overspent = totalSpent > totalBudget;

    setInsights({ 
      totalBudget, 
      totalSpent, 
      remaining, 
      percentageUsed, 
      overspent 
    });

    // Chart configuration
    const chartConfig = {
      type: "bar",
      data: {
        labels: categories,
        datasets: [
          {
            label: "Budget",
            data: budgetData,
            backgroundColor: "rgba(75, 192, 192, 0.7)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "Spent",
            data: transactionData,
            backgroundColor: "rgba(255, 99, 132, 0.7)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 500 },
        scales: {
          x: { 
            title: { 
              display: true, 
              text: "Category",
              font: {
                size: isMobile ? 12 : 14
              }
            },
            ticks: {
              font: {
                size: isMobile ? 10 : 12
              }
            }
          },
          y: { 
            beginAtZero: true, 
            title: { 
              display: true, 
              text: "Amount (₹)",
              font: {
                size: isMobile ? 12 : 14
              }
            },
            ticks: {
              font: {
                size: isMobile ? 10 : 12
              },
              callback: function(value) {
                return isMobile ? `₹${value}` : `₹${value}`;
              }
            }
          },
        },
        plugins: {
          legend: {
            position: isMobile ? 'bottom' : 'top',
            labels: {
              font: {
                size: isMobile ? 12 : 14
              },
              padding: isMobile ? 10 : 20
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ₹${context.raw}`;
              }
            }
          }
        }
      }
    };

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, chartConfig);


    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [budgets, transactions, selectedMonth, selectedYear, isMobile]);

  return (
    <div className={`row g-3 ${isMobile ? 'flex-column-reverse' : ''}`}>
      {/* Chart Section */}
      <div className={`${isMobile ? 'col-12' : 'col-md-6'}`}>
        <div
          style={{
            height: isMobile ? '300px' : '400px',
            border: "1px solid #e0e0e0",
            borderRadius: "10px",
            padding: "15px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <h4 
            className="mb-3" 
            style={{ 
              fontSize: isMobile ? '1.25rem' : '1.5rem',
              color: '#2c3e50'
            }}
          >
            Budget vs. Spending
          </h4>
          <div style={{ flex: 1 }}>
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className={`${isMobile ? 'col-12' : 'col-md-6'}`}>
        <div
          style={{
            height: isMobile ? 'auto' : '400px',
            border: "1px solid #e0e0e0",
            borderRadius: "10px",
            padding: "20px",
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <h4 
            className="mb-3" 
            style={{ 
              fontSize: isMobile ? '1.25rem' : '1.5rem',
              color: '#2c3e50'
            }}
          >
            Spending Insights
          </h4>
          
          <div className="d-flex flex-column gap-2" style={{ flex: 1 }}>
            <div>
              <p className="mb-1" style={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                <strong>Total Budget:</strong>
              </p>
              <p style={{ 
                fontSize: isMobile ? '1.1rem' : '1.25rem',
                fontWeight: 500,
                color: '#16a085'
              }}>
                ₹{insights.totalBudget.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="mb-1" style={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                <strong>Total Spent:</strong>
              </p>
              <p style={{ 
                fontSize: isMobile ? '1.1rem' : '1.25rem',
                fontWeight: 500,
                color: '#e74c3c'
              }}>
                ₹{insights.totalSpent.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="mb-1" style={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                <strong>Remaining Budget:</strong>
              </p>
              <p style={{ 
                fontSize: isMobile ? '1.1rem' : '1.25rem',
                fontWeight: 500,
                color: insights.remaining >= 0 ? '#27ae60' : '#e74c3c'
              }}>
                ₹{Math.max(insights.remaining, 0).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="mb-1" style={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                <strong>Budget Used:</strong>
              </p>
              <div className="progress" style={{ height: '10px' }}>
                <div 
                  className={`progress-bar ${insights.percentageUsed > 90 ? 'bg-danger' : insights.percentageUsed > 70 ? 'bg-warning' : 'bg-success'}`}
                  role="progressbar" 
                  style={{ width: `${insights.percentageUsed}%` }}
                  aria-valuenow={insights.percentageUsed}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <p className="mt-1" style={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                {insights.percentageUsed.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}