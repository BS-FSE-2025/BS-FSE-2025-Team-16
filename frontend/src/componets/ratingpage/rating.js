import { useState,useEffect } from "react";
import Navbar from "../landing page/src/Components/navbar/navbar"; // Make sure the path is correct
import LoginPopup from "../LoginPopup";
import APIService from "../APIService";

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
  useEffect(()=>{
    setUser(JSON.parse(localStorage.getItem('loggedInUser')));
  },[])
  const handleSubmit = () => {
    // Handle the submit action (e.g., sending the data to a server)
    console.log("Rating submitted:", rating);
    console.log("Feedback submitted:", feedback);
    console.log(user)
    APIService.NewReview({"rating":rating,"feedback":feedback, "id":user.Id})
    // You could reset the form or show a success message here
    window.location.reload()
  };

  return (
    <div>
      <Navbar hundleOpenLoginPopup={handleOpenLoginPopup} />
      
      <div style={{ padding: "40px", textAlign: "center" }}>
        {/* Gratitude Paragraph */}
        <p style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "20px" }}>
          Thank you so much for visiting our page! We truly appreciate your time
          and support. Your feedback helps us improve and provide a better experience.
          Please take a moment to rate this page and share your thoughts with us!
        </p>

        {/* Rating Section */}
        <h1>Rate this page</h1>
        <div>
          <h2>Give your rating:</h2>
          {/* Render rating buttons */}
          <div>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRatingClick(star)}
                style={{
                  backgroundColor: rating >= star ? "gold" : "gray",
                  border: "none",
                  padding: "10px",
                  margin: "5px",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2>Leave feedback:</h2>
          <textarea
            value={feedback}
            onChange={handleFeedbackChange}
            placeholder="Enter your feedback or suggestions here"
            rows="5"
            cols="50"
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              fontSize: "16px",
            }}
          ></textarea>
        </div>

        <div style={{ marginTop: "20px" }}>
          <button
            onClick={handleSubmit}
            style={{
              padding: "10px 20px",
              backgroundColor: "green",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Submit Rating & Feedback
          </button>
        </div>

        {show && <LoginPopup isOpen={show} setIsOpen={setShow} />}
      </div>
    </div>
  );
}

export default RatingPage;