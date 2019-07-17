import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const Category = ({ category }) => <p>{category}</p>;

Category.propTypes = {
  category: PropTypes.string.isRequired,
};


const ResourceCategories = ({ categories }) => {
  const uniqueCategories = _.uniqBy(categories, 'id');
  return (
    <span className="categories">
      {uniqueCategories.map(cat => <Category key={cat.id} category={cat.name} />)}
    </span>
  );
};

ResourceCategories.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
};


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
const buildLocation = address => {
  const fieldsOnEachLine = [
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

const AddressInfo = ({ address }) => (
  <span className="address">
    {buildLocation(address)}
  </span>
);

const AddressType = PropTypes.shape({
  address_1: PropTypes.string,
  address_2: PropTypes.string,
  city: PropTypes.string,
  state: PropTypes.string,
  postal_code: PropTypes.string,
});

AddressInfo.propTypes = {
  address: AddressType.isRequired,
};

const PhoneNumber = ({ phones }) => (
  <span className="phone">
    { phones.map(phone => <p key={phone.id}>{`${phone.number} ${phone.service_type}`}</p>) }
  </span>
);

PhoneNumber.propTypes = {
  phones: PropTypes.arrayOf(PropTypes.shape({
    country_code: PropTypes.string,
    extension: PropTypes.string,
    id: PropTypes.number.isRequired,
    number: PropTypes.string.isRequired,
    service_type: PropTypes.string,
  })).isRequired,
};


const ExternalLink = ({ children, to }) => (
  <a href={to} target="_blank" rel="noopener noreferrer">{children}</a>
);

ExternalLink.propTypes = {
  to: PropTypes.string.isRequired,
};


const Website = ({ website }) => (
  <span className="website">
    <ExternalLink to={website}>{website}</ExternalLink>
  </span>
);

Website.propTypes = {
  website: PropTypes.string.isRequired,
};


const Email = ({ email }) => (
  <span className="email">
    <ExternalLink to={`mailto:${email}`}>{email}</ExternalLink>
  </span>
);

Email.propTypes = {
  email: PropTypes.string.isRequired,
};

export {
  ResourceCategories,
  AddressInfo,
  PhoneNumber,
  Website,
  Email,
};
