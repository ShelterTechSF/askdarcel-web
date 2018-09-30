import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Hours from './Hours';

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


function buildLocation(address) {
  let line1 = '';
  let line2 = '';

  if (address) {
    if (address.address_1) {
      line1 += address.address_1;
    }

    if (address.address_2) {
      line1 += `, ${address.address_2}`;
    }

    if (address.city) {
      line2 += address.city;
    }

    if (address.state_province) {
      line2 += `, ${address.state_province}`;
    }

    if (address.postal_code) {
      line2 += `, ${address.postal_code}`;
    }
  }

  return (
    <span>
      {line1}<br />{line2}
    </span>
  );
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


function TodaysHours(props) {
  return (
    <Hours schedule={props.schedule_days} />
  );
}

TodaysHours.propTypes = {
  schedule_days: PropTypes.arrayOf(PropTypes.shape({
    closes_at: PropTypes.number.isRequired,
    day: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    opens_at: PropTypes.number.isRequired,
  })),
};

TodaysHours.defaultProps = {
  schedule_days: null,
};


function buildPhoneNumber(phones) {
  if (!phones) {
    return null;
  }

  return phones.map(phone =>
    <p key={phone.id}>{phone.number} {phone.service_type}</p>,
  );
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
    // Ignore undefined CONFIG because it gets injected by extended-define-webpack-plugin
    /* eslint-disable no-undef */
    if (CONFIG.GOOGLE_API_KEY) {
      url += `&key=${CONFIG.GOOGLE_API_KEY}`;
    }
    /* eslint-enable no-undef */
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
  TodaysHours,
  PhoneNumber,
  ResourceCategories,
  Website,
  Email,
  StreetView,
};
