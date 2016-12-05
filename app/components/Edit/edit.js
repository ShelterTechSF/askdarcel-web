import React from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router'
import { images } from '../../assets';
import EditSections from './EditSections';

class Edit extends React.Component {
  render() {
    return (
    <div className="edit-page">
      <header className="edit-header">
        <a className="back-btn"></a>
        <h1 className="edit-title">Organisation Name</h1>
        <a className="edit-submit-btn">Save</a>
      </header>
      <ul className="edit-sections">
        <EditSections />
      </ul>
    </div>
    )
  }
}

export default Edit;
