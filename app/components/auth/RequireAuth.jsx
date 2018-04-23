import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';

export default function RequireAuth(Component) {
  class AuthenticatedComponent extends React.Component {
    componentWillMount() {
      this.checkAuth(this.props.isAuthenticated);
    }

    // TODO Props for special permissions for a given page
    checkAuth(isAuthenticated) {
      if (!isAuthenticated) {
        const loginRedirect = this.props.location.pathname;
        browserHistory.push(`/login?next=${loginRedirect}`);
      }
    }

    render() {
      return (
        <div>
          {this.props.isAuthenticated === true
            ? <Component {...this.props} />
            : null
          }
        </div>
      );
    }
  }

  return connect(
    state => ({ ...state.user, isAuthenticated: state.auth.isAuthenticated }),
  )(AuthenticatedComponent);
}
