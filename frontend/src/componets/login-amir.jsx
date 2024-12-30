import '../Amir.css'

function SignButton() {
  return (
    <button className="topButtons">
      Sign Up
    </button>
  );
}
function LoginButton() {
  return (
    <button className="topButtons">
      Log In
    </button>
  );
}
function StartButton() {
  return (
    <button className="button-text-image">
      <img src="/plant1.jpeg" alt="buttonIcon" className="button-icon" />
      <span className="button-main">Start a new project.</span>
      <span className="button.sec">Plan your garden and check how much it will cost you.</span>
    </button>
  )
}

function Login_Amir(){
  return(
    <div>
      {/* green bar with sign up and login buttons */}
      <div className="bar">
        <SignButton/>
        <LoginButton/>
      </div>
      
      {/* front page text */}
      <div style={{textAlign: 'center', marginTop: '10px', color: 'green'}}>
        <h1> Welcome to PlantPricer </h1>
        <p> Start planning our garden with us today!</p>
        <div className="center-container">
        <StartButton/>
        </div>
      </div>
    </div>
  );
}
export default Login_Amir;