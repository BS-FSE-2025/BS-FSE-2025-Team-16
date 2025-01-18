import { useState, useEffect } from "react";
import Navbar from "../landing page/src/Components/navbar/navbar"; // Make sure the path is correct
import LoginPopup from "../LoginPopup";
import APIService from "../APIService";
import '../ratingpage/rating.css'; // Import the CSS file

function RatingPage() {
  const [show, setShow] = useState(false);
  const [rating, setRating] = useState(0); // To store the user's rating
  const [feedback, setFeedback] = useState(""); // To store the feedback text
  const [user, setUser] = useState({});
  
  const handleOpenLoginPopup = () => {
    setShow(!show);
  };

  const handleRatingClick = (value) => {
    setRating(value); // Update rating when a button is clicked
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value); // Update feedback text when user types
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('loggedInUser')));
  }, []);

  const handleSubmit = () => {
    // Handle the submit action (e.g., sending the data to a server)
    console.log("Rating submitted:", rating);
    console.log("Feedback submitted:", feedback);
    console.log(user);
    APIService.NewReview({"rating": rating, "feedback": feedback, "id": user.Id});
    window.location.reload();
    window.location.href = '/';
  };

  return (
    <div>
      <Navbar hundleOpenLoginPopup={handleOpenLoginPopup} />
      <div className="rating-container">
        {/* Gratitude Paragraph */}
        <p className="rating-paragraph">
          Thank you so much for visiting our page! We truly appreciate your time
          and support. Your feedback helps us improve and provide a better experience.
          Please take a moment to rate this page and share your thoughts with us!
        </p>

        {/* Rating Section */}
        <h1 className="rating-header">Rate this page</h1>
        <div>
          <h2>Give your rating:</h2>
          <div className="rating-buttons">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRatingClick(star)}
                className={`rating-button ${rating >= star ? "selected" : ""}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="feedback-section">
          <h2>Leave feedback:</h2>
          <textarea
            value={feedback}
            onChange={handleFeedbackChange}
            placeholder="Enter your feedback or suggestions here"
            rows="5"
            cols="50"
            className="feedback-textarea"
          ></textarea>
        </div>

        <div className="submit-button-container">
          <button onClick={handleSubmit} className="submit-button">
            Submit Rating & Feedback
          </button>
        </div>

        {show && <LoginPopup isOpen={show} setIsOpen={setShow} />}
      </div>
    </div>
  );
}

export default RatingPage;
