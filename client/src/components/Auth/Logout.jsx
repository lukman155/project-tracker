import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../utils/api";
import "./auth.scss";

const Logout = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
