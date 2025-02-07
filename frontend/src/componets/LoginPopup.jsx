import { useEffect, useState } from "react"
import "bootstrap/dist/css/bootstrap.min.css";
import CloseButton from 'react-bootstrap/CloseButton'
import "bootstrap-icons/font/bootstrap-icons.css";
import { useRef } from "react";
import APIService from "./APIService";
function LoginPopup({isOpen,setIsOpen}){
    // const [isOpen, setIsOpen] = useState(false); // State to control popup visibility
    const inputRef = useRef(null);
    // Function to toggle popup

    const togglePopup = () => {
      setIsOpen(false);
    };
    const [showPassword, setShowPassword] = useState(false); // בקרה להצגת הסיסמה
    const [users,setUsers] =useState([])
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword); // הפוך את המצב (true/false)
    };

    const hundleChange= (e) =>{
        setUser1({
          ...user1,
          [e.target.name]:e.target.value
        })
      }
      useEffect(()=>{
        APIService.user().then(res=>{
                  setUsers(res.data)
        })

      },[])
    const [user1, setUser1] =useState({
        name:'',
        password:''
      })
      const submit=()=>{

        if(users.some(worker=>worker.Name.toUpperCase()==user1.name.toUpperCase() && worker.Password==user1.password)){
          const loggedInUser = users.find(worker=>worker.Name.toUpperCase()==user1.name.toUpperCase() && worker.Password==user1.password);

          // שמירת פרטי המשתמש ב-localStorage
          localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        
         
          window.location.reload()
        }
        else{
          window.alert("the user does not exist in the system!")
        }
        
      }
    return(
        <div ref={inputRef}>
                <div>
                    {/* <button onClick={togglePopup}>Open Popup</button> */}

                    {isOpen && ( // Conditional rendering
                        <div style={popupStyles.overlay}>
                            <div style={popupStyles.popup}>
                              <div className="row">
                                <button className="btn t-end col-1" onClick={togglePopup}><i className="bi bi-x fs-2 red"></i></button>
                              
                              </div>
                              {/* <div className="row"> */}
                              <h1 style={popupStyles.header}>
                                 Login
                                </h1>
                              {/* </div> */}
                            <div className="row mb-5">
                                <div className="col-8">
                                    <input type="text" id="name" placeholder="name" value={user1.name} name="name" onChange={hundleChange} className="form-control col-12" />
                                    {/* setUser({"username":e.target.value, "id":id}) value={username}
                                    
                                    (e)=>{{setUserName(e.target.value)}}
                                    
                                    */}
                                    
                                </div>
                                <div className=" col-4 text-end  my-auto">
                                    <div className="text-end">
                                        <label></label>
                                    </div>
                                        
                                    
                                </div>
                            </div>
                           
                            <div className="row mb-5">
                              <div className="col-8 position-relative">
                                {/* שדה הסיסמה */}
                                <input
                                  type={showPassword ? "text" : "password"}
                                  id="password"
                                  placeholder="password"
                                  name="password"
                                  onChange={hundleChange}
                                  className="form-control"
                                  style={{ paddingRight: "40px" }} // מרחב לאייקון
                                />
                                {/* כפתור הצגת סיסמה עם אייקון עין */}
                                <button
                                  type="button"
                                  onClick={togglePasswordVisibility}
                                  className="btn btn-light position-absolute"
                                  style={{
                                    top: "50%",
                                    right: "10px",
                                    transform: "translateY(-50%)",
                                    border: "none",
                                }}
                              > 
                                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                              </button>
                            </div>
                            <div className="col-4 text-end my-auto">
                              <div className="text-end">
                                <label></label>
                              </div>
                            </div>
                            <div className="row">
                            <div style={popupStyles.links}>
                                      {/* <a href="#" style={popupStyles.link} className="col-6 " dir="rtl">שכחת סיסמה?</a> */}
                                      <a href="/newUser" style={popupStyles.link} className="col-6 " dir="rtl"> Don’t have an account? Sign up here</a>
                              </div>
                            
                            </div>
                          </div>




                            <button onClick={submit}  style={popupStyles.button}>submit</button>
                                {/* className="btn btn-primary" <button onClick={togglePopup} className="btn btn-danger">x</button> */}
                                
                                
                            </div>
                        </div>
      )}
    </div>     
        </div>
    )
}
const popupStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
        alignItems: "center",
    },
    header: {
      fontSize: "24px",
      marginBottom: "20px",
      color: "#2E7D32", // ירוק כהה
      marginTop:"-60px"
    },
    button: {
      padding: "10px",
      backgroundColor: "#2E7D32", // ירוק כהה
      color: "white",
      border: "none",
      borderRadius: "5px",
      fontSize: "16px",
      cursor: "pointer",
    },
    popup: {
      background: "#90EE90",
      padding: "50px",  // הקטן מ-150px ל-50px
      borderRadius: "8px",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
      textAlign: "center",
      width: "500px",  // קביעת רוחב קבוע קטן יותר
      height: "400px" // אפשר להוסיף כדי להקטין את הגובה
    },
    links: {
      marginTop: "15px",
      textAlign: "center",
    },
    link: {
      display: "block",
      marginTop: "5px",
      fontSize: "14px",
      color: "#2E7D32", // ירוק כהה
      textDecoration: "rtl",
    },
  };
export default LoginPopup