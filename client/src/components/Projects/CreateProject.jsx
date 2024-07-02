import React, { useState } from "react";
import api from "../../utils/api";

const CreateProject = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await api.post("/projects", { name, description });
    console.log("Response:", response.data);
    setName("");
    setDescription("");
    alert("Project created successfully!");
  } catch (error) {
    console.error(
      "Error creating project:",
      error.response ? error.response.data : error.message
    );
    alert("Failed to create project. Please try again.");
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Project</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Project Name"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Project Description"
      />
      <button type="submit">Create Project</button>
    </form>
  );
};

export default CreateProject;
