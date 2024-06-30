import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../utils/api";
import "./auth.scss";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setShowPopup(true);
    } catch (error) {
      console.error("Registration error:", error);
      setError(
        error.response?.data?.msg || "Registration failed. Please try again."
      );
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    navigate("/login");
  };

  return (
    <section>
      <div className="header">
        <h1>Register</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="dp-container">
          <img alt="" src="person.png" className="dp"></img>
        </div>
        <label>
          Your Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </label>
        <button className="submit-btn" type="submit">
          Register
        </button>
        <p>
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Registration Successful!</h2>
            <p>Please check your email for the verification link.</p>
            <button onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </section>
  );
}
