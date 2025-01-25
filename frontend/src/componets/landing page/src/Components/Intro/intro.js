import React from 'react';
import './intro.css';


const Intro = () => {
    return ( 
        <section id="intro">
            <div className="introContent">
                <span className="hello">Hello</span>
                <span className="introText">We're <span className="introName">Planet Pricer</span> <br />a web application for designing and budgeting gardens </span>
                <p className="introblabla">"Turn your garden into a private paradise – we’re here to create a beautiful, functional, and perfectly designed outdoor space tailored to your taste!"</p>
                
            </div>
            
        </section>
    )
}
export default Intro;