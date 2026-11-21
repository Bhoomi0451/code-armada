import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Swords,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight
} from "lucide-react";

import "../App.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password");
      return;
    }

    alert("Login UI working! Backend authentication will be integrated later.");
  };

  return (
    <div className="auth-page">

      <Link to="/" className="auth-logo">
        <Swords size={28} />
        <span>CODE<span className="purple">ARMADA</span></span>
      </Link>

      <div className="auth-card">

        <div className="auth-icon">
          <Swords size={30} />
        </div>

        <h1>Welcome Back!</h1>

        <p className="auth-subtitle">
          Your next coding battle awaits.
        </p>

        <form onSubmit={handleLogin}>

          <label>Email Address</label>

          <div className="input-box">
            <Mail size={19} />

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label>Password</label>

          <div className="input-box">
            <Lock size={19} />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>

          </div>

          <div className="auth-options">
            <label className="remember">
              <input type="checkbox" />
              Remember me
            </label>

            <button type="button" className="forgot-btn">
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="auth-submit">
            Login to Arena <ArrowRight size={18}/>
          </button>

        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <p className="auth-bottom">
          Don't have an account?
          <Link to="/register"> Create Account</Link>
        </p>

      </div>

      <p className="auth-footer">
        © 2026 Code Armada. All rights reserved.
      </p>

    </div>
  );
}

export default Login;