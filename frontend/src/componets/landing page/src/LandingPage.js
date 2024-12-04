  import Navbar from "./Components/navbar/navbar";
  import Input from "./Components/Intro/intro";
  import AboutUs from "./Components/AboutUs/aboutUs";
import "../public/style.css"

import { useState } from "react";
import LoginPopup from "../../LoginPopup"
  function LandingPage() {
    const [show,setshow]=useState(false)
    const hundleOpenLoginPopup =()=>{
      
      setshow(!show)
    }
    return (
      <div className="App">
        
        <Navbar hundleOpenLoginPopup={hundleOpenLoginPopup} />
        <Input/>
        <AboutUs/>
        {
          show ?
          <LoginPopup isOpen={show} setIsOpen={setshow} />
          :<></>
        }
        
        
      </div>
    );
  }

  export default LandingPage;
