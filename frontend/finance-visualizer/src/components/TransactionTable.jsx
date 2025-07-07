import React, { useEffect, useState } from "react";
import { getTransactions, deleteTransaction, updateTransaction } from "../services/api";

const CATEGORIES = ["Food", "Transport", "Entertainment", "Utilities", "Health", "Other"];

export default function TransactionTable({
  limit,
  title = "Transaction History",
  onChange,
  compact = false,
}) {
  const [transactions, setTransactions] = useState([]);
  const [editData, setEditData] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [availableYears, setAvailableYears] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchTransactions = async () => {
    const res = await getTransactions();
    const data = Array.isArray(res.data) ? res.data : [];
    const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    setTransactions(limit ? sortedData.slice(0, limit) : sortedData);

    // Extract unique years from transaction dates
    const years = Array.from(
      new Set(sortedData.map((txn) => new Date(txn.date).getFullYear()))
    ).sort((a, b) => b - a); // Sort descending
    setAvailableYears(years);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((txn) => {
    const matchesCategory =
      categoryFilter === "All" || txn.category === categoryFilter;
    const txnYear = new Date(txn.date).getFullYear();
    const matchesYear = yearFilter === "All" || txnYear === parseInt(yearFilter);
    return matchesCategory && matchesYear;
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      await deleteTransaction(id);
      await fetchTransactions();
      if (onChange) onChange();
    }
  };

  const handleEdit = (txn) => setEditData(txn);

  const handleSave = async () => {
    try {
      await updateTransaction(editData._id, editData);
      setEditData(null);
      await fetchTransactions();
      if (onChange) onChange();
    } catch (err) {
      alert("Failed to update transaction.");
    }
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const trimText = (text, maxLength = 25) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isMobile) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString();
  };

  return (
    <div className="transaction-table-container">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        {title && (
          <h4 className="transaction-table-title">{title}</h4>
        )}
        {!compact && (
          <div className="d-flex gap-2 flex-wrap">
            {/* Year Filter */}
            <select
              className="form-select form-select-sm filter-select"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <option value="All">All Years</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              className="form-select form-select-sm filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="table-responsive">
        {isMobile ? (
          <div className="transaction-cards">
            {filteredTransactions.length === 0 ? (
              <div className="text-center text-muted py-4">
                No transactions found.
              </div>
            ) : (
              filteredTransactions.map((txn) => (
                <div key={txn._id} className="transaction-card card mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="card-title mb-1">
                          {trimText(txn.description, 30)}
                        </h6>
                        <small className="text-muted">
                          {formatDate(txn.date)}
                        </small>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold">${txn.amount.toFixed(2)}</div>
                        <span className="badge bg-secondary">{txn.category}</span>
                      </div>
                    </div>
                    {!compact && (
                      <div className="d-flex justify-content-end gap-2 mt-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEdit(txn)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(txn._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <table className="table table-hover table-bordered align-middle shadow-sm rounded">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount ($)</th>
                <th>Category</th>
                {!compact && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={compact ? 4 : 5} className="text-center text-muted py-4">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => (
                  <tr key={txn._id}>
                    <td>{formatDate(txn.date)}</td>
                    <td
                      title={txn.description}
                      className="text-wrap"
                    >
                      {compact ? trimText(txn.description, 25) : txn.description}
                    </td>
                    <td>${txn.amount.toFixed(2)}</td>
                    <td>
                      <span className="badge bg-secondary">{txn.category}</span>
                    </td>
                    {!compact && (
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(txn)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(txn._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
      {editData && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content shadow">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
              >
                <div className="modal-header">
                  <h5 className="modal-title">Edit Transaction</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setEditData(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Amount ($)</label>
                    <input
                      type="number"
                      name="amount"
                      className="form-control"
                      value={editData.amount}
                      onChange={handleChange}
                      required
                      step="0.01"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      name="date"
                      className="form-control"
                      value={editData.date.split("T")[0]}
                      onChange={handleChange}
                      required
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      rows="3"
                      value={editData.description}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      name="category"
                      className="form-select"
                      value={editData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditData(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .transaction-table-container {
          padding: 0.5rem;
        }
        .transaction-table-title {
          font-weight: 600;
          color: #343a40;
          margin: 0;
        }
        .filter-select {
          min-width: 120px;
        }
        .transaction-cards {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .transaction-card {
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        @media (max-width: 575.98px) {
          .filter-select {
            width: 100%;
            margin-bottom: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}