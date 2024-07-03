import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../../utils/api";
import { Link } from "react-router-dom";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string(),
  contractor: Yup.string(),
  category: Yup.string().required("Category is required"),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date()
    .min(Yup.ref("startDate"), "End date can't be before start date")
    .required("End date is required"),
  image: Yup.mixed()
    .test("fileSize", "File too large", (value) => {
      if (!value) return true; // Attachment is optional
      return value.size <= 5 * 1024 * 1024; // 5MB limit
    })
    .test("fileFormat", "Unsupported Format", (value) => {
      if (!value) return true;
      return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
    }),
});

const CreateProject = () => {
  const [imagePreview, setImagePreview] = useState(null);

  const initialValues = {
    name: "",
    description: "",
    contractor: "",
    category: "",
    startDate: "",
    endDate: "",
    image: null,
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === "image" && values[key]) {
          formData.append(key, values[key], values[key].name);
        } else {
          formData.append(key, values[key]);
        }
      });

      const response = await api.post("/projects", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response:", response.data);
      resetForm();
      setImagePreview(null);
      alert("Project created successfully!");
    } catch (error) {
      console.error(
        "Error creating project:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to create project. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form>
        <Link to={'/projects'}>Back</Link>
          <h2>Add Project</h2>

          <div>
            <label htmlFor="name">Name</label>
            <Field type="text" id="name" name="name" placeholder="Name" />
            <ErrorMessage name="name" component="div" className="error" />
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <Field
              as="textarea"
              id="description"
              name="description"
              placeholder="Description"
            />
            <ErrorMessage
              name="description"
              component="div"
              className="error"
            />
          </div>

          <div>
            <label htmlFor="contractor">Contractor</label>
            <Field
              type="text"
              id="contractor"
              name="contractor"
              placeholder="Contractor 1"
            />
            <ErrorMessage name="contractor" component="div" className="error" />
          </div>

          <div>
            <label htmlFor="category">Category</label>
            <Field as="select" id="category" name="category">
              <option value="">Select a category</option>
              <option value="Zero Hunger">Zero Hunger</option>
              {/* Add more options as needed */}
            </Field>
            <ErrorMessage name="category" component="div" className="error" />
          </div>

          <div>
            <label htmlFor="startDate">Start date</label>
            <Field type="date" id="startDate" name="startDate" />
            <ErrorMessage name="startDate" component="div" className="error" />
          </div>

          <div>
            <label htmlFor="endDate">End date</label>
            <Field type="date" id="endDate" name="endDate" />
            <ErrorMessage name="endDate" component="div" className="error" />
          </div>

          <div>
            <label htmlFor="image">Project Image</label>
            <input
              id="image"
              name="image"
              type="file"
              onChange={(event) => {
                const file = event.currentTarget.files[0];
                setFieldValue("image", file);
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImagePreview(reader.result);
                  };
                  reader.readAsDataURL(file);
                } else {
                  setImagePreview(null);
                }
              }}
            />
            <ErrorMessage name="image" component="div" className="error" />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{ maxWidth: "200px", marginTop: "10px" }}
              />
            )}
          </div>

          <div>
            <button type="button">Back</button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Next"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CreateProject;
