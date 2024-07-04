import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { parse, format, isValid } from "date-fns";
import api from "../../utils/api";
import './viewproject.module.scss'

const ViewProject = () => {
    const [project, setProject] = useState([]);
    const { projectId } = useParams()

      const formatDate = (dateString) => {
        // Assuming the date string is in the format "YYYY-MM-DD"
        const parsedDate = parse(dateString, "yyyy-MM-dd", new Date());
        if (isValid(parsedDate)) {
          return format(parsedDate, "MM/dd/yyyy");
        }
        return "Invalid Date";
      };

    useEffect(() => {
      const fetchProject = async () => {
        try {
          const response = await api.get(`/projects/${projectId}`);
          setProject(response.data);
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      };
      fetchProject();

    }, [projectId]);

      const imageUrl = project.image_url
        ? `http://localhost:5000${project.image_url}`
        : null;

      console.log(imageUrl)

  return (
    <div className="project-card">
      <div className="project-header">
        <h2>{project.name}</h2>
        <div className="project-dates"></div>
        <div className="project-status">
          {project.status === "overdue" && (
            <span className="status-badge overdue">
              Overdue {project.overdueDuration}
            </span>
          )}
        </div>
      </div>

      <div className="project-image">
        <div className="project-image">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={project.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/path/to/fallback/image.jpg";
              }}
            />
          )}
        </div>
      </div>

      <div className="project-description">
        <h3>Project Description</h3>
        <p>{project.description}</p>
      </div>

      <div className="project-actions">
        <button className="edit-button">Edit</button>
        <button className="delete-button">Delete</button>
      </div>
    </div>
  );
};

export default ViewProject;
