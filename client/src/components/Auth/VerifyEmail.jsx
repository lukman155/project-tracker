import React, { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { useParams } from "react-router-dom";
import api from "../../utils/api";
import "./auth.scss";
import "./spinner.scss";

function EmailVerification() {
  const [status, setStatus] = useState("Verifying...");
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useParams();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await api.get(`/verify-email/${token}`);
        setStatus(response.data.message || "Email verified successfully");
      } catch (error) {
        if (error.response) {
          setStatus(error.response.data.error || "Verification failed");
        } else if (error.request) {
          setStatus("Unable to connect to the server. Please try again later.");
        } else {
          setStatus("An unexpected error occurred. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <section>
      <div className="header">
        <h1>Email Verification</h1>
      </div>
      {isLoading ? (
        <div className="loading-spinner">
          <RotatingLines
            height="40"
            width="40"
            color={'black'}
            strokeWidth="2"
          />
        </div>
      ) : (
        <p>{status}</p>
      )}
    </section>
  );
}

export default EmailVerification;
