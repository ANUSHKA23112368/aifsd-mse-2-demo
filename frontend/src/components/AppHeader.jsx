import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { clearToken, getToken } from "../services/authService";

const AppHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = Boolean(getToken());

  const handleLogout = () => {
    clearToken();
    navigate("/login", { replace: true });
  };

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <NavLink to="/" className="brand-link">
          Student Grievance Addressal
        </NavLink>

        <nav className="nav-links" aria-label="Main navigation">
          <NavLink
            to="/login"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`.trim()}
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`.trim()}
          >
            Sign Up
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-link ${isActive || location.pathname === "/" ? "active" : ""}`.trim()
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/grievances"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`.trim()}
          >
            Grievances
          </NavLink>

          {isAuthenticated ? (
            <button type="button" className="nav-link nav-link--button" onClick={handleLogout}>
              Logout
            </button>
          ) : null}
        </nav>
      </div>
    </header>
  );
};

export default AppHeader;
