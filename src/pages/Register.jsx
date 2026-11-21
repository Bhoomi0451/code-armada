import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Swords,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight
} from "lucide-react";

import "../App.css";

function Register() {

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (formData.password.length < 8) {
      alert("Password must contain at least 8 characters.");
      return;
    }

    alert("Registration UI working! Backend integration will come later.");
  };

  return (

    <div className="auth-page">

      <Link to="/" className="auth-logo">
        <Swords size={28}/>
        <span>CODE<span className="purple">ARMADA</span></span>
      </Link>

      <div className="auth-card register-card">

        <div className="auth-icon">
          <Swords size={30}/>
        </div>

        <h1>Join The Arena</h1>

        <p className="auth-subtitle">
          Create your account and start competing.
        </p>

        <form onSubmit={handleRegister}>

          <label>Full Name</label>

          <div className="input-box">
            <User size={19}/>

            <input
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <label>Username</label>

          <div className="input-box">
            <User size={19}/>

            <input
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <label>Email Address</label>

          <div className="input-box">
            <Mail size={19}/>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <label>Password</label>

          <div className="input-box">
            <Lock size={19}/>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
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

          <label>Confirm Password</label>

          <div className="input-box">
            <Lock size={19}/>

            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-submit">
            Create Account <ArrowRight size={18}/>
          </button>

        </form>

        <p className="auth-bottom">
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>

      </div>

      <p className="auth-footer">
        © 2026 Code Armada. All rights reserved.
      </p>

    </div>
  );
}

export default Register;