import { useEffect, useState } from "react";
import { getTransactions } from "../services/api";
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#FF5252", "#FFD740", "#40C4FF", "#69F0AE", "#FF4081", "#7C4DFF"];

export default function PieChart({ filter, refreshKey }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await getTransactions();
      const txns = Array.isArray(res.data) ? res.data : [];
      const now = new Date();

      const filteredTxns = txns.filter((txn) => {
        const txnDate = new Date(txn.date);
        if (filter === "week")
          return (now - txnDate) <= 7 * 24 * 60 * 60 * 1000;
        if (filter === "month")
          return txnDate.getMonth() === now.getMonth() &&
                 txnDate.getFullYear() === now.getFullYear();
        if (filter === "year")
          return txnDate.getFullYear() === now.getFullYear();
        return true; 
      });

      const grouped = {};
      filteredTxns.forEach((txn) => {
        grouped[txn.category] = (grouped[txn.category] || 0) + txn.amount;
      });

      const pieData = Object.keys(grouped).map((cat, index) => ({
        name: cat,
        value: grouped[cat],
        color: COLORS[index % COLORS.length],
      }));

      setData(pieData);
    }

    fetchData();
  }, [filter, refreshKey]); 

  return (
    <div>
      <h4>Category Breakdown</h4>
      <ResponsiveContainer width="100%" height={350}>
        <RePieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </RePieChart>
      </ResponsiveContainer>
      {data.length === 0 && (
        <p className="text-muted text-center mt-3">
          No data available for selected period
        </p>
      )}
    </div>
  );
}
