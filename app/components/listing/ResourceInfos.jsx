import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import config from '../../config';
import { RelativeOpeningTime } from './RelativeOpeningTime';

function Cat(props) {
  return <p>{props.category}</p>;
}

Cat.propTypes = {
  category: PropTypes.string.isRequired,
};


function ResourceCategories(props) {
  if (props.categories.length) {
    const categories = _.uniqBy(props.categories, 'id');
    const cats = categories.map(cat => <Cat category={cat.name} key={cat.id} />);
    return <span className="categories">{cats}</span>;
  }
  return null;
}

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
function buildLocation(address) {
  if (!address) return;

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
  });
}

function AddressInfo(props) {
  return (
    <span className="address">
      {buildLocation(props.address)}
    </span>
  );
}

const AddressType = PropTypes.shape({
  address_1: PropTypes.string,
  address_2: PropTypes.string,
  city: PropTypes.string,
  state: PropTypes.string,
  postal_code: PropTypes.string,
});

AddressInfo.propTypes = {
  address: AddressType,
};

AddressInfo.defaultProps = {
  address: null,
};

function buildPhoneNumber(phones) {
  if (!phones) {
    return null;
  }

  return phones.map(phone => (
    <p key={phone.id}>
      {phone.number}
      {' '}
      {phone.service_type}
    </p>
  ));
}

function PhoneNumber(props) {
  return (
    <span className="phone">
      {buildPhoneNumber(props.phones)}
    </span>
  );
}

PhoneNumber.propTypes = {
  phones: PropTypes.arrayOf(PropTypes.shape({
    country_code: PropTypes.string,
    extension: PropTypes.string,
    id: PropTypes.number.isRequired,
    number: PropTypes.string.isRequired,
    service_type: PropTypes.string,
  })).isRequired,
};


function ExternalLink(props) {
  return <a href={props.to} target="_blank" rel="noopener noreferrer">{props.children}</a>;
}

ExternalLink.propTypes = {
  to: PropTypes.string.isRequired,
};


function Website(props) {
  if (!props.website) {
    return null;
  }
  return (
    <span className="website">
      <ExternalLink to={props.website}>{props.website}</ExternalLink>
    </span>
  );
}

Website.propTypes = {
  website: PropTypes.string,
};

Website.defaultProps = {
  website: null,
};


function Email(props) {
  if (!props.email) {
    return null;
  }
  return (
    <span className="email">
      <ExternalLink to={`mailto:${props.email}`}>{props.email}</ExternalLink>
    </span>
  );
}

Email.propTypes = {
  email: PropTypes.string,
};

Email.defaultProps = {
  email: null,
};


function buildImgURL(address) {
  if (address) {
    let url = `https://maps.googleapis.com/maps/api/streetview?size=400x400&location=${address.latitude},${address.longitude}&fov=90&heading=235&pitch=10`;
    if (config.GOOGLE_API_KEY) {
      url += `&key=${config.GOOGLE_API_KEY}`;
    }
    return url;
  }
  return 'http://lorempixel.com/200/200/city/';
}

function StreetView(props) {
  if (!props.address) {
    return null;
  }
  return (
    <div className="org-streetview">
      <img
        className="org-streetview--img"
        src={buildImgURL(props.address)}
        alt={`Street view of ${props.resourceName}`}
      />
    </div>
  );
}

StreetView.propTypes = {
  address: AddressType,
  resourceName: PropTypes.string.isRequired,
};

StreetView.defaultProps = {
  address: null,
};

export {
  Cat,
  AddressInfo,
  PhoneNumber,
  ResourceCategories,
  Website,
  Email,
  StreetView,
};
