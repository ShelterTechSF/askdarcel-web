import React from 'react';
import PropTypes from 'prop-types';
import TextareaAutosize from 'react-autosize-textarea';

import * as DataService from '../../utils/DataService';
import { getAuthRequestHeaders } from '../../utils/index';

class ProposedService extends React.Component {
  constructor(props) {
    super(props);

    this.state = { schedule: {}, serviceFields: {}, notes: {}, categories: [] };
    this.renderNotesFields = this.renderNotesFields.bind(this);
    this.renderScheduleFields = this.renderScheduleFields.bind(this);
    this.renderAdditionalFields = this.renderAdditionalFields.bind(this);
    this.renderCategoryFields = this.renderCategoryFields.bind(this);
    this.changeScheduleValue = this.changeScheduleValue.bind(this);
    this.changeNoteValue = this.changeNoteValue.bind(this);
    this.changeServiceValue = this.changeServiceValue.bind(this);
  }

  componentDidMount() {
    const tempService = this.props.service;
    const newServiceFields = this.state.serviceFields;
    const tempNotes = this.state.notes;
    const tempSchedule = this.state.schedule;
    let tempCategories = this.state.categories;

    for (const field in tempService) {
      if (tempService.hasOwnProperty(field) && field !== 'id' && field !== 'resource') {
        if (field === 'notes') {
          const notes = tempService[field];
          const tempNoteObj = {};
          notes.forEach((curr, i) => {
            tempNotes[i] = curr.note;
          });
        } else if (field === 'schedule') {
          const schedule = tempService[field];
          const scheduleDays = schedule.schedule_days;
          scheduleDays.forEach((day, i) => {
            tempSchedule[i] = { day: day.day, opens_at: day.opens_at, closes_at: day.closes_at };
          });
        } else if (field === 'categories') {
          tempCategories = tempService[field].map(category => category.name);
        } else {
          newServiceFields[field] = tempService[field];
        }
      }
    }
    this.setState({
      serviceFields: newServiceFields,
      notes: tempNotes,
      schedule: tempSchedule,
      categories: tempCategories,
    });
  }

  approve() {
    const { notes, schedule, serviceFields } = this.state;
    console.log('approving', this.props.service, { ...serviceFields, notes, schedule });

    return DataService.post(
      `/api/services/${this.props.service.id}/approve`,
      { ...serviceFields, notes, schedule },
      getAuthRequestHeaders(),
    )

    .then(response =>
      this.props.updateFunction(response, this.props.service),
    )

    .catch((err) => {
      console.log(err);
    });
  }

  reject() {
    console.log('rejecting');
    return DataService.post(
      `/api/services/${this.props.service.id}/reject`,
      {},
      getAuthRequestHeaders(),
    )

    .then(response =>
      this.props.updateFunction(response, this.props.service),
    )

    .catch((err) => {
      console.log(err);
    });
  }

  changeScheduleValue(day, value, time) {
    console.log('time', time);
    const { schedule } = this.state;
    let tempSchedule = {};
    if (time == 'open') {
      tempSchedule = Object.assign({}, schedule, { [day]: Object.assign({}, schedule[day], { opens_at: parseInt(value) }) });
    } else {
      tempSchedule = Object.assign({}, schedule, { [day]: Object.assign({}, schedule[day], { closes_at: parseInt(value) }) });
    }
    this.setState({ schedule: tempSchedule });
  }

  changeNoteValue(note, value) {
    const tempNotes = Object.assign({}, this.state.notes, { [note]: value });
    this.setState({ notes: tempNotes });
  }

  changeServiceValue(serviceField, value) {
    const tempServiceFields = Object.assign({}, this.state.serviceFields, { [serviceField]: value });
    this.setState({ serviceFields: tempServiceFields });
  }

  renderScheduleFields() {
    const { schedule } = this.state;
    const scheduleOutput = [];
    for (const day in schedule) {
      scheduleOutput.push(
        <div key={'sched' + day} className="change-wrapper request-entry half">
            <label className="request-cell name">{`${schedule[day].day  } (Opens at)`}</label>
            <input className="value request-cell" value={schedule[day].opens_at || ''} onChange={e => this.changeScheduleValue(day, e.target.value, 'open')} />
          </div>,
      );
      scheduleOutput.push(
        <div key={'sched closes' + day} className="change-wrapper request-entry half">
          <label className="request-cell name">{`${schedule[day].day  } (Closes at)`}</label>
          <input className="value request-cell" value={schedule[day].closes_at || ''} onChange={e => this.changeScheduleValue(day, e.target.value, 'close')} />
        </div>,
      );
    }
    // scheduleOutput.push(
    //   <div key={"sched-key-" + this.props.service.id}>
    //     { this.renderLineItem(serviceFields, this.props.service) }
    //   </div>
    // );
    return scheduleOutput;
  }

  renderCategoryFields() {
    return (
      <div className="change-wrapper request-entry">
        <label className="request-cell name">Categories</label>
        <input readOnly className="request-cell value" value={this.state.categories} />
      </div>
    );
  }

  renderNotesFields() {
    const { notes } = this.state;
    const notesOutput = [];
    for (const note in notes) {
      notesOutput.push(
        <div key={`note-${note}`} className="change-wrapper request-entry">
          <label className="request-cell name">{`Note ${note}`}</label>
          <TextareaAutosize
            value={notes[note] || ''}
            onChange={e => this.changeNoteValue(note, e.target.value)}
            className="request-cell value"
          />
          { /* this.renderLineItem(notes, this.props.service) */ }
        </div>,
      );
    }
    return notesOutput;
  }

  renderAdditionalFields() {
    const { serviceFields } = this.state;
    const additionalOutput = [];
    for (const field in serviceFields) {
      additionalOutput.push(
        <div key={field} className="change-wrapper request-entry">
          <label htmlFor={field} className="request-cell">{field.replace(/_/g, ' ')}</label>
          <TextareaAutosize
            value={serviceFields[field] || ''}
            onChange={e => this.changeServiceValue(field, e.target.value)}
            className="request-cell value"
          />
          { /*this.renderLineItem(serviceFields, this.props.service, 'additional') */ }
        </div>,
      );
    }
    return additionalOutput;
  }

  render() {
    const { notes, schedule, serviceFields } = this.state;
    return (
      <div className="change-request">
        <h4>New Service:</h4>
        <div className="request-fields change-wrapper">
          {this.renderAdditionalFields()}
          {this.renderCategoryFields()}
          {this.renderNotesFields()}
          {this.renderScheduleFields()}
        </div>
        <div className="actions request-cell btn-group">
          <button onClick={() => this.approve()}>
            <i className="material-icons">done</i>
            Approve
          </button>

          <button onClick={() => this.reject()} className="danger">
            <i className="material-icons">delete</i>
            Reject
          </button>
        </div>
      </div>
    );
  }
}

ProposedService.propTypes = {
  service: PropTypes.object.isRequired,
  updateFunction: PropTypes.func.isRequired,
};

export default ProposedService;
