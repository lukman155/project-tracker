import React, { useState } from "react";
import api from "../../utils/api";

const CreateReport = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/reports", {
        name,
        description,
        project_id: projectId,
        status,
        due_date: dueDate,
      });
      setName("");
      setDescription("");
      setProjectId("");
      setStatus("pending");
      setDueDate("");
      alert("Report created successfully!");
    } catch (error) {
      console.error("Error creating report:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Report</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Report Name"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Report Description"
      />
      <input
        type="number"
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
        placeholder="Project ID"
        required
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />
      <button type="submit">Create Report</button>
    </form>
  );
};

export default CreateReport;
