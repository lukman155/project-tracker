import React, { useState, useEffect } from "react";
import api from "../../utils/api";

const ReportList = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get("/reports");
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetchReports();
  }, []);

  return (
    <div>
      <h2>Reports</h2>
      {reports.map((report) => (
        <div key={report.id}>
          <h3>{report.name}</h3>
          <p>Project ID: {report.project_id}</p>
          <p>Status: {report.status}</p>
          <p>Due Date: {new Date(report.due_date).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default ReportList;
