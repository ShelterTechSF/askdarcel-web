import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { images } from '../../assets';

import authActions from '../../actions/authActions';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  componentWillMount() {
    if(this.props.isAuthenticated) {
      // browserHistory.push('/testAuth');
    }
  }

  render() {
    const { email, password } = this.state;
    return (
      <div className="login-page">
        <div className="auth-container">
          <header>
            <p className="splash-instructions">Enter your username and password</p>
          </header>
          <div className="splash-actions">
            <div className="input-container">
              <input onChange={(e) => this.setState({ email: e.target.value })} type="text" placeholder="username" />
            </div>
            <div className="input-container">
              <input type="password" onChange={(e) => this.setState({ password: e.target.value })} placeholder="password" />
            </div>
            <a onClick={() => this.props.adminLogin(email, password)} className="login-btn">Login</a>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: true,
  };
}

function mapDispatchToProps(dispatch) {
  return {
   // adminLogin: (email, password) => dispatch(authActions.adminLogin(email, password)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
