import React from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import { images } from '../../assets';

class CreateAccount extends React.Component {
  render() {
    return (
      <div className="create-account-page">
        <div className="auth-container">
          <header>
            <p className="splash-instructions">Enter a username and password</p>
          </header>
          <div className="splash-actions">
            <div className="input-container">
              <input type="text" placeholder="username" />
            </div>
            <div className="input-container">
              <input type="text" placeholder="password" />
            </div>
            <a className="login-btn">Login</a>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateAccount;
