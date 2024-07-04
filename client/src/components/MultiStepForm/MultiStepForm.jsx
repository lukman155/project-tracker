import React, { useState } from "react";
import axios from "axios";

const CreateProjectForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    gps_location: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      image: e.target.files[0],
    }));
  };

  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => prevStep - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await axios.post("/api/projects", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Project created:", response.data);
      // Handle success (e.g., show a success message, redirect to project list)
    } catch (error) {
      console.error("Error creating project:", error);
      // Handle error (e.g., show an error message)
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2>Project Details</h2>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Project Name"
              required
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              required
            />
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              required
            />
            <input
              type="text"
              name="gps_location"
              value={formData.gps_location}
              onChange={handleChange}
              placeholder="GPS Location"
              required
            />
            <button onClick={nextStep}>Next</button>
          </div>
        );
      case 2:
        return (
          <div>
            <h2>Project Image</h2>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              required
            />
            <button onClick={prevStep}>Previous</button>
            <button onClick={nextStep}>Next</button>
          </div>
        );
      case 3:
        return (
          <div>
            <h2>Review and Submit</h2>
            <p>Name: {formData.name}</p>
            <p>Description: {formData.description}</p>
            <p>Category: {formData.category}</p>
            <p>GPS Location: {formData.gps_location}</p>
            <p>
              Image:{" "}
              {formData.image ? formData.image.name : "No image selected"}
            </p>
            <button onClick={prevStep}>Previous</button>
            <button onClick={handleSubmit}>Create Project</button>
          </div>
        );
      default:
        return null;
    }
  };

  return <form onSubmit={(e) => e.preventDefault()}>{renderStep()}</form>;
};

export default CreateProjectForm;
