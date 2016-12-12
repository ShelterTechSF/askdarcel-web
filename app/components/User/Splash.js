import React from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router'
import { images } from '../../assets';

class Splash extends React.Component {
  render() {
    return (
    <div className="splash-page">
      <div className="auth-container">
        <header>
          <h1 className="splash-logo">AskDarcel</h1>
          <p className="splash-instructions">Create an account to review resources you've used.</p>
        </header>
        <div className="splash-actions">
          <a className="signup-btn">Create Account</a>
          <a className="login-btn">Login</a>
        </div>
        <small className="splash-legal">By signing up, you agree to AskDarcel's <a href="">Terms of Service</a> and <a href="">Privacy Policy</a>. We will never share private identifying information without your permission.</small>
      </div>
    </div>
    )
  }
}

export default Splash;
