import React, { useState, useEffect } from "react";
import TotalExpensesCard from "./TotalExpensesCard";
import PieChart from "./PieChart";
import TransactionTable from "./TransactionTable";
import AddTransactionModal from "./AddTransactionModal";

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };
  
  const styles = {
    card: {
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      backgroundColor: "#fff",
      border: "none",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      minHeight: isMobile ? "auto" : "400px"
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#f8f9fa",
      padding: "0.75rem 1rem",
      borderBottom: "1px solid #dee2e6",
      borderRadius: "12px 12px 0 0",
      fontWeight: 500,
      fontSize: isMobile ? "1rem" : "1.1rem",
      flexWrap: "wrap",
      gap: "0.5rem"
    },
    btnPrimary: {
      borderRadius: "50px",
      padding: "0.5rem 1.25rem",
      fontSize: isMobile ? "0.9rem" : "1rem",
      whiteSpace: "nowrap"
    },
    btnOutline: {
      borderRadius: "50px",
      padding: isMobile ? "0.35rem 0.75rem" : "0.5rem 1rem",
      fontSize: isMobile ? "0.8rem" : "0.9rem"
    },
    dropdownMenu: {
      borderRadius: "8px",
      border: "none",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
    },
    blurStyle: showModal ? {
      filter: "blur(4px)",
      pointerEvents: "none",
      userSelect: "none",
      transition: "filter 0.3s ease",
      overflow: "hidden"
    } : {
      filter: "none",
      transition: "filter 0.3s ease"
    },
    header: {
      fontWeight: 600,
      color: "#343a40",
      fontSize: isMobile ? "1.5rem" : "1.75rem",
      marginBottom: "1rem"
    },
    gridContainer: {
      minHeight: "60vh",
      marginBottom: isMobile ? "2rem" : "0"
    }
  };

  return (
    <>
      <div style={styles.blurStyle}>
        <div className="container-fluid px-3 px-md-4 px-lg-5">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <h2 style={styles.header}>Dashboard</h2>
            <button
              className="btn btn-primary shadow-sm"
              style={styles.btnPrimary}
              onClick={() => setShowModal(true)}
            >
              + Add Transaction
            </button>
          </div>
          
          <div className="row g-4" style={styles.gridContainer}>
            {/* Left Card: Total Expenses & Pie Chart */}
            <div className="col-12 col-lg-5 d-flex">
              <div className="card w-100" style={styles.card}>
                <div style={styles.cardHeader}>
                  <span>Expenses Overview</span>
                  <div className="dropdown">
                    <button
                      className="btn btn-outline-secondary dropdown-toggle shadow-sm"
                      style={styles.btnOutline}
                      type="button"
                      id="filterDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {filter === "all"
                        ? "All Time"
                        : filter === "week"
                        ? "Last Week"
                        : filter === "month"
                        ? "Last Month"
                        : "Last Year"}
                    </button>
                    <ul
                      className="dropdown-menu"
                      style={styles.dropdownMenu}
                      aria-labelledby="filterDropdown"
                    >
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleFilterChange("week")}
                        >
                          Last Week
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleFilterChange("month")}
                        >
                          Last Month
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleFilterChange("year")}
                        >
                          Last Year
                        </button>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleFilterChange("all")}
                        >
                          All Time
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-body d-flex flex-column" style={{ flexGrow: 1 }}>
                  <TotalExpensesCard 
                    filter={filter} 
                    refreshKey={refreshKey} 
                    isMobile={isMobile} 
                  />
                  <hr className="my-3" />
                  <div style={{ flexGrow: 1 }}>
                    <PieChart 
                      filter={filter} 
                      refreshKey={refreshKey} 
                      isMobile={isMobile} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Recent Transactions */}
            <div className="col-12 col-lg-7 d-flex">
              <div className="card w-100" style={styles.card}>
                <div style={styles.cardHeader}>
                  Recent Transactions
                </div>
                <div className="card-body p-0" style={{ flexGrow: 1 }}>
                  <TransactionTable
                    limit={isMobile ? 3 : 5}
                    filter={filter}
                    title={null}
                    onChange={triggerRefresh}
                    compact={true}
                    isMobile={isMobile}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          triggerRefresh();
        }}
        isMobile={isMobile}
      />
    </>
  );
}