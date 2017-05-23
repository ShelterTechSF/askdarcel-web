import React from 'react';
import * as dataService from '../../utils/DataService';
import * as ChangeRequestTypes from './ChangeRequestTypes';
import Actions from './Actions';
import TextareaAutosize from 'react-autosize-textarea';



class ChangeRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = { existingRecord: {}, changeRequestFields: {} };
    this.renderChangeRequest = this.renderChangeRequest.bind(this);
    this.changeFieldValue = this.changeFieldValue.bind(this);
  }

  componentDidMount() {
    this.retrieveModifiedObject();
    let fields = this.props.changeRequest.field_changes;
    let tempChangeRequestFields = {};
    fields.forEach(field => {
      tempChangeRequestFields[field.field_name] = field.field_value;
    });

    this.setState({ changeRequestFields: tempChangeRequestFields });

  }

  retrieveModifiedObject() {
    let changeRequest = this.props.changeRequest;
    let resource = changeRequest.resource;
    //"ChangeRequest" is 13 characters, so this will give us the first part of the string
    let objectType = changeRequest.type;
    let object = {};

    switch (objectType) {
      case 'ResourceChangeRequest':
        object = resource;
        break;
      case 'ServiceChangeRequest':
        object = resource.services.filter(service => service.id === changeRequest.object_id)[0];
        break;
      case 'ScheduleDayChangeRequest':
        object = resource.schedule.schedule_days.filter(day => day.id === changeRequest.object_id)[0];
        break;
      case 'AddressChangeRequest':
        object = resource.address;
        break;
      case 'PhoneChangeRequest':
        object = resource.phones.filter(phone => phone.id === changeRequest.object_id)[0];
        break;
      case 'NoteChangeRequest':
        let resourceNotes = resource.notes.filter(note => note.id === changeRequest.object_id);
        if (resourceNotes.length > 0) {
          object = resourceNotes[0];
        } else {
          object = this.findNoteFromServices(resource.services, changeRequest.object_id);
        }
        break;
    }
    this.setState({ existingRecord: object });
  }

  findNoteFromServices(services, noteID) {
    for (let i = 0; i < services.length; i++) {
      let notes = services[i].notes;
      for (let j = 0; j < notes.length; j++) {
        let note = notes[j];
        if (note.id === noteID) {
          return note;
        }
      }
    }
  }

  changeFieldValue(key, value) {
    let tempChangeRequestFields = this.state.changeRequestFields;
    tempChangeRequestFields[key] = value;
    this.setState({ changeRequestFields: tempChangeRequestFields });
  }

  renderChangeRequest() {
    let changedFields = [];
    let existingRecord = this.state.existingRecord;
    let changeRequestFields = this.state.changeRequestFields;

    for (let field in changeRequestFields) {
      changedFields.push(
        <div key={field} className="request-fields">
					<div className="request-entry">
						<p className="request-cell name existing">{field}</p>
						<p className="request-cell value existing">{existingRecord[field]}</p>
					</div>
					<div className="request-entry">
						<p className="request-cell name">{field}</p>
						<TextareaAutosize value={changeRequestFields[field]} onChange={(e) => this.changeFieldValue(field, e.target.value)} className="request-cell value" />
					</div>
				</div>
      );
    }


    return changedFields;
  }

  render() {
    return (
      <div className="change-log">
				{this.renderChangeRequest(this.props.changeRequest)}
				<Actions
						id={this.props.changeRequest.id}
						changeRequestFields={this.state.changeRequestFields}
						actionHandler={this.props.actionHandler}
						approveAction={ChangeRequestTypes.APPROVE}
						rejectAction={ChangeRequestTypes.DELETE}
				/>
			</div>
    );
  }
}

export default ChangeRequest;
