import React from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router'
import { images } from '../assets';

class Navigation extends React.Component {
    submitSearch(e) {
      e.preventDefault();
      if(this.searchComponent.value) {
        browserHistory.push({
            pathname: '/resources',
            query: { query: this.searchComponent.value }
        });
        window.location.reload();
      }
      return false;
    }
  render() {
    return (
    <nav className="site-nav" role="navigation">
      <div className="nav-left">
        <a className="nav-logo" href="/">
          <img src={images.logoSmall} alt="Ask Darcel"/>
        </a>
        <form onSubmit={this.submitSearch.bind(this)} className="nav-search search-container form-row" role="search">
          <input ref={(c) => this.searchComponent = c} type="text" className="search-field" placeholder="I'm looking for..." name="srch-term" id="srch-term" />
        </form>
      </div>
      <ul className="nav-list disabled-feature">
        <li><a className="find">Find</a></li>
        <li><a className="saved">Saved</a></li>
        <li><a className="review">Review</a></li>
        <li><a className="goals">Goals</a></li>
        <li><a className="me">Me</a></li>
      </ul>
    </nav>
    )
  }
}

export default Navigation;
