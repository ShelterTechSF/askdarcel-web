import React, { useState, useEffect } from "react";
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

export type NewNotes = Record<number, InternalNoteChanges>;

type Props = {
  notes: Note[] | undefined;
  handleNotesChange: (newNotes: NewNotes) => void;
};

const EditNotes = ({ notes = [], handleNotesChange }: Props) => {
  const internalNotes = notes.map((note) => {
    const newNote: InternalNote = {
      ...note,
      key: note.id,
    };

    return newNote;
  });

  const [existingNotes, setExistingNotes] = useState(internalNotes);
  const [uuid, setUuid] = useState(-1);
  const [newNotes, setNewNotes] = useState<NewNotes>({});

  useEffect(() => {
    handleNotesChange(newNotes);
  }, [newNotes, handleNotesChange]);

  const handleNoteChange = (key: number, note: InternalNoteChanges): void => {
    setNewNotes({
      ...newNotes,
      [key]: note,
    });
  };

  const addNote = () => {
    setUuid(uuid - 1);
    setExistingNotes([...existingNotes, { key: uuid }]);
  };

  const removeNote = (index: number) => {
    const targetNote = existingNotes[index];
    const { key } = targetNote;
    const updatedExistingNotes = [...existingNotes];
    const updatedNewNotes = { ...newNotes };

    if (key < 0) {
      delete updatedNewNotes[key];
    } else {
      updatedNewNotes[key] = { isRemoved: true };
    }

    updatedExistingNotes.splice(index, 1);
    setExistingNotes(updatedExistingNotes);
    setNewNotes(updatedNewNotes);
  };

  const renderNotes = () =>
    existingNotes.map((note, i) => (
      <EditNote
        key={note.key}
        index={i}
        note={note}
        handleChange={handleNoteChange}
        removeNote={removeNote}
      />
    ));

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
      <ul className="edit--section--list--item--sublist">{renderNotes()}</ul>
      <button
        type="button"
        className="edit--section--list--item--button"
        onClick={addNote}
      >
        <i className="material-symbols-outlined">add_box</i> Add Note
      </button>
    </li>
  );
};

export default EditNotes;
