import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { Link } from "react-router-dom";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div>
      <h2>Projects</h2>
      <Link to={'/projects/add'}>Add project</Link>
      <div>
        {projects.map((project) => (
          <Link to={`/projects/${project.id}`} key={project.id}>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
