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
    fetch("/api/change_requests", {
      headers: getAuthRequestHeaders(), 
    }).then(resp => {
      const accessToken = resp.headers.get('access-token');
      if(accessToken) {
        localStorage.setItem("access-token", JSON.stringify(accessToken));
      }
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


