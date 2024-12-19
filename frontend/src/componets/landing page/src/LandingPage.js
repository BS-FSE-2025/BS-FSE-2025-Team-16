  import Navbar from "./Components/navbar/navbar";
  import Intro from "./Components/Intro/intro";
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
      <div>
        

        {
          <div className="App">
              <Navbar hundleOpenLoginPopup={hundleOpenLoginPopup} />
              <Intro/>
              <AboutUs/>
              {
                show ?
                <LoginPopup isOpen={show} setIsOpen={setshow} />
                :<></>
              }
          </div>
        }
        
        
      </div>
    );
  }

  export default LandingPage;
