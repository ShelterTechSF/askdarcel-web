import React, { Component } from "react";
import EditNote from "./EditNote";
import { Note } from "../../models";

export interface InternalNote extends Partial<Note> {
  key: number;
  isRemoved?: boolean;
}

export interface InternalNoteChanges {
  note?: string;
  isRemoved?: boolean;
}

type Props = {
  notes: Note[] | undefined;
  handleNotesChange: (n: State) => void;
};

export type State = {
  notes: Record<number, InternalNoteChanges>;
  existingNotes: InternalNote[];
  uuid: number;
};

class EditNotes extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      notes: {},
      existingNotes: props.notes
        ? props.notes.map((note) => {
            // HACK: This is bad because we are mutating the props to this
            // component, which should never happen in a component. We should
            // create a copy of the original Note before doing this, but before
            // changing this code, we need to make sure that nothing else is relying on
            // that mutation happening to the original Note props.
            const newNote = note as InternalNote;
            newNote.key = note.id;
            return newNote;
          })
        : [],
      uuid: -1,
    };

    this.renderNotes = this.renderNotes.bind(this);
    this.handleNoteChange = this.handleNoteChange.bind(this);
    this.addNote = this.addNote.bind(this);
    this.removeNote = this.removeNote.bind(this);
  }

  handleNoteChange(key: number, note: InternalNoteChanges): void {
    const { notes } = this.state;
    const { handleNotesChange } = this.props;
    notes[key] = note;
    this.setState(
      {
        notes,
      },
      () => {
        // HACK: This is really strange, to pass in the entirety of the State of
        // this component to a change handler. We should really be more
        // selectively deciding what state should be synchronized to the parent
        // component.
        handleNotesChange(this.state);
      }
    );
  }

  addNote() {
    const { existingNotes, uuid } = this.state;
    const newUUID = uuid - 1;
    existingNotes.push({
      key: newUUID,
    });
    this.setState({ existingNotes, uuid: newUUID });
  }

  removeNote(index: number) {
    const { handleNotesChange } = this.props;
    const { existingNotes, notes } = this.state;
    const currentNote = existingNotes[index];
    currentNote.isRemoved = true;
    const { key } = currentNote;
    // HACK: This is really bad, and we shouldn't be directly mutating the state
    // like this. Instead we should create a copy of the state variables we want
    // to mutate and use `setState()` to update them.
    // If we haven't created the note in our DB yet
    // just remove it from the object locally
    if (key < 0) {
      delete notes[key];
    } else {
      notes[key] = { isRemoved: true };
    }

    this.setState(
      {
        notes,
        existingNotes,
      },
      () => {
        handleNotesChange(this.state);
      }
    );
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
        <label htmlFor="add-note">Notes</label>
        <p>
          <a
            href="https://github.github.com/gfm/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Markdown
          </a>{" "}
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
          <i className="material-icons">add_box</i> Add Note
        </button>
      </li>
    );
  }
}

export default EditNotes;
