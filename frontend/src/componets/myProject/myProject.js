import React, { useEffect, useState } from "react";
import Navbar from "../landing page/src/Components/navbar/navbar";
import LoginPopup from "../LoginPopup";
import "../myProject/myProject.css";
import APIService from "../APIService";
import { NavLink,useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import logo from '../landing page/src/assest/main-icon.jpg'
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
    //console.log(savedUser)
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
            if (!savedUser) {
                window.location.href = '/';
                return;
            }
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
    //console.log(`project ID: ${projectId}`);
    navigate('/Dnd1')
  }
  const handleDeleteProject = (projectId) => {
    //console.log(`Delete project with ID: ${projectId}`);
    const savedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    APIService.deleteProject(projectId)
      .then(() => {
        fetchProjects(savedUser);  // Refresh project list after deletion
      })
      .catch((error) => {
        console.error("Error deleting project:", error);
      });
  };




  const getClimateType = (climateNumber) => {
    switch (climateNumber) {
      case 1:
        return "Temperate";
      case 2:
        return "Tropical";
      case 3:
        return "Arid";
      case 4:
        return "Mediterranean";
      case 5:
        return "Cold";
      default:
        return "Unknown"; // Default for any unexpected values
    }
  };
  
//   const handleDownloadPDF = async (projectId) => {
//   const selectedProject = projects.find((project) => project.id === projectId);

//   if (!selectedProject) {
//     alert("Project not found!");
//     return;
//   }

//   try {
//     const res = await APIService.ProjectDetails(selectedProject);
//     const projectDetails = res.data["data"];

//     const doc = new jsPDF();
//     const pageHeight = doc.internal.pageSize.height;
//     let yPosition = 110;
    
//     const addLogo = () => {
//       const logoX = 180, logoY = 10, logoSize = 30;
//       doc.setFillColor(255, 255, 255);
//       doc.circle(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 'F');
//       doc.addImage(logo, 'JPEG', logoX, logoY, logoSize, logoSize);
//     };

//     addLogo();  // לוגו בדף הראשון
//     doc.setFontSize(24).text("Project Details", 105, 20, { align: "center" });
//     doc.setFontSize(14).text(`Project Name: ${selectedProject.name}`, 15, 50);
//     doc.text(`Budget: ${selectedProject.Budget} USD`, 15, 60);
//     doc.text(`Dimensions: ${selectedProject.Width} x ${selectedProject.Len}`, 15, 70);
//     doc.text(`Climate: ${getClimateType(selectedProject.Climate)}`, 15, 80);

//     doc.setFontSize(16).text("Price Quote", 15, 100);
//     doc.setFontSize(12).rect(15, yPosition, 180, 10, 'F').text("Item Name", 20, yPosition + 7).text("Total Price", 155, yPosition + 7);

//     yPosition += 10;
//     let totalCost = 0;

//     projectDetails.forEach((detail) => {
//       totalCost += detail.total_price;
//       if (yPosition + 10 > pageHeight - 20) {
//         doc.addPage();
//         yPosition = 20;
//         addLogo();  // לוגו בכל דף חדש
//         doc.rect(15, yPosition, 180, 10, 'F').text("Item Name", 20, yPosition + 7).text("Total Price", 155, yPosition + 7);
//         yPosition += 10;
//       }
//       doc.rect(15, yPosition, 180, 10).text(detail.itemName, 20, yPosition + 7).text(`$${detail.total_price.toFixed(2)}`, 155, yPosition + 7);
//       yPosition += 10;
//     });

//     doc.setFont("helvetica", "bold").text("Total Price:", 20, yPosition + 7).text(`$${totalCost.toFixed(2)}`, 155, yPosition + 7);

//     if (selectedProject.img) {
//       doc.addPage();
//       addLogo();  // לוגו גם בעמוד התמונה
//       doc.text("Product Image", 105, 20, { align: "center" });
//       doc.addImage(selectedProject.img, 'JPEG', 15, 30, 180, 150);
//     }

//     doc.save(`Project_${selectedProject.id}.pdf`);
//   } catch (error) {
//     console.error("Error generating PDF:", error);
//     alert("Failed to generate PDF. Please try again later.");
//   }
// };

const handleDownloadPDF = async (projectId) => {
  const selectedProject = projects.find((project) => project.id === projectId);

  if (!selectedProject) {
    alert("Project not found!");
    return;
  }

  try {
    const res = await APIService.ProjectDetails(selectedProject);
    const projectDetails = res.data["data"];

    // קיבוץ פריטים דומים לפי שם
    const groupedDetails = projectDetails.reduce((acc, detail) => {
      const existing = acc.find((item) => item.itemName === detail.itemName);
      if (existing) {
        existing.quantity += 1;
        existing.total_price += detail.total_price;
      } else {
        acc.push({
          itemName: detail.itemName,
          unit_price: detail.total_price,
          quantity: 1,
          total_price: detail.total_price,
        });
      }
      return acc;
    }, []);

    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 110;

    const addLogo = () => {
      const logoX = 180, logoY = 10, logoSize = 30;
      doc.setFillColor(255, 255, 255);
      doc.circle(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 'F');
      doc.addImage(logo, 'JPEG', logoX, logoY, logoSize, logoSize);
    };

    addLogo(); // לוגו בדף הראשון
    doc.setFontSize(24).text("Project Details", 105, 20, { align: "center" });
    doc.setFontSize(14).text(`Project Name: ${selectedProject.name}`, 15, 50);
    doc.text(`Budget: ${selectedProject.Budget} USD`, 15, 60);
    doc.text(`Dimensions: ${selectedProject.Width} x ${selectedProject.Len}`, 15, 70);
    doc.text(`Climate: ${getClimateType(selectedProject.Climate)}`, 15, 80);

    doc.setFontSize(16).text("Price Quote", 15, 100);
    doc.setFontSize(12).rect(15, yPosition, 180, 10, 'F')
      .text("Item Name", 20, yPosition + 7)
      .text("Quantity", 90, yPosition + 7)
      .text("Unit Price", 130, yPosition + 7)
      .text("Total Price", 160, yPosition + 7);

    yPosition += 10;
    let totalCost = 0;

    groupedDetails.forEach((detail) => {
      totalCost += detail.total_price;
      if (yPosition + 10 > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
        addLogo(); // לוגו בכל דף חדש
        doc.rect(15, yPosition, 180, 10, 'F')
          .text("Item Name", 20, yPosition + 7)
          .text("Quantity", 90, yPosition + 7)
          .text("Unit Price", 130, yPosition + 7)
          .text("Total Price", 160, yPosition + 7);
        yPosition += 10;
      }
      doc.rect(15, yPosition, 180, 10)
        .text(detail.itemName, 20, yPosition + 7)
        .text(`${detail.quantity}`, 100, yPosition + 7)
        .text(`$${detail.unit_price.toFixed(2)}`, 140, yPosition + 7)
        .text(`$${detail.total_price.toFixed(2)}`, 170, yPosition + 7);
      yPosition += 10;
    });

    doc.setFont("helvetica", "bold").text("Total Price:", 20, yPosition + 7)
      .text(`$${totalCost.toFixed(2)}`, 170, yPosition + 7);

    if (selectedProject.img) {
      doc.addPage();
      addLogo(); // לוגו גם בעמוד התמונה
      doc.text("Product Image", 105, 20, { align: "center" });
      doc.addImage(selectedProject.img, 'JPEG', 15, 30, 180, 150);
    }

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