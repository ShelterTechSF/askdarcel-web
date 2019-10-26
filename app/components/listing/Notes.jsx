import React from 'react';
import ReactMarkdown from 'react-markdown';

const NotesList = ({ notes }) => (
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

const Notes = ({ id, notes }) => (
  <section
    className="service--section"
    id={id}
  >
    <header className="service--section--header">
      <h4>Notes</h4>
    </header>
    <NotesList notes={notes} />
  </section>
);

Notes.defaultProps = {
  id: null,
};

export default Notes;
