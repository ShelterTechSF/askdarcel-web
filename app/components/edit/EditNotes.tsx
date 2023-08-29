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

interface Props {
  existingNotes: Note[] | undefined;
  handleNotesChange: (
    notesDictionary: Record<number, InternalNoteChanges>
  ) => void;
}

export type State = {
  notes: Record<number, InternalNoteChanges>;
  existingNotes: InternalNote[];
  uuid: number;
};

const EditNotes = ({ existingNotes, handleNotesChange }: Props) => {
  const internalNotes = existingNotes
    ? existingNotes.map((note) => {
        const newNote: InternalNote = {
          ...note,
          key: note.id,
        };

        return newNote;
      })
    : [];

  const [notes, setNotes] = useState(internalNotes);
  const [uuid, setUuid] = useState(-1);
  const [notesDictionary, setNotesDictionary] = useState<
    Record<number, InternalNoteChanges>
  >({});

  useEffect(() => {
    handleNotesChange(notesDictionary);
  }, [notesDictionary, handleNotesChange]);

  const handleNoteChange = (key: number, note: InternalNoteChanges): void => {
    setNotesDictionary({
      ...notesDictionary,
      [key]: note,
    });
  };

  const addNote = () => {
    setUuid(uuid - 1);

    setNotes([...notes, { key: uuid }]);
  };

  const removeNote = (index: number) => {
    const targetNote = notes[index];
    const { key } = targetNote;
    const newNotes = [...notes];
    const newNotesDictionary = { ...notesDictionary };

    if (key < 0) {
      delete newNotesDictionary[key];
    } else {
      newNotesDictionary[key] = { isRemoved: true };
    }

    newNotes.splice(index, 1);
    setNotes(newNotes);
    setNotesDictionary(newNotesDictionary);
  };

  const renderNotes = () =>
    notes.map((note, i) => (
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
