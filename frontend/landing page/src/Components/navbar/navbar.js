import React from 'react';
import './navbar.css';
import logo from '../../main-icon.jpg'
import { Link} from 'react-scroll';

const Navbar = () => {
    return (
        <nav className="navbar">
            <img src={logo} alt="Logo" className="logo" />
            <div className="deskTopMenu">
              
              <Link activeClass='active' to="intro" spy={true} smooth={true} offset={-200} duration={500} className="deskTopMenuListItem">Home</Link>
              <Link activeClass='active' to="aboutUs" spy={true} smooth={true} offset={-200} duration={500}  className="deskTopMenuListItem">About Us</Link>
              <Link to="how-to-use" className="deskTopMenuListItem">How to use ?</Link>
            
            </div>
            <button className="register">
                <img src="" alt="" className="input" /> Login
            </button>
            <button className="login">
                <img src="" alt="" className="input" />Sign up
            </button>
        </nav>
    );
}

export default Navbar;