import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import TransactionTable from "./components/TransactionTable";
import MonthlyExpenseChart from "./components/MonthlyExpenseChart";
import BudgetPage from "./components/BudgetManager";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

function App() {
  const [activeView, setActiveView] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderMain = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />;
      case "history":
        return <TransactionTable />;
      case "monthly":
        return <MonthlyExpenseChart />;
      case "budget":
        return <BudgetPage />;
      default:
        return <Dashboard />;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-container d-flex">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <div className="flex-grow-1">
        <Navbar onMenuClick={toggleSidebar} />
        <main className="p-4">{renderMain()}</main>
      </div>
    </div>
  );
}

export default App;
