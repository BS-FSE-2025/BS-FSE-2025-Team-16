import logo from './logo.svg';
import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPopup from "./componets/LoginPopup";
import NewUser from './componets/new_user';
import Dnd1 from './componets/FullDnd';
import LandingPage from './componets/landing page/src/LandingPage';
<<<<<<< HEAD
import RatingPage from './componets/ratingpage/rating';
=======
import SuppliersPage from './componets/supplier_page/Supplier_list';
>>>>>>> c49de15f9ea4f718cde873facd0fbd04320f4d2c
function App() {
  return (
    <div>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/newUser" element={<NewUser />} />
        <Route path="/Dnd1" element={<Dnd1 />} />
<<<<<<< HEAD
        <Route path="/rating" element={<RatingPage/>} />
=======
        <Route path="/supplier" element={<SuppliersPage />} />
>>>>>>> c49de15f9ea4f718cde873facd0fbd04320f4d2c
        {/* <Route path="/LandingPage" element={<LandingPage />} /> */}
      </Routes>
    </Router>

              
      {/* <DragAndDropAdvanced /> */}
      {/* <Login_Amir /> */}
      
    </div>
  );
}

export default App;
