
import React, { useEffect, useState } from "react";
import Navbar from "../landing page/src/Components/navbar/navbar";
import LoginPopup from "../LoginPopup";
import "../myProject/myProject.css";
import APIService from "../APIService";
import { NavLink,useNavigate } from "react-router-dom";

function ProjectManagement() {
  const [projects, setProjects] = useState([]);
  const [show, setShow] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [len, setlen] = useState(0);
  const handleOpenLoginPopup = () => {
    setShow(!show);
  };
  const navigate = useNavigate();
  const fetchProjects = (savedUser) => {
    console.log(savedUser)
    APIService.projects()
      .then((res) => {
        setProjects(res.data.filter((project) => project.inactive === 1 && project.client_id==savedUser.Id));
        setlen(res.data.filter((project) => project.inactive === 1 && project.client_id==savedUser.Id).length)
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  };

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (savedUser) {
        setLoggedInUser(savedUser);
    }
    fetchProjects(savedUser);  // Fetch projects on component mount
  }, []);
  const hundleToProject =(projectId)=>{
    const selectedProject = projects.find(project => project.id === projectId);
    if (selectedProject) {
        localStorage.setItem('project', JSON.stringify(selectedProject));
    }
    console.log(`project ID: ${projectId}`);
    navigate('/Dnd1')
  }
  const handleDeleteProject = (projectId) => {
    console.log(`Delete project with ID: ${projectId}`);
    const savedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    APIService.deleteProject(projectId)
      .then(() => {
        fetchProjects(savedUser);  // Refresh project list after deletion
      })
      .catch((error) => {
        console.error("Error deleting project:", error);
      });
  };

  const handleDownloadPDF = (projectId) => {
    console.log(`Download PDF for project ID: ${projectId}`);
    // Add PDF download logic here
  };

  return (
    <div>
      <Navbar handleOpenLoginPopup={handleOpenLoginPopup} />
      <div className="project-container">
        <div className="header">
          <h1 className="title">Project Management</h1>
        </div>
        <div className="project-list">
          {projects.map((project) => (
            <div key={project.id} className="project-row">
              <span className="project-name">{project.name}</span>
              <div className="project-actions">
                <button
                  className="icon-button home-button"
                  onClick={() => hundleToProject(project.id)}
                  style={{ fontSize: "24px" }}
                >
                  🏡
                </button>
  
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
        {/* רק אם loggedInUser קיים */}
        {loggedInUser &&
          ((loggedInUser.Type === 2 && projects.length === 0) || loggedInUser.Type !== 2) && (
            <NavLink to="/CreateProject" className="create-button">
              Tap here to create new project
            </NavLink>
          )}
      </div>
    </div>
  );
  
}

export default ProjectManagement;
