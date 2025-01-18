import { useEffect, useState } from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

import CloseButton from 'react-bootstrap/CloseButton'
import "bootstrap-icons/font/bootstrap-icons.css";
import { useRef } from "react";
import OptionsList from "./option/index"
import APIService from "./APIService";

const NewUser=()=>{
    const[user,setUser]=useState({
        Name:'',
        Email:'',
        Password:'',
    })
    const [type,setType]=useState('')
    
    const [typesUser,SetTypesUser] =useState([{"id":1,"name":"Admin"}])
    const [confirmPassword, SetConfirmPassword]=useState('')
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [IsMatchPassword, setIsMatchPassword] = useState(true);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); // הפוך את המצב (true/false)
      };
      const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword); // הפוך את המצב (true/false)
      };
    const hundleChange = (e) =>{
        setUser({
          ...user,
          [e.target.name]:e.target.value
        })
        
      }
      useEffect(()=>{
        APIService.usersType().then(res=>{
            SetTypesUser(res.data)
            console.log(res.data)
        })
        
      },[])
    
      const navigate = useNavigate();
      const validatePassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[a-zA-Z])[A-Za-z\d]{8,12}$/;
        return regex.test(password);
    };
    
      const hundleSubmit = () => {
        if (!validatePassword(user.Password)) {
            window.alert("The password must contain at least 8 characters, at least one uppercase letter, one digit, and be in English only");
            return;
        }
        
        setIsMatchPassword(user.Password === confirmPassword);
        if (user.Password !== confirmPassword) {
            window.alert("The passwords do not match.");
            return;
        }
    
        APIService.createUser({ "userType": type, "user": user }).then(res => console.log(res.data));
        navigate("/");
    };
    return(
        <div style={{backgroundColor: "#90EE90",minHeight: "100vh"}}>
            <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
            <div className="row">
                    <div className="text-center">
                        <h1 className="">Welcome to Plant priecer</h1>
                    </div>

                </div>
                <div className="row mt-5">
                    <div className="col-2"><label>name </label></div>
                    <div className="col-4">
                        <input type="text" className="form-control" value={user.Name} name="Name" onChange={hundleChange} id="name" />
                    </div>
                </div>
                <div className="row mt-5">
                    <div className="col-2"><label>Email </label></div>
                    <div className="col-4">
                    <input type="text" className="form-control" value={user.Email} name="Email" onChange={hundleChange} id="Email" />
                    </div>
                </div>
            
      
                <div className="row mt-5 ">
                    <div className="col-2">
                        <label htmlFor="Password">Password</label>
                    </div>
                    <div className="col-4 position-relative">
                        <input type={showPassword ? "text" : "password"} value={user.Password} className="form-control" name="Password" onChange={hundleChange} id="Password"
                        />
                        <button
                        type="button" onClick={togglePasswordVisibility} className="btn btn-light position-absolute"
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
                        </div>
                <div className="row mt-5">
                    <div className="col-2">
                        <label className="" htmlFor="Password">ConfirmPassword</label>
                    </div>
                    <div className="col-4 position-relative">
                        <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control"
                        name="confirmPassword"
                        onChange={(e)=>SetConfirmPassword(e.target.value)}
                        value={confirmPassword}
                        id="confirmPassword"
                        />
                        <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="btn btn-light position-absolute"
                        style={{
                            top: "50%",
                            right: "10px",
                            transform: "translateY(-50%)",
                            border: "none",
                        }}
                        >
                        <i className={`bi ${ showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                        </button>
                    </div>
                </div>
                    <div className="row mt-5">
                        <div className="col-2">
                            <label>user type</label>
                        </div>
                        <div className="col-4">
                            <OptionsList optionsList={typesUser} InputValue={type} setInputValue={setType} />
                        </div>
                    </div>
                    <div className="row mt-5">
                        <div className="col-7 text-center">
                               <button onClick={hundleSubmit} className="btn btn-primary t-center">submit</button>
                        </div>
                         
                    </div>
                    <div className="row mt-5">
                        <div className="col-12 text-center red">
                         {
                            IsMatchPassword ?<></>  :<p>
                                The passwords do not match.
                            </p>
                         }  
                        </div>
                    </div>
                </div>
            
            </div>


    )
}
export default NewUser