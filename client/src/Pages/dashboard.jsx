import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Logout from "./Logout";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <Logout />
    </div>
  );
};

export default Dashboard;
