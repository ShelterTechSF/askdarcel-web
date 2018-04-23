import React, { Component } from 'react';
// import { Link } from 'react-router';
import { connect } from 'react-redux';
import { SearchBox } from 'components/search';


class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: '',
      searchResults: '',
    };
  }

  render() {
    return (
      <div className="search-container">
        <SearchBox />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userLocation: state.user.location,
  };
}

function mapDispatchToProps() {
  return {

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
