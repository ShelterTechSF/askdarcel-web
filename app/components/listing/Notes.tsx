import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Note } from '../../models';

function NotesList({ notes }: { notes: Note[] }) {
  return (
    <ul className="service--section--list">
      {
      notes.map(noteObj => (
        <li key={noteObj.id} className="service">
          <div className="service--description">
            <ReactMarkdown className="rendered-markdown" source={noteObj.note} />
          </div>
        </li>
      ))
    }
    </ul>
  );
}

export function Notes({ id, notes }: { id?: string; notes: Note[] }) {
  return (
    <section
      className="service--section"
      id={id}
      data-cy="notes-section"
    >
      <header className="service--section--header">
        <h4>Notes</h4>
      </header>
      <NotesList notes={notes} />
    </section>
  );
}
