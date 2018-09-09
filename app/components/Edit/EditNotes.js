import React, { Component } from 'react';
import './EditNotes.scss';


class EditNotes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: {},
      existingNotes: props.notes ? props.notes.map((note) => {
        let newNote = note;
        newNote.key = note.id;
        return newNote;
      }) : [],
      uuid: -1,
    };

    this.renderNotes = this.renderNotes.bind(this);
    this.handleNoteChange = this.handleNoteChange.bind(this);
    this.addNote = this.addNote.bind(this);
    this.removeNote = this.removeNote.bind(this);
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
    let newUUID = this.state.uuid - 1;
    existingNotes.push({
      key: newUUID,
    });
    this.setState({ existingNotes: existingNotes, uuid: newUUID });
  }

  removeNote(index) {
    let existingNotes = this.state.existingNotes;
    let currentNote = existingNotes[index];
    currentNote.isRemoved = true;
    let key = currentNote.key;
    let notes = this.state.notes;
    // If we haven't created the note in our DB yet
    // just remove it from the object locally
    if (key < 0) {
      delete notes[key];
    } else {
      notes[key] = { isRemoved: true };
    }

    this.setState({
      notes: notes,
      existingNotes: existingNotes,
    }, function() {
      this.props.handleNotesChange(this.state);
    });
  }

  renderNotes() {
    let notesArray = [];

    for (let i = 0; i < this.state.existingNotes.length; i++) {
      let note = this.state.existingNotes[i];
      notesArray.push(
        <EditNote key={note.key} index={i} note={note} handleChange={this.handleNoteChange} removeNote={this.removeNote} />
      );
    }

    return notesArray;
  }

  render() {
    return (
      <li className="edit--section--list--item edit--notes">
				<label>Notes </label>
				<p style={{margin: '0 0 15px 0'}}><a href="https://guides.github.com/features/mastering-markdown/" target="_blank">Markdown</a> is also supported for notes.</p>
        <ul className="edit--section--list--item--sublist">
					{this.renderNotes()}
				</ul>
        <button className="edit--section--list--item--button" onClick={this.addNote}><i className="material-icons">add_box</i>Add Note</button>
			</li>
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
    this.setState({ note: note });

    this.props.handleChange(this.props.note.key, note);
  }

  render() {
    let note = null;
    let currentNote = this.props.note;
    if (!currentNote.isRemoved) {
      note = (
        <li>
          <label>Note {this.props.index+1}</label>
          <textarea
            className="large-input input"
            placeholder='ex. open only for seniors from 4:00-5:00 PM on Mondays'
            defaultValue={currentNote.note}
            onChange={this.handleFieldChange} />
          <button className="delete-note icon-button" onClick={() => this.props.removeNote(this.props.index)}><i className="material-icons">delete</i></button>
        </li>
      )
    }
    return (
      note
    );
  }
}

export default EditNotes;
