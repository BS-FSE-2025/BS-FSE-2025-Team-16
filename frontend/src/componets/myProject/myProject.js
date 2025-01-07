import React, { useEffect, useState } from "react";
import Navbar from "../landing page/src/Components/navbar/navbar";
import LoginPopup from "../LoginPopup";
import "../myProject/myProject.css";
import APIService from "../APIService";
import { NavLink } from "react-router-dom";

function ProjectManagement() {
  const [show, setShow] = useState(false);
    const handleOpenLoginPopup = () => {
      setShow(!show);
    };

  return (
    <div>
    <Navbar handleOpenLoginPopup={handleOpenLoginPopup} />
    <div className="project-container">
      <h1 className="title">Project Management</h1>
      {/* NavLink שמשתמש בכפתור */}
      <NavLink to="/CreateProject" className="create-button">
        Tap here to create new project
      </NavLink>
    </div>
    </div>
  );
}

export default ProjectManagement;