import React from 'react';
import * as dataService from '../../utils/DataService';

class ChangeRequest extends React.Component {
    constructor(props) {
        super(props);
        this.state = { existingRecord: {} };
        this.renderChangeRequest = this.renderChangeRequest.bind(this);
    }

    componentDidMount() {
        this.retrieveModifiedObject();
    }

    retrieveModifiedObject() {
        let changeRequest = this.props.changeRequest;
        let resource = changeRequest.resource;
        //"ChangeRequest" is 13 characters, so this will give us the first part of the string
        let objectType = changeRequest.type;
        let object = {};

        switch(objectType) {
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
                if(resourceNotes.length > 0) {
                    object = resourceNotes[0];
                } else {
                    object = this.findNoteFromServices(resource.services, changeRequest.object_id);
                }
                break;
        }

        this.setState({existingRecord: object});
    }

    findNoteFromServices(services, noteID) {
        for(let i = 0; i < services.length; i++) {
            let notes = services[i].notes;
            for(let j = 0; j < notes.length; j++) {
                let note = notes[j];
                if(note.id === noteID) {
                    return note;
                }
            }
        }
    }

    renderChangeRequest() {
        let changedFields = [];
        let existingRecord = this.state.existingRecord;

        this.props.changeRequest.field_changes.forEach((fieldChange) => {
            let fieldName = fieldChange.field_name;
            let fieldValue = fieldChange.field_value;

            changedFields.push(
                <div key={fieldName} className="request-fields">
                    <div className="request-entry">
                        <p className="request-cell name existing">{fieldName}</p>
                        <p className="request-cell value existing">{existingRecord[fieldName]}</p>
                    </div>
                    <div className="request-entry">
                        <p className="request-cell name">{fieldName}</p>
                        <p className="request-cell value">{fieldValue}</p>
                    </div>
                </div>
            );
        });

        return changedFields;
    }

    render() {
        return (
            <div className="change-log">
                {this.renderChangeRequest(this.props.changeRequest)}
            </div>
        );
    }
}

export default ChangeRequest;
