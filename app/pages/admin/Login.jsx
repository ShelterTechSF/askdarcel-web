import React from 'react';
import { connect } from 'react-redux';

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
    if (this.props.isAuthenticated) {
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
              <input
                onChange={e => this.setState({ email: e.target.value })}
                type="text"
                placeholder="username"
              />
            </div>
            <div className="input-container">
              <input
                type="password"
                onChange={e => this.setState({ password: e.target.value })}
                placeholder="password"
              />
            </div>
            <a
              role="link"
              onClick={() => this.props.adminLogin(email, password)}
              className="login-btn"
              tabIndex={0}
            >
                Login
            </a>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    adminLogin: (email, password) => dispatch(authActions.adminLogin(email, password)),
  };
}

export const LoginPage = connect(mapStateToProps, mapDispatchToProps)(Login);
