// import React, { useEffect, useState } from "react";
// import { getBudgets, saveBudgets } from "../services/api";

// const allCategories = [
//   "Food",
//   "Transport",
//   "Entertainment",
//   "Utilities",
//   "Health",
//   "Other",
// ];

// export default function BudgetEditModal({ year, month, onClose, onSave }) {
//   const [budgets, setBudgets] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchBudgets() {
//       setLoading(true);
//       try {
//         const data = await getBudgets(year, month); // fetched budgets [{ category, amount }]
        
//         // Map existing budgets for quick lookup
//         const budgetMap = {};
//         (data || []).forEach((b) => {
//           budgetMap[b.category] = b.amount;
//         });

//         // Merge all categories with fetched data; default to 0 if missing
//         const mergedBudgets = allCategories.map((cat) => ({
//           category: cat,
//           amount: budgetMap[cat] !== undefined ? budgetMap[cat] : 0,
//         }));

//         setBudgets(mergedBudgets);
//       } catch (error) {
//         console.error("Failed to fetch budgets", error);
//         // On error, show all categories with 0 amount
//         const defaultBudgets = allCategories.map((cat) => ({
//           category: cat,
//           amount: 0,
//         }));
//         setBudgets(defaultBudgets);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchBudgets();
//   }, [year, month]);

//   function handleAmountChange(index, value) {
//     const newBudgets = [...budgets];
//     newBudgets[index] = {
//       ...newBudgets[index],
//       amount: value === "" ? "" : Number(value),
//     };
//     setBudgets(newBudgets);
//   }

//   async function handleSave() {
//     // Filter out budgets with no category or invalid amount
//     const validBudgets = budgets.filter(
//       (b) => b.category && b.amount !== "" && !isNaN(b.amount)
//     );
//     try {
//       await saveBudgets(year, month, validBudgets);
//       onSave();
//     } catch (error) {
//       console.error("Failed to save budgets", error);
//       alert("Error saving budgets. Please try again.");
//     }
//   }

//   return (
//     <>
//       <div
//         className="modal-backdrop fade show"
//         style={{ zIndex: 1040 }}
//         onClick={onClose}
//       ></div>

//       <div
//         className="modal d-block"
//         tabIndex={-1}
//         role="dialog"
//         aria-modal="true"
//         style={{ zIndex: 1050 }}
//       >
//         <div className="modal-dialog modal-lg" role="document">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h5 className="modal-title">
//                 Edit Budgets for {monthName(month)} {year}
//               </h5>
//               <button
//                 type="button"
//                 className="btn-close"
//                 onClick={onClose}
//                 aria-label="Close"
//               ></button>
//             </div>

//             <div className="modal-body">
//               {loading ? (
//                 <p>Loading...</p>
//               ) : budgets.length === 0 ? (
//                 <p>No budget categories found for this month.</p>
//               ) : (
//                 <form>
//                   {budgets.map((b, index) => (
//                     <div className="mb-3 row" key={b.category}>
//                       <label
//                         htmlFor={`amount-${index}`}
//                         className="col-sm-6 col-form-label"
//                       >
//                         {b.category}
//                       </label>
//                       <div className="col-sm-6">
//                         <input
//                           type="number"
//                           className="form-control"
//                           id={`amount-${index}`}
//                           value={b.amount || 0}
//                           onChange={(e) =>
//                             handleAmountChange(index, e.target.value)
//                           }
//                           min={0}
//                           step="0.01"
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </form>
//               )}
//             </div>

//             <div className="modal-footer">
//               <button
//                 type="button"
//                 className="btn btn-secondary"
//                 onClick={onClose}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 className="btn btn-primary"
//                 onClick={handleSave}
//                 disabled={loading || budgets.length === 0}
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// // Helper function for month name from number
// function monthName(monthNum) {
//   const monthNames = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
//   ];
//   return monthNames[monthNum - 1] || "";
// }


import React, { useEffect, useState } from "react";
import { getBudgets, saveBudgets } from "../services/api";

const allCategories = [
  "Food",
  "Transport",
  "Entertainment",
  "Utilities",
  "Health",
  "Other",
];

export default function BudgetEditModal({ year, month, onClose, onSave }) {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    async function fetchBudgets() {
      setLoading(true);
      try {
        const response = await getBudgets(year, month);
        const data = response.data || [];
        
        // Create map of existing budgets
        const budgetMap = {};
        data.forEach((b) => {
          budgetMap[b.category] = b.amount;
        });

        // Store initial values for comparison
        setInitialValues({ ...budgetMap });

        // Merge all categories with fetched data (default to 0 if no data exists)
        const mergedBudgets = allCategories.map((cat) => ({
          category: cat,
          amount: budgetMap[cat] !== undefined ? budgetMap[cat] : 0,
        }));

        setBudgets(mergedBudgets);
      } catch (error) {
        console.error("Failed to fetch budgets", error);
        // Initialize with all categories at 0 if there's an error
        const defaultBudgets = allCategories.map((cat) => ({
          category: cat,
          amount: 0,
        }));
        setBudgets(defaultBudgets);
        setInitialValues(Object.fromEntries(allCategories.map(cat => [cat, 0])));
      } finally {
        setLoading(false);
      }
    }

    fetchBudgets();
  }, [year, month]);

  function handleAmountChange(index, value) {
    const newBudgets = [...budgets];
    newBudgets[index] = {
      ...newBudgets[index],
      amount: value === "" ? "" : Number(value),
    };
    setBudgets(newBudgets);
  }

  async function handleSave() {
    // Filter out invalid entries
    const validBudgets = budgets.filter(
      (b) => b.category && !isNaN(b.amount) && b.amount !== ""
    );

    try {
      await saveBudgets(year, month, validBudgets);
      onSave();
    } catch (error) {
      console.error("Failed to save budgets", error);
      alert("Error saving budgets. Please try again.");
    }
  }

  return (
    <>
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1040 }}
        onClick={onClose}
      ></div>

      <div
        className="modal d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        style={{ zIndex: 1050 }}
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Edit Budgets for {monthName(month)} {year}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <form>
                  {budgets.map((b, index) => (
                    <div className="mb-3 row align-items-center" key={b.category}>
                      <label
                        htmlFor={`amount-${index}`}
                        className="col-sm-4 col-form-label"
                      >
                        {b.category}
                      </label>
                      <div className="col-sm-6">
                        <div className="input-group">
                          <span className="input-group-text">₹</span>
                          <input
                            type="number"
                            className="form-control"
                            id={`amount-${index}`}
                            value={b.amount === "" ? "" : b.amount}
                            onChange={(e) => handleAmountChange(index, e.target.value)}
                            min={0}
                            step="1"
                            placeholder="Enter amount"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </form>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Helper function for month name from number
function monthName(monthNum) {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return monthNames[monthNum - 1] || "";
}