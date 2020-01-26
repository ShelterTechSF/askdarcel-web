import React, { Component } from 'react';

class EditNotes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: {},
      existingNotes: props.notes ? props.notes.map(note => {
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
    const { notes } = this.state;
    const { handleNotesChange } = this.props;
    notes[key] = note;
    this.setState({
      notes,
    }, () => {
      handleNotesChange(this.state);
    });
  }

  addNote() {
    const { existingNotes, uuid } = this.state;
    const newUUID = uuid - 1;
    existingNotes.push({
      key: newUUID,
    });
    this.setState({ existingNotes, uuid: newUUID });
  }

  removeNote(index) {
    const { handleNotesChange } = this.props;
    const { existingNotes, notes } = this.state;
    const currentNote = existingNotes[index];
    currentNote.isRemoved = true;
    const { key } = currentNote;
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
      handleNotesChange(this.state);
    });
  }

  renderNotes() {
    const { existingNotes } = this.state;
    return existingNotes.map((note, i) => (
      <EditNote
        key={note.key}
        index={i}
        note={note}
        handleChange={this.handleNoteChange}
        removeNote={this.removeNote}
      />
    ));
  }

  render() {
    return (
      <li className="edit--section--list--item edit--notes">
        <label htmlFor="add-note">
          Notes
        </label>
        <p>
          <a href="https://github.github.com/gfm/" target="_blank" rel="noopener noreferrer">Markdown</a>
          {' '}
is also supported for notes.
        </p>
        <ul className="edit--section--list--item--sublist">
          {this.renderNotes()}
        </ul>
        <button
          type="button"
          className="edit--section--list--item--button"
          onClick={this.addNote}
        >
          <i className="material-icons">add_box</i>
          {' '}
Add Note
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
    const { note } = this.state;
    const { handleChange, note: { key } } = this.props;
    note.note = e.target.value;
    this.setState({ note });

    handleChange(key, note);
  }

  render() {
    let note = null;
    const { index, note: currentNote, removeNote } = this.props;
    if (!currentNote.isRemoved) {
      note = (
        <li>
          <label htmlFor={`note-${index + 1}`}>
Note
            {index + 1}
          </label>
          <textarea
            id={`note-${index + 1}`}
            className="large-input input"
            placeholder="Note"
            defaultValue={currentNote.note}
            onChange={this.handleFieldChange}
          />
          <button
            type="button"
            className="delete-note"
            onClick={() => removeNote(index)}
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
