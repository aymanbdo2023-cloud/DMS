import "./styles/Login.css";

function LoginPage() {
  return (
    <div className="mainFrame">
      <div className="loginFrame">
        <div className="section">
          <label className="labels">Username</label>
          <input className="input" id="username-input" />
        </div>
        <div className="section">
          <label className="labels">Password</label>
          <input className="input" id="password-input" type="password" />
        </div>
        <button className="btn-primary" id="login-button">
          Login
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
