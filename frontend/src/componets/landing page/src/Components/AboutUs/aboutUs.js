import React, { useState, useEffect } from 'react';
import './aboutUs.css';
import logoForaboutUs from '../../assest/main-icon.jpg';
import APIService from '../../../../APIService/index'; // Ensure the service is properly set up
import { useNavigate } from 'react-router-dom';
const AboutUs = () => {
  const [ratings, setRatings] = useState([]); // Store ratings and feedback
  const navigate = useNavigate();
  // Fetch ratings from the server
  useEffect(() => {
    APIService.rating() // Assume APIService provides this function
      .then((response) => {
        setRatings(response.data); // Store fetched ratings
      })
      .catch((error) => console.error("Error fetching reviews:", error));
  }, []);

  return (
    <div>
      <section id="aboutUs">
        <span className='aboutUsTitle'>About us</span>
        <span className='aboutUsdec'>
          At Plant Pricer, we understand that designing and building the perfect garden requires not only creativity but also careful budgeting. That's why we've developed a unique system tailored for homeowners and property owners who want to plan their dream garden while keeping track of their expenses.
          Our platform allows users to easily create their garden layout, freely adding the elements they envision, all while monitoring the estimated cost. Unlike other design tools, our system ensures that users can plan their ideal garden without exceeding their budget, preventing unexpected expenses and delays in the actual construction process.
          With Plant Pricer, you can easily and efficiently bring your garden dreams to life, while managing your budget and keeping the project on track. We're here to help you design a beautiful, functional garden—without the financial surprises.
        </span>
        <img src={logoForaboutUs} alt="LogoForaboutUs" className="logoForaboutUs" />
      </section>

      <div className="reviews-container">
        <div className='header'>
     <h1 className="white-text">We talk about us</h1>
                        <button
                            className="btn btn-primary add-button"
                            onClick={() => navigate('/rating')}
                        >
                            <i className="bi bi-plus"></i>
                        </button>
        </div>

        <div className="scrolling-container">
          {ratings.length > 0 && (
            <div className="scrolling-content" style={{ width: `${ratings.length * 320}px` }}>
              {ratings.map((review, index) => (
                <div className="review-box" key={index}>
                  <h3>{review.Name}</h3>
                  <p>Stars: {"★".repeat(review.stars)}</p>
                  <p>Feedback: {review.review}</p>
                </div>
              ))}
              {ratings.map((review, index) => (
                <div className="review-box" key={`copy-${index}`}>
                  <h3>{review.Name}</h3>
                  <p>Stars: {"★".repeat(review.stars)}</p>
                  <p>Feedback: {review.review}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
