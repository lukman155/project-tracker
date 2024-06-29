import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";
import "./auth.scss";


function EmailVerification() {
  const [status, setStatus] = useState("Verifying...");
  const { token } = useParams();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await api.get(`/verify-email/${token}`);
        setStatus(response.data.message);
      } catch (error) {
        setStatus(error.response.data.error || "An error occurred");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div>
      <h2>Email Verification</h2>
      <p>{status}</p>
    </div>
  );
}



export default EmailVerification;
