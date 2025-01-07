import React, { useEffect, useState } from "react";
import Navbar from "../landing page/src/Components/navbar/navbar";
import LoginPopup from "../LoginPopup";
import "../myProject/myProject.css";
import APIService from "../APIService";
import { NavLink } from "react-router-dom";

function ProjectManagement() {
  const [projects, setProjects] = useState([]);
  const [show, setShow] = useState(false);

  const handleOpenLoginPopup = () => {
    setShow(!show);
  };

  useEffect(() => {
    APIService.projects()
      .then((res) => {
        setProjects(res.data);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }, []);

  const handleDeleteProject = (projectId) => {
    console.log(`Delete project with ID: ${projectId}`);
    // Add deletion logic here
  };

  const handleDownloadPDF = (projectId) => {
    console.log(`Download PDF for project ID: ${projectId}`);
    // Add PDF download logic here
  };

  return (
    <div>
      <Navbar handleOpenLoginPopup={handleOpenLoginPopup} />
      <div className="project-container">
        <h1 className="title">Project Management</h1>
        <div className="project-list">
          {projects.map((project) => (
            <div key={project.id} className="project-row">
              <span className="project-name">{project.name}</span>
              <div className="project-actions">
                <button
                  className="icon-button pdf-button"
                  onClick={() => handleDownloadPDF(project.id)}
                >
                  📄
                </button>
                <button
                  className="icon-button delete-button"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
        </div>
        <NavLink to="/CreateProject" className="create-button">
          Tap here to create new project
        </NavLink>
      </div>
    </div>
  );
}

export default ProjectManagement;
