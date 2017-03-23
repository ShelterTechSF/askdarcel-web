import React, { Component } from 'react';

class EditNotes extends Component {
    constructor(props) {
        super(props);

        this.state = {
			notes: {},
			existingNotes: props.notes.map((note) => {
				let newNote = note;
				newNote.key = note.id;
				return newNote;
			}),
			uuid: -1
		};

		this.renderNotes = this.renderNotes.bind(this);
		this.handleNoteChange = this.handleNoteChange.bind(this);
		this.addNote = this.addNote.bind(this);
	}

	handleNoteChange(key, note) {
		let notes = this.state.notes;
		notes[key] = note;
		this.setState({
			notes: notes
		}, function() {
			this.props.handleNotesChange(this.state);
		});
	}

	addNote() {
		let existingNotes = this.state.existingNotes;
		let newUUID = this.state.uuid-1;
		existingNotes.unshift({
			key: newUUID
		});
		this.setState({existingNotes: existingNotes, uuid: newUUID});
	}

	renderNotes() {
		let notesArray = [];

		for(let i = 0; i < this.state.existingNotes.length; i++) {
			let note = this.state.existingNotes[i];
			notesArray.push(
				<EditNote key={note.key} index={i} note={note} handleChange={this.handleNoteChange} />
			);
		}

		return notesArray;
	}

	render() {
		return (
			<div className="edit-notes">
				<div className="title-container">
					<label>Notes</label>
					<i className="material-icons" onClick={this.addNote}>note_add</i>
				</div>
				<ul className="edit-section-item">
					{this.renderNotes()}
				</ul>
			</div>
		);
	}
}

class EditNote extends Component {
	constructor(props) {
		super(props);
		this.state = {
			note: {}
		};
		this.handleFieldChange = this.handleFieldChange.bind(this);
	}

	handleFieldChange(e) {
		let note = this.state.note;
		note.note = e.target.value;
		this.setState({note: note});

		this.props.handleChange(this.props.note.key, note);
	}

	render() {
		return (
			<li>
				<label>Note #{this.props.index+1}</label>
				<textarea placeholder='Note' defaultValue={this.props.note.note} onChange={this.handleFieldChange} />
			</li>
		);
	}
}

export default EditNotes;
