import React from 'react';
import './navbar.css';
import logo from '../../main-icon.jpg'
import { NavLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';





const Navbar = ({hundleOpenLoginPopup}) => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (savedUser) {
            console.log('User is logged in:', savedUser);
            setLoggedInUser(savedUser); // שמירה ב-state
        } else {
            console.log('No user logged in--');
        }
    }, []);

    return (
        <nav className="navbar">
            <NavLink to="/">
                <img src={logo} alt="Logo" className="logo" />
            </NavLink>
            <div className="deskTopMenu">
              {!loggedInUser && (
                <> 
               <ScrollLink activeClass='active' to="intro" spy={true} smooth={true} offset={-200} duration={500} className="deskTopMenuListItem">Home</ScrollLink >
               <ScrollLink activeClass='active' to="aboutUs" spy={true} smooth={true} offset={-90} duration={500}  className="deskTopMenuListItem">About Us</ScrollLink >
                </>
              )}
             {loggedInUser && (
                <> 
                {loggedInUser &&
                (loggedInUser.Type === 1) &&(
               <NavLink  to="/admin" className="deskTopMenuListItem"> Admin page</NavLink>
                )}
                {loggedInUser &&
                (loggedInUser.Type !== 3) &&(
               <NavLink  to="/ProjectManagement" className="deskTopMenuListItem"> Project Management</NavLink>
                )}
               <NavLink  to="/ProductList" className="deskTopMenuListItem">Product list</NavLink>
               <NavLink  to="/supplier" className="deskTopMenuListItem"> Supplier info</NavLink>
               <NavLink  to="/designer" className="deskTopMenuListItem"> Designers Page</NavLink>
               {loggedInUser &&
                (loggedInUser.Type !== 1) &&(
               <NavLink  to="/rating" className="deskTopMenuListItem"> Rating</NavLink>
                )}
               </>
              )}
              
             
            
            </div>
            {!loggedInUser ? (
                <>
                    <button className="" id='login-button' onClick={hundleOpenLoginPopup}>
                        Login
                    </button>
                    <button className=""onClick={()=>{
                        navigate("/newUser")
                    }}>Sign up</button>
                </>
            ) : (
                <div className="logged-in">
                    <span>Welcome, {loggedInUser.Name}</span>
                    <button
                        className="logout"
                        onClick={() => {
                            localStorage.removeItem('loggedInUser');
                            setLoggedInUser(null);
                            console.log('User logged out');
                            navigate('/')
                        }}
                    >
                        Logout
                    </button>
                </div>
            )}
           
        </nav>
    );
}

export default Navbar;