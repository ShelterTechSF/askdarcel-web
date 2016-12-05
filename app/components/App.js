import React, { Component } from 'react';
import Navigation from './Navigation';
import CategoryPage from './Find/FindPage';
import ResourcesTable from './Search/ResourcesTable';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userLocation: null
    };
  }

  getLocation(successCB, errorCB) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successCB, errorCB);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  componentDidMount() {
    this.getLocation(position => {
      this.setState({
        userLocation: position
      });
    });
  }

  render() {
    let childrenWithProps = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        userLocation: this.state.userLocation,
        getLocation: this.getLocation
      });
    });

    return (!this.props.error && this.props.location.pathname != '/') ? (
      <div>
        <Navigation />
        {childrenWithProps}
      </div>
    ) : <div>
    	{childrenWithProps}
    	</div>
  }

};

export default App;
