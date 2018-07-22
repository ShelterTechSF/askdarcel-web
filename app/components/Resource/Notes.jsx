import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function Notes(props) {
    return (
        <section className="service--section" id="services">
            <header className="service--section--header">
                <h4>Notes</h4>
            </header>
            <ul className="service--section--list">
                {renderNotes(props.notes)}
            </ul>
        </section>
    );
}

function renderNotes(notes) {
    return notes.map((noteObj) => {
        return (
            <li className="service">
                <div className="service--description"><ReactMarkdown source={noteObj.note} /></div>
            </li>    
        );
    });
}