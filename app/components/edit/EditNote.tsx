import React, { Component } from "react";
import type { InternalNote, InternalNoteChanges } from "./EditNotes";

type Props = {
  index: number;
  note: InternalNote;
  handleChange: (key: number, note: InternalNoteChanges) => void;
  removeNote: (index: number) => void;
};

type State = {
  note: InternalNoteChanges;
};

class EditNote extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      note: {},
    };
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  handleFieldChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const { note } = this.state;
    const {
      handleChange,
      note: { key },
    } = this.props;
    const newNote = {
      ...note,
      note: e.target.value,
    };

    this.setState({
      note: newNote,
    }, () => {
      const {note: stateNote} = this.state;
      handleChange(key, stateNote);
    });
  }

  render() {
    let note: JSX.Element | null = null;
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
