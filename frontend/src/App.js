import logo from './logo.svg';
import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPopup from "./componets/LoginPopup";
import NewUser from './componets/new_user';
import DndBoardApp from './componets/dnd/dnd.jsx'
// import Dnd1 from './componets/FullDnd';
import LandingPage from './componets/landing page/src/LandingPage';
import SuppliersPage from './componets/supplier_page/Supplier_list';
import ProductList from './componets/itemsPage/itemsPage';
import RatingPage from './componets/ratingpage/rating';
import CreateProject from './componets/createProject/create_a_Project';
import CombinedForm from './componets/newProduct/newProduct'
import ProjectManagement from './componets/myProject/myProject.js'
import DesignersPage from './componets/designer_page/designer_list';
import AdminsPage from './componets/admin_page/admin_page';
// import AboutUs from './componets/Odot/AboutUs'
function App() {
  return (
    <div>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/newUser" element={<NewUser />} />
        <Route path="/Dnd1" element={<DndBoardApp />} />
        <Route path="/supplier" element={<SuppliersPage />} />
        <Route path="/ProductList" element={<ProductList />} />
        <Route path="/rating" element={<RatingPage />} />
        <Route path="/CreateProject" element={<CreateProject />} />
        <Route path="/CreateProduct" element={<CombinedForm />} />
        <Route path="/ProjectManagement" element={<ProjectManagement />} />
        <Route path="/designer" element={<DesignersPage />} />
        <Route path="/admin" element={<AdminsPage />} />
        {/* <Route path="/AboutUs" element={<AboutUs/>}/> */}
        <Route path="*" element={<LandingPage />} />

        {/* <Route path="/LandingPage" element={<LandingPage />} /> */}
      </Routes>
    </Router>

              
      {/* <DragAndDropAdvanced /> */}
      {/* <Login_Amir /> */}
      
    </div>
  );
}

export default App;