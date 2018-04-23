import React from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router'
import { images } from '../../assets';

import { getAuthRequestHeaders } from '../../utils/index';


class TestAuth extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {};
  }

  componentDidMount() {
    let authHeaders = JSON.parse(localStorage.authHeaders);
    fetch("/api/change_requests", {headers: getAuthRequestHeaders()}).then(resp => {
      console.log(`Api response: ${resp}`);
    })
    .catch(err => console.log('auth err:',err));
  }


  render() {
    return (
    <div style={{marginTop: 200}}>
      Auth Working
    </div>
    )
  }
}

export default TestAuth;


