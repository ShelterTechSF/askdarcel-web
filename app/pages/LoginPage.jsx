import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { login } from 'models/auth';

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
      browserHistory.push('/admin');
    }
  }

  render() {
    const { email, password } = this.state;
    return (
      <div className="login-page">
        <div className="auth-container">
          <header>
            <p className="splash-instructions">Enter your username and password</p>
            {
              this.props.loginError && <span className="danger">{ this.props.loginError }</span>
            }
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
              onClick={() => this.props.login(email, password)}
              role="link"
              tabIndex={0}
              className="login-btn"
            >Login</a>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.auth,
  }),
  dispatch => bindActionCreators({ login }, dispatch),
)(Login);
