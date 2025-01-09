import { useState, useEffect } from "react";
import Navbar from "../landing page/src/Components/navbar/navbar"; // ודא שהנתיב נכון
import APIService from "../APIService"; // תוודא שהשירות מותקן

function AboutUs() {
  const [ratings, setRatings] = useState([]); // לאחסן את הדירוגים וההערות

  // קבלת הדירוגים מהשרת
  useEffect(() => {
    APIService.rating()  // הנחה ש-APIService מספק את הפונקציה הזו
      .then((response) => {
        setRatings(response.data); // שמירת הדירוגים שהתקבלו
      })
      .catch((error) => console.error("Error fetching reviews:", error));
  }, []);

  return (
    <div>
      <Navbar />
      <div>
        <section id="aboutUs">
          <span className='aboutUsTitle'>About us</span>
          <span className='aboutUsdec'>
            At Plant Pricer, we understand that designing and building the perfect garden requires not only creativity but also careful budgeting...
          </span>
        </section>
      </div>

      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>We talk about us</h1>
        {/* מסילה זזה */}
        <div
          style={{
            display: "flex",
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            width: "100%",
          }}
        >
          {/* הצגת הדירוגים */}
          {ratings.length > 0 && (
            <div
              style={{
                display: "flex",
                animation: "scroll 40s linear infinite", // אנימציה מתמשכת
                width: `${ratings.length * 320}px`, // רוחב של כל הדירוגים יחד כולל רווחים
              }}
            >
              {ratings.map((review, index) => (
                <div
                  key={index}
                  style={{
                    width: "300px",  // רוחב קבוע לריבוע
                    height: "300px", // גובה קבוע שווה לרוחב (הופך את זה לריבוע)
                    margin: "0 15px", // הוספת רווח בין כל ריבוע לריבוע
                    padding: "20px",
                    border: "1px solid #ccc",
                    borderRadius: "8px", // שומרים על הקצוות המעוגלים
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <h3>{review.Name}</h3>
                  <p>Stars: {"★".repeat(review.stars)} </p>
                  <p>Feedback: {(review.review)}</p>
                </div>
              ))}
              {/* שכפול הדירוגים כדי להשיג את האפקט המעגלי */}
              {ratings.map((review, index) => (
                <div
                  key={`copy-${index}`}
                  style={{
                    width: "300px",  // רוחב זהה לרוחב המקורי
                    height: "300px", // גובה זהה לרוחב
                    margin: "0 15px", // הוספת רווחים בין כל ריבוע וריבוע
                    padding: "20px",
                    border: "1px solid #ccc",
                    borderRadius: "8px", // שומרים על הקצוות המעוגלים
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <h3>{review.Name}</h3>
                  <p>Stars: {"★".repeat(review.stars)} </p>
                  <p>Feedback: {(review.review)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* הוספת האנימציה ל-CSS */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0); /* מתחילים מימין */
          }
          100% {
            transform: translateX(-50%); /* עוברים שמאלה */
          }
        }
      `}</style>
    </div>
  );
}

export default AboutUs;
