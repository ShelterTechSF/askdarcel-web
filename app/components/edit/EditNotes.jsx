import React, { Component } from 'react';

class EditNotes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: {},
      existingNotes: props.notes ? props.notes.map((note) => {
        const newNote = note;
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
    const notes = this.state.notes;
    notes[key] = note;
    this.setState({
      notes,
    }, function () {
      this.props.handleNotesChange(this.state);
    });
  }

  addNote() {
    const existingNotes = this.state.existingNotes;
    const newUUID = this.state.uuid - 1;
    existingNotes.push({
      key: newUUID,
    });
    this.setState({ existingNotes, uuid: newUUID });
  }

  removeNote(index) {
    const existingNotes = this.state.existingNotes;
    const currentNote = existingNotes[index];
    currentNote.isRemoved = true;
    const key = currentNote.key;
    const notes = this.state.notes;
    // If we haven't created the note in our DB yet
    // just remove it from the object locally
    if (key < 0) {
      delete notes[key];
    } else {
      notes[key] = { isRemoved: true };
    }

    this.setState({
      notes,
      existingNotes,
    }, () => {
      this.props.handleNotesChange(this.state);
    });
  }

  renderNotes() {
    const notesArray = [];

    for (let i = 0; i < this.state.existingNotes.length; i++) {
      const note = this.state.existingNotes[i];
      notesArray.push(
        <EditNote
          key={note.key}
          index={i}
          note={note}
          handleChange={this.handleNoteChange}
          removeNote={this.removeNote}
        />,
      );
    }

    return notesArray;
  }

  render() {
    return (
      <li className="edit--section--list--item edit--notes">
        <label htmlFor="add-note">
          Notes
        </label>
        <p><a href="https://github.github.com/gfm/" target="_blank" rel="noopener noreferrer">Markdown</a> is also supported for notes.</p>
        <ul className="edit--section--list--item--sublist">
          {this.renderNotes()}
        </ul>
        <button
          className="edit--section--list--item--button"
          onClick={this.addNote}
        >
          <i className="material-icons">add_box</i> Add Note
        </button>
      </li>
    );
  }
}

/* eslint-disable react/no-multi-comp */
class EditNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      note: {},
    };
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  handleFieldChange(e) {
    const note = this.state.note;
    note.note = e.target.value;
    this.setState({ note });

    this.props.handleChange(this.props.note.key, note);
  }

  render() {
    let note = null;
    const currentNote = this.props.note;
    if (!currentNote.isRemoved) {
      note = (
        <li>
          <label htmlFor={`note-${this.props.index + 1}`}>Note {this.props.index + 1}</label>
          <textarea
            id={`note-${this.props.index + 1}`}
            className="large-input input"
            placeholder="Note"
            defaultValue={currentNote.note}
            onChange={this.handleFieldChange}
          />
          <button
            className="delete-note"
            onClick={() => this.props.removeNote(this.props.index)}
          >
            <i className="material-icons">&#xE872;</i>
          </button>
        </li>
      );
    }
    return (
      note
    );
  }
}

export default EditNotes;
