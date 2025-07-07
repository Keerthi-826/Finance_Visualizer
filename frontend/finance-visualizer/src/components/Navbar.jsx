export default function Navbar({ onMenuClick }) {
  return (
    <>
      <style>{`
        /* Extra small screens (≤360px) */
        @media (max-width: 360px) {
          .navbar-brand {
            font-size: 1rem !important;
            margin-left: 0.5rem !important;
          }
          .navbar-toggler {
            margin-right: 0.5rem !important;
          }
        }

        /* Small screens (361px–576px) */
        @media (min-width: 361px) and (max-width: 576px) {
          .navbar-brand {
            font-size: 1.2rem !important;
            margin-left: 1rem !important;
          }
          .navbar-toggler {
            margin-right: 1rem !important;
          }
        }

        /* Larger screens (>576px) */
        @media (min-width: 577px) {
          .navbar-brand {
            font-size: 1.8rem !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
        }

        /* Common styles */
        .navbar-brand {
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .navbar-toggler {
          font-size: 1.6rem !important;
          padding: 0.25rem 0.5rem !important;
        }
      `}</style>

      <nav
        className="navbar navbar-expand-lg"
        style={{
          backgroundColor: "#000",
          color: "#fff",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
          height: "70px",
        }}
      >
        <div className="container-fluid d-flex justify-content-start align-items-center">
          {/* Hamburger menu for small screens */}
          <button
            className="navbar-toggler d-lg-none"
            type="button"
            onClick={onMenuClick}
            style={{
              border: "none",
              color: "#fff",
              fontSize: "1.8rem",
              background: "none",
              outline: "none",
              cursor: "pointer",
            }}
            aria-label="Toggle menu"
          >
            &#9776;
          </button>
          <span
            className="navbar-brand"
            style={{
              color: "#fff",
              fontWeight: "700",
              letterSpacing: "0.5px",
              userSelect: "none",
            }}
          >
            Personal Finance Visualizer
          </span>
        </div>
      </nav>
    </>
  );
}
