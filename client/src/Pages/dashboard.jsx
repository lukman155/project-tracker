import React, { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Logout from "../components/Auth/Logout";

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    console.log("Dashboard rendered. User:", user);
    console.log("Loading:", loading);
  }, [user, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Not logged in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <Logout />
    </div>
  );
};

export default Dashboard;
