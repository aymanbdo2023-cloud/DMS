import "./styles/Register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/user-auth";

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [serverError, setServerError] = useState("");

  const handleRegister = async () => {
    setUsernameError("");
    setSuccessMsg("");
    setServerError("");

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await registerUser(username, password);
      console.log("Code: ", res.status);

      if (res.status === 201 || res.status == 204) {
        setSuccessMsg("User created");
        setTimeout(() => navigate("/login"), 1500);
      } else if (res.status === 500) {
        setServerError("Cannot create user right now, please try again later");
      } else {
        setUsernameError("Username already taken");
      }
    } catch (err) {
      console.error(err);
      setServerError("Cannot create user right now, please try again later");
    }
  };

  return (
    <div className="mainFrame">
      <div className="registerFrame">
        <h1 className="title">Create Account</h1>
        <div className="section">
          <label className="labels">Username</label>
          <input
            value={username}
            className={`input${usernameError ? " input-error" : ""}`}
            id="register-username-input"
            onChange={(e) => {
              setUsername(e.target.value);
              setUsernameError("");
            }}
          />
          {usernameError && (
            <span className="field-error">{usernameError}</span>
          )}
        </div>
        <div className="section">
          <label className="labels">Password</label>
          <input
            value={password}
            className="input"
            id="register-password-input"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="section">
          <label className="labels">Confirm Password</label>
          <input
            value={confirmPassword}
            className="input"
            id="register-confirm-input"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button
          onClick={handleRegister}
          className="btn-primary"
          id="register-button"
        >
          Register
        </button>
        <p className="switch-text">
          Already have an account?{" "}
          <span className="link" onClick={() => navigate("/login")}>
            Sign In
          </span>
        </p>
      </div>
      {successMsg && <div className="toast toast-success">{successMsg}</div>}
      {serverError && <div className="toast toast-error">{serverError}</div>}
    </div>
  );
}

export default RegisterPage;
