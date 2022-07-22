import React, { Fragment } from 'react';
import _ from 'lodash';
import { Address, Category, PhoneNumber } from '../../models';

function CategoryRenderer({ category }: { category: string }) {
  return <p>{category}</p>;
}

export function ResourceCategories({ categories }: { categories: Category[] }) {
  const uniqueCategories = _.uniqBy(categories, 'id');
  return categories?.length ? (
    <span className="categories">
      {uniqueCategories.map(cat => <CategoryRenderer key={cat.id} category={cat.name} />)}
    </span>
  ) : null;
}

// Given an address object, returns a React DOM element that displays the
// address on up to three lines:
//
//   <name>
//   <address_1>, <address_2>
//   <city>, <state_province>, <postal_code>
//
// Example 1:
//
//   123 Fourth Street
//   San Francisco, CA, 94115
//
// Example 2:
//
//   SF Headquarters
//   567 Eighth Street, Suite 201
//   San Francisco, CA, 94115
//
const buildLocation = (address: Address) => {
  const fieldsOnEachLine: (keyof Address)[][] = [
    ['name'],
    ['address_1', 'address_2'],
    ['city', 'state_province', 'postal_code'],
  ];

  return fieldsOnEachLine.map(fields => {
    const line = fields.map(field => address[field])
      .filter(Boolean)
      .join(', ');
    if (line.length > 0) {
      const key = fields.join('-');

      return (
        <Fragment key={key}>
          <span>{line}</span>
          <br />
        </Fragment>
      );
    }
    return null;
  });
};

export function AddressInfoRenderer({ address }: { address: Address }) {
  return (
    <span className="address">
      {buildLocation(address)}
    </span>
  );
}

export function PhoneNumberRenderer({ phones }: { phones: PhoneNumber[] }) {
  return (
    <span className="phone">
      { phones.map(phone => (
        <p key={phone.id}>
          <a href={`tel:${phone.number}`}>{phone.number}</a>
          {` ${phone.service_type}`}
        </p>
      )) }
    </span>
  );
}

function ExternalLink({ children, to }: { children: any; to: string }) {
  return <a href={to} target="_blank" rel="noopener noreferrer">{children}</a>;
}

export function WebsiteRenderer({ website }: { website: string }) {
  return (
    <span className="website">
      <ExternalLink to={website}>{website}</ExternalLink>
    </span>
  );
}

export function EmailRenderer({ email }: { email: string }) {
  return (
    <span className="email">
      <ExternalLink to={`mailto:${email}`}>{email}</ExternalLink>
    </span>
  );
}
