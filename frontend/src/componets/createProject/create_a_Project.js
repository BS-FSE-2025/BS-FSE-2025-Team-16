import React, { useEffect, useState } from "react";
import Navbar from "../landing page/src/Components/navbar/navbar";
import LoginPopup from "../LoginPopup";
import ".//create_a_Project.css";
import APIService from "../APIService";
import { useNavigate } from "react-router-dom";  // ייבוא useNavigate

function CreateProject() {
  const [show, setShow] = useState(false);
  const handleOpenLoginPopup = () => {
    setShow(!show);
  };
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    projectName: "",
    budget: "",
    width: "",
    length: "",
    climate: "", // שדה חדש עבור אקלים
  });

  const [errors, setErrors] = useState({
    budget: "",
    width: "",
    length: "",
    climate: "", // שדה שגיאה עבור אקלים
  });

  // יצירת משתנה ניווט
  const navigate = useNavigate();

  useEffect(()=>{
    setUser(JSON.parse(localStorage.getItem('loggedInUser')));
  },[]);

  const validateInput = (name, value) => {
    if (name === "budget" || name === "width" || name === "length") {
      if (!/^\d*\.?\d+$/.test(value) || parseFloat(value) < 0) {
        return "Invalid input! Please enter a positive number.";
      }
    }
    if (name === "climate" && value === "") {
      return "You must select a climate type.";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const errorMessage = validateInput(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // בדיקת שגיאות וטיפול בהן
    if (!Object.values(errors).some((err) => err) && formData.projectName && formData.climate) {
      alert("Form submitted successfully!");
      console.log(formData);

      // שליחת הנתונים ל-API
      APIService.NewProject({ "user": user, "project": formData });

      // ניווט לדף /projectmanager
      navigate("/ProjectManagement");
    } else {
      alert("Please fix the errors before submitting.");
    }

    console.log(user);
    console.log(formData);
  };

  return (
    <div>
      <Navbar handleOpenLoginPopup={handleOpenLoginPopup} />
      <div className="create-project-container">
        {show ? <LoginPopup isOpen={show} setShow={setShow} /> : null}

        {/* Title */}
        <h1>Create a New Project</h1>

        <div className="form-wrapper">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Project Name:</label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                placeholder="Enter project name"
              />
            </div>

            <div className="form-group">
              <label>Budget:</label>
              <input
                type="text"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="Enter budget"
              />
              {errors.budget && <p className="error-text">{errors.budget}</p>}
            </div>

            <div className="form-group">
              <label>Width:</label>
              <input
                type="text"
                name="width"
                value={formData.width}
                onChange={handleChange}
                placeholder="Enter width"
              />
              {errors.width && <p className="error-text">{errors.width}</p>}
            </div>

            <div className="form-group">
              <label>Length:</label>
              <input
                type="text"
                name="length"
                value={formData.length}
                onChange={handleChange}
                placeholder="Enter length"
              />
              {errors.length && <p className="error-text">{errors.length}</p>}
            </div>

            {/* Select Climate */}
            <div className="form-group">
              <label>Climate:</label>
              <select
                name="climate"
                value={formData.climate}
                onChange={handleChange}
              >
                <option value="">Select Climate</option>
                <option value="Temperate">Temperate</option>
                <option value="Tropical">Tropical</option>
                <option value="Arid">Arid</option>
                <option value="Mediterranean">Mediterranean</option>
                <option value="Cold">Cold</option>
              </select>
              {errors.climate && <p className="error-text">{errors.climate}</p>}
            </div>

            <button type="submit" className="submit-btn">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateProject;