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
import { Link} from 'react-scroll';
import { useState,useEffect } from 'react';
const Navbar = ({hundleOpenLoginPopup}) => {
    const [loggedInUser, setLoggedInUser] = useState(null);

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
            <img src={logo} alt="Logo" className="logo" />
            <div className="deskTopMenu">
              {!loggedInUser && (
                <> 
               <ScrollLink activeClass='active' to="intro" spy={true} smooth={true} offset={-200} duration={500} className="deskTopMenuListItem">Home</ScrollLink >
               <ScrollLink activeClass='active' to="aboutUs" spy={true} smooth={true} offset={-90} duration={500}  className="deskTopMenuListItem">About Us</ScrollLink >
                </>
              )}
             {loggedInUser && (
                <> 
               <NavLink  to="/CreateProject" className="deskTopMenuListItem"> Create project</NavLink>
               <NavLink  to="/ProductList" className="deskTopMenuListItem">Product list</NavLink>
               <NavLink  to="/supplier" className="deskTopMenuListItem"> Supplier info</NavLink>
               <NavLink  to="/rating" className="deskTopMenuListItem"> Rating</NavLink>
               </>
              )}
              
              <Link activeClass='active' to="intro" spy={true} smooth={true} offset={-200} duration={500} className="deskTopMenuListItem">Home</Link>
              <Link activeClass='active' to="aboutUs" spy={true} smooth={true} offset={-200} duration={500}  className="deskTopMenuListItem">About Us</Link>
              <Link to="how-to-use" className="deskTopMenuListItem">How to use ?</Link>
            
            </div>
            {!loggedInUser ? (
                <>
                    <button className="register" onClick={hundleOpenLoginPopup}>
                        Login
                    </button>
                    <button className="login">Sign up</button>
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