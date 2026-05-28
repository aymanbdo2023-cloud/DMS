import "./styles/Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authUser } from "../api/user-auth";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await authUser(username, password);
      console.log("User id logged in: ", response.id);
    } catch (err) {
      alert("Login Failed");
    }
  };

  return (
    <div className="mainFrame">
      <div className="loginFrame">
        <h1 className="title">Sign In</h1>
        <div className="section">
          <label className="labels">Username</label>
          <input
            value={username}
            className="input"
            id="username-input"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="section">
          <label className="labels">Password</label>
          <input
            value={password}
            className="input"
            id="password-input"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={handleLogin} className="btn-primary" id="login-button">
          Sign In
        </button>
        <p className="switch-text">
          Don't have an account?{" "}
          <span className="link" onClick={() => navigate("/register")}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
