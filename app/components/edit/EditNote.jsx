import React, { Component } from 'react';

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
    const {
      handleChange,
      note: { key },
    } = this.props;
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
    return note;
  }
}

export default EditNote;
