import React, {
  useState,
  useEffect,
} from "react";
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
  handleNotesChange: (
    notesObject: Record<number, InternalNoteChanges>
  ) => void;
}

export type NotesObject = Record<number, InternalNoteChanges>;

const EditNotes = ({ notes = [], handleNotesChange }: Props) => {
  const internalNotes = notes.map((note) => {
    const newNote: InternalNote = {
      ...note,
      key: note.id,
    };

    return newNote;
  });

  const [notesList, setNotesList] = useState(internalNotes);
  const [uuid, setUuid] = useState(-1);
  const [notesObject, setNotesObject] = useState<
    Record<number, InternalNoteChanges>
  >({});

  useEffect(() => {
    handleNotesChange(notesObject);
  }, [notesObject, handleNotesChange]);

  const handleNoteChange = (key: number, note: InternalNoteChanges): void => {
    setNotesObject({
      ...notesObject,
      [key]: note,
    });
  };

  const addNote = () => {
    setUuid(uuid - 1);
    setNotesList([...notesList, { key: uuid }]);
  };

  const removeNote = (index: number) => {
    const targetNote = notesList[index];
    const { key } = targetNote;
    const newNotes = [...notesList];
    const newNotesObject = { ...notesObject };

    if (key < 0) {
      delete newNotesObject[key];
    } else {
      newNotesObject[key] = { isRemoved: true };
    }

    newNotes.splice(index, 1);
    setNotesList(newNotes);
    setNotesObject(newNotesObject);
  };

  const renderNotes = () =>
    notesList.map((note, i) => (
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
        <i className="material-icons">add_box</i> Add Note
      </button>
    </li>
  );
};

export default EditNotes;
