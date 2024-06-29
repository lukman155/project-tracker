import React, { useState } from "react";
import api from "../../utils/api";
import "./auth.scss";
import { Link } from "react-router-dom";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/forgot-password", { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <section>
    <Link to={'/login'}>Back</Link>
      <div className="header">
        <h1>Reset Password</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          To reset your password, please enter your email.
          <br/> 
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </label>

        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </section>
  );
};

export default ForgotPassword;
