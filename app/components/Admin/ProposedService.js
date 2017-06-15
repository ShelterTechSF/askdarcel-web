import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import * as dataService from '../../utils/DataService';
import * as ChangeRequestTypes from './ChangeRequestTypes';
import Actions from './Actions';

class ProposedService extends React.Component {
  constructor(props) {
    super(props);

    this.state = { schedule: {}, serviceFields: {}, notes: {}, schedule: {} };
    this.renderNotesFields = this.renderNotesFields.bind(this);
    this.renderScheduleFields = this.renderScheduleFields.bind(this);
    this.renderAdditionalFields = this.renderAdditionalFields.bind(this);
    this.changeScheduleValue = this.changeScheduleValue.bind(this);
    this.changeNoteValue = this.changeNoteValue.bind(this);
    this.changeServiceValue = this.changeServiceValue.bind(this);
  }

  componentDidMount() {
    let tempService = this.props.service;
    let newServiceFields = this.state.serviceFields;
    let tempNotes = this.state.notes;
    let tempSchedule = this.state.schedule;

    for (let field in tempService) {
      if (tempService.hasOwnProperty(field) && field !== 'id' && field !== 'resource') {
        if (field === "notes") {
          let notes = tempService[field];
          let tempNoteObj = {};
          notes.forEach((curr, i) => {
            tempNotes[i] = curr.note;
          });
        } else if (field === "schedule") {
          let schedule = tempService[field];
          let scheduleDays = schedule.schedule_days;
          scheduleDays.forEach((day, i) => {
            tempSchedule[i] = { day: day.day, opens_at: day.opens_at, closes_at: day.closes_at }
          })
        } else {
          newServiceFields[field] = tempService[field];
        }
      }
    }
    this.setState({ serviceFields: newServiceFields, notes: tempNotes, schedule: tempSchedule });
  }


  changeScheduleValue(day, value, time) {
    console.log('time', time);
    let { schedule } = this.state;
    let tempSchedule = {};
    if(time == 'open') {
      tempSchedule = Object.assign({}, schedule, {[day]: Object.assign({}, schedule[day], { opens_at: parseInt(value) } )});  
    } else {
      tempSchedule = Object.assign({}, schedule, {[day]: Object.assign({}, schedule[day], { closes_at: parseInt(value) } )});  
    }
    this.setState({ schedule: tempSchedule });
  }

  changeNoteValue(note, value) {
    let tempNotes = Object.assign({}, this.state.notes, { [note]: value });
    this.setState({ notes: tempNotes });
  }

  changeServiceValue(serviceField, value) {
    let tempServiceFields = Object.assign({}, this.state.serviceFields, { [serviceField]: value });
    this.setState({ serviceFields: tempServiceFields });
  }
  renderScheduleFields() {
    let { schedule } = this.state;
    let scheduleOutput = [];
    for(let day in schedule) {
      scheduleOutput.push(
          <div key={"sched" + day} className="request-entry">
            <p className="request-cell name">{schedule[day].day + "(Opens at)"}</p>
<<<<<<< HEAD
            <TextareaAutosize className="value request-cell" value={schedule[day].opens_at} onChange={(e) => this.changeScheduleValue(day, e.target.value, 'open')} />
=======
            <textarea className="value request-cell" value={schedule[day].opens_at || ''} onChange={(e) => this.changeScheduleValue(day, e.target.value, 'open')} />
>>>>>>> master
          </div>
      );
      scheduleOutput.push(
        <div key={"sched closes" + day} className="request-entry">
          <p className="request-cell name">{schedule[day].day + "(Closes at)"}</p>
<<<<<<< HEAD
          <TextareaAutosize className="value request-cell" value={schedule[day].closes_at} onChange={(e) => this.changeScheduleValue(day, e.target.value, 'close')} />
=======
          <textarea className="value request-cell" value={schedule[day].closes_at || ''} onChange={(e) => this.changeScheduleValue(day, e.target.value, 'close')} />
>>>>>>> master
        </div>
      )
    }
    return scheduleOutput;
  }
  renderNotesFields() {
    let { notes } = this.state;
    let notesOutput = [];
    for(let note in notes) {
      notesOutput.push(
        <div key={"note" + note} className="request-entry">
          <p className="request-cell name">{`note ${note}`}</p>
<<<<<<< HEAD
          <TextareaAutosize className="request-cell value" value={notes[note]} onChange={(e) => this.changeNoteValue(note, e.target.value)} />
=======
          <textarea className="request-cell value" value={notes[note] || ''} onChange={(e) => this.changeNoteValue(note, e.target.value)} />
>>>>>>> master
        </div>
      );
    }
    return notesOutput;
  }

  renderAdditionalFields() {
    let { serviceFields } = this.state;
    let additionalOutput = [];
    for(let field in serviceFields) {
      additionalOutput.push(
        <div key={field} className="request-entry">
          <p className="request-cell name">{field}</p>
<<<<<<< HEAD
          <TextareaAutosize className="request-cell value" value={serviceFields[field]} onChange={(e) => this.changeServiceValue(field, e.target.value)} />
=======
          <textarea className="request-cell value" value={serviceFields[field] || ''} onChange={(e) => this.changeServiceValue(field, e.target.value)} />
>>>>>>> master
        </div>
      );
    }
    return additionalOutput;
  }

  render() {
    let { notes, schedule, serviceFields } = this.state;
    return (
      <div className="change-log">
        <div className="request-fields">
          {this.renderNotesFields()}
          {this.renderScheduleFields()}
          {this.renderAdditionalFields()}
        </div>
        <Actions
            id={this.props.service.id}
            changeRequestFields={{...serviceFields, notes, schedule}}
            actionHandler={this.props.actionHandler}
            approveAction={ChangeRequestTypes.APPROVE_SERVICE}
            rejectAction={ChangeRequestTypes.REJECT_SERVICE}
          />
      </div>
    );
  }
}


export default ProposedService;
