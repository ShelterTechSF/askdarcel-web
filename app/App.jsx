import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getUserLocation } from 'models/user';
// import 'react-select/dist/react-select.css';

import Navigation from 'components/ui/Navigation';

// TODO Add user session tracking here
class App extends React.Component {
  componentWillMount() {
    this.props.getUserLocation();
  }

  render() {
    return (
      <div>
        <Navigation />
        <div className="container">
          { this.props.children }
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({ ...state.user }),
  dispatch => bindActionCreators({ getUserLocation }, dispatch),
)(App);
