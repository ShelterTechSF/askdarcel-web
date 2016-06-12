import React, { Component } from 'react';
import Header from './Header';
import CategoryPage from './CategoryPage';
import ResourcesTable from './Resources/ResourcesTable';

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
        <Header />
        {childrenWithProps}
      </div>
    ) : <div>
    	{childrenWithProps}
    	</div>
  }

};

export default App;
