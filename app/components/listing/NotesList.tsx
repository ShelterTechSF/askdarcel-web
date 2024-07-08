import React from "react";
import ReactMarkdown from "react-markdown";
import { Note } from "../../models";

export const NotesList = ({ notes }: { notes: Note[] }) => (
  <ul className="service--section--list">
    {notes.map((noteObj) => (
      <li key={noteObj.id} className="service">
        <div className="service--description">
          <ReactMarkdown className="rendered-markdown" source={noteObj.note} />
        </div>
      </li>
    ))}
  </ul>
);
