

import React, { useEffect, useState } from "react";
import Navbar from "../landing page/src/Components/navbar/navbar";
import LoginPopup from "../LoginPopup";
import "../myProject/myProject.css";
import APIService from "../APIService";
import { NavLink,useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
function ProjectManagement() {
  const [projects, setProjects] = useState([]);
  const [show, setShow] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [ProjectDetails,setProjectDetails] =useState([])
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




  const handleDownloadPDF = async (projectId) => {
    const selectedProject = projects.find((project) => project.id === projectId);
  
    if (!selectedProject) {
      alert("Project not found!");
      return;
    }
  
    try {
      // שליפת פרטי הפרויקט
      const res = await APIService.ProjectDetails(selectedProject);
      const projectDetails = res.data["data"];
      
      // יצירת קובץ PDF
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text("Project Details", 10, 10);
  
      doc.setFontSize(12);
      doc.text(`Project Name: ${selectedProject.name}`, 10, 30);
      doc.text(`Budget: ${selectedProject.Budget}`, 10, 40);
      doc.text(`Width: ${selectedProject.Width}`, 10, 50);
      doc.text(`Length: ${selectedProject.Len}`, 10, 60);
      doc.text(`Climate: ${selectedProject.Climate}`, 10, 70);
      
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(`Price Quote`, 10, 90);
  
      // הוספת פרטי הפריטים
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      let yPosition = 100; // מיקום התחלתי בשורת Y
      projectDetails.forEach((detail) => {
        doc.text(`${detail.itemName}: $${detail.total_price}`, 10, yPosition);
        yPosition += 10; // הזזת השורה הבאה כלפי מטה
      });
  
      // הוספת תמונה, אם קיימת
      if (selectedProject.img) {
        const imgX = 10; // מיקום אופקי
        const imgY = yPosition + 10; // מיקום אנכי מתחת לרשימה
        const imgWidth = 50; // רוחב התמונה
        const imgHeight = 50; // גובה התמונה
  
        doc.addImage(selectedProject.img, 'JPEG', imgX, imgY, imgWidth, imgHeight);
      }
  
      // שמירת הקובץ
      doc.save(`Project_${selectedProject.id}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again later.");
    }
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