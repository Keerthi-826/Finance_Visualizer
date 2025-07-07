export default function Sidebar({
  setActiveView,
  activeView,
  isOpen,
  setIsOpen,
}) {
  const links = [
    { name: "Dashboard", key: "dashboard" },
    { name: "Transaction History", key: "history" },
    { name: "Monthly Expenses", key: "monthly" },
    { name: "Budget Manager", key: "budget" },
  ];

  return (
    <>
      <style>{`
        .sidebar {
          position: fixed;
          top: 70px; /* below navbar */
          left: 0;
          width: 220px;
          height: calc(100vh - 70px);
          background-color: #f8f9fa;
          border-right: 1px solid #dee2e6;
          overflow-y: auto;
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease-in-out;
          z-index: 1050;
        }
        .sidebar-hidden {
          transform: translateX(-100%);
        }
        .sidebar .list-group-item {
          background-color: transparent;
          color: #000;
          border: none;
          text-align: left;
          font-weight: 500;
          padding: 12px 20px;
          transition: background-color 0.3s, color 0.3s;
          cursor: pointer;
        }
        .sidebar .list-group-item:hover {
          background-color: #e9ecef;
        }
        .sidebar .list-group-item.active {
          background-color: #444; /* lighter black */
          color: #fff;
        }

        @media (min-width: 992px) {
          .sidebar {
            transform: none !important;
          }
        }
      `}</style>

      <div
        className={`sidebar ${isOpen ? "" : "sidebar-hidden"}`}
        onClick={() => setIsOpen(false)} 
      >
        <div className="list-group list-group-flush">
          {links.map((link) => (
            <button
              key={link.key}
              className={`list-group-item list-group-item-action ${
                activeView === link.key ? "active" : ""
              }`}
              onClick={() => {
                setActiveView(link.key);
                setIsOpen(false); 
              }}
            >
              {link.name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
