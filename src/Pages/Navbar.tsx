import { useNavigate, useLocation } from "react-router-dom";
import "./styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userRaw = localStorage.getItem("user");
  const username = userRaw ? JSON.parse(userRaw).username : "";

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => navigate("/inbox")}>
        DMS
      </div>
      <div className="nav-links">
        <span
          className={`nav-link${location.pathname === "/inbox" ? " nav-link-active" : ""}`}
          onClick={() => navigate("/inbox")}
        >
          Inbox
        </span>
        <span
          className={`nav-link${location.pathname === "/send" ? " nav-link-active" : ""}`}
          onClick={() => navigate("/send")}
        >
          Send File
        </span>
      </div>
      <div className="nav-right">
        <span className="nav-username">{username}</span>
        <button className="nav-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
