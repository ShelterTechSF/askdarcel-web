import React from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router'
import { images } from '../../assets';

class EditSections extends React.Component {
  renderSectionFields(){
    if (tel) {
      return (
      <li className="edit-section-item tel">
        <label>Telephone</label>
        <input type="tel" placeholder="ex. 415-555-5555" />
      </li>
      );
    } if (email) {
      return (
      <li className="edit-section-item email">
        <label>Email</label>
        <input type="email" placeholder="ex. info@sheltertech.org" />
      </li>
      );
    } if (hours) {
      return (
      <li className="edit-section-item hours">
        <label>Hours of Operation</label>
        <ul className="edit-hours-list">
          <li><p>M</p><input id="hours-open" type="time" /><input id="hours-close" type="time" /></li>
          <li><p>T</p><input type="time" /><input id="hours-close" type="time" /></li>
          <li><p>W</p><input type="time" /><input id="hours-close" type="time" /></li>
          <li><p>Th</p><input type="time" /><input id="hours-close" type="time" /></li>
          <li><p>F</p><input type="time" /><input id="hours-close" type="time" /></li>
          <li><p>S</p><input type="time" /><input id="hours-close" type="time" /></li>
          <li><p>Su</p><input type="time" /><input id="hours-close" type="time" /></li>
        </ul>
      </li>
      );
    }
    return (
      <li className="edit-section-item text">
        <label>Database Field</label>
        <input type="text" placeholder="ex. XXXX" />
      </li>
      );
  }

  render() {
    return (
    <section className="edit-section SECTION_NAME">
      <ul className="edit-section-list">
        {this.renderSectionFields}
      </ul>
    </section>
    )
  }
}

export default EditSections;
