import React from 'react';
import ReactMarkdown from 'react-markdown';
import { uniqBy } from 'lodash';
import { CategoryModel, NoteModel } from '../../models';
import { ListingSection } from './Layout';

export const Category = ({ category }: { category: string }) => <p>{category}</p>;

export const Categories = ({ categories }: { categories: CategoryModel[] }) => {
  const uniqueCategories = uniqBy(categories, 'id');
  return (
    <span className="categories">
      {uniqueCategories.map(cat => <Category key={cat.id} category={cat.name} />)}
    </span>
  );
};

export const NotesSection = ({ notes }: { notes: NoteModel[] }) => (
  <ListingSection title="Notes" id="notes">
    <ul className="service--section--list">
      { notes.map(noteObj => (
        <li key={noteObj.id} className="service">
          <div className="service--description">
            <ReactMarkdown className="rendered-markdown" source={noteObj.note} />
          </div>
        </li>
      )) }
    </ul>
  </ListingSection>
);
