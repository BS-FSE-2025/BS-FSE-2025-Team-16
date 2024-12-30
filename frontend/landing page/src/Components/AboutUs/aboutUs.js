import React from 'react';
import '../AboutUs/aboutUs.css';
import logoForaboutUs from '../../assest/main-icon.jpg';


const AboutUs = () => {
    return ( 
        <section id="aboutUs">
            <span className='aboutUsTitle'>About us</span>
            <span className='aboutUsdec'>At Plant Pricer, we understand that designing and building the perfect garden requires not only creativity but also careful budgeting. That's why we've developed a unique system tailored for homeowners and property owners who want to plan
                 their dream garden while keeping track of their expenses.
                Our platform allows users to easily create their garden layout, freely adding the elements they envision, all while monitoring the estimated cost. Unlike other design tools, our system ensures that users can plan their ideal garden without exceeding their budget,
                preventing unexpected expenses and delays in the actual construction process.
                With Plant Pricer, you can easily and efficiently bring your garden dreams to life, while managing your budget and keeping the project on track. We're here to help you design a beautiful, functional garden—without the financial surprises.</span>
             <img src={logoForaboutUs} alt="LogoForaboutUs" className="logoForaboutUs" />
        </section>
    )
}
export default AboutUs;