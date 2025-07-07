import { useEffect, useState } from "react";
import { getTransactions } from "../services/api";

export default function TotalExpensesCard({ filter, refreshKey }) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const res = await getTransactions();
      const data = Array.isArray(res.data) ? res.data : [];
      const now = new Date();

      const filtered = data.filter((txn) => {
        const date = new Date(txn.date);
        if (filter === "week") return (now - date) / (1000 * 60 * 60 * 24) <= 7;
        if (filter === "month") return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        if (filter === "year") return date.getFullYear() === now.getFullYear();
        return true; 
      });

      const totalAmount = filtered.reduce((sum, txn) => sum + txn.amount, 0);
      setTotal(totalAmount);
    }
    fetchData();
  }, [filter, refreshKey]); 

  return (
    <div className="text-center">
      <h3>${total.toFixed(2)}</h3>
      <p className="text-muted mb-0">Total Expenses</p>
    </div>
  );
}
