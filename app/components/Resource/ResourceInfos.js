import React, { Component } from 'react';
import classNames from 'classnames/bind';

class Cat extends Component {
  render() {
    return <span className="org-category">{this.props.category}</span>;
  }
}

class ResourceCategories extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if(this.props.categories.length) {
      let categoryMap = {};
      this.props.categories.forEach(category => {
        categoryMap[category.name] = true;
      });

      let cats = Object.keys(categoryMap).map((cat, i) =>{
        return <Cat category={cat} key={i} />
      });
      return <div>{cats}</div>;
    } else {
      return null;
    }
  }
}

class AddressInfo extends Component {
  render() {
    return (
      <li className="address">
        <i className="material-icons">place</i>
        <div className="address-block">
          {buildLocation(this.props.address)}
        </div>
      </li>
    );
  }
}

class BusinessHours extends Component {
  render() {
    return (
      <li className="hours">
        <i className="material-icons">schedule</i>
          <div className="current-hours">
            {buildHoursText(this.props.schedule_days)}
          </div>
      </li>
    );
  }
}

class PhoneNumber extends Component {
  render() {
    return (
      <li className="phone">
        <i className="material-icons">call</i>
        {buildPhoneNumber(this.props.phones)}
      </li>
    );
  }
}

class Languages extends Component {
  render() {
    return (
      <li className="lang">
        <i className="material-icons">translate</i>
        <p>English, Spanish</p>
      </li>
    );
  }
}

class Website extends Component {
  render() {
    return (
      <li className="website">
        <i className="material-icons">public</i>
        <p><a href={this.props.website} target="_blank">{this.props.website}</a></p>
      </li>
    );
  }
}

class StreetView extends Component {
  render() {
    return (
      <div className="org-streetview">
        <img className="org-img" src={buildImgURL(this.props.address)} />
      </div>
    );
  }
}

function buildHoursText(schedule_days) {
  if(!schedule_days) {
    return;
  }

  let hours = "";
  let styles = {
    cell: true
  };
  const currentDate = new Date();
  const currentHour = currentDate.getHours();

  const days = schedule_days.filter(schedule_day => {
    return (schedule_day && schedule_day.day == daysOfTheWeek()[currentDate.getDay()] &&
        currentHour > schedule_day.opens_at && currentHour < schedule_day.closes_at);
  });

  if(days.length && days.length > 0) {
    for(let i = 0; i < days.length; i++) {
      let day = days[i];
      hours = "Open Now: " + timeToString(day.opens_at) + "-" + timeToString(day.closes_at);
      if(i != days.length - 1) {
        hours += ", ";
      }
    }
  } else {
    hours = "Closed Now";
    styles.closed = true;
  }

  return (
    <p>{hours}</p>
  );
}

function buildLocation(address) {
  let line1 = "";
  let line2 = "";

  if(address) {
    if(address.address_1) {
      line1 += address.address_1;
    }

    if(address.address_2) {
      line1 += ", " + address.address_2;
    }

    if(address.city) {
      line2 += address.city;
    }

    if(address.state_province) {
      line2 += ", " + address.state_province;
    }

    if(address.postal_code) {
      line2 += ", " + address.postal_code;
    }
  }

  return (
    <span>
    {line1}<br />{line2}
    </span>
  );
}

function buildPhoneNumber(phones) {
  if(!phones) {
    return;
  }

  let phone = {};

  if(phones.length && phones.length > 0) {
    phone = phones[0];
  }

  return (
    <p>{phone.number}</p>
  );
}

function buildImgURL(address) {
  if(address) {
     let url = "https://maps.googleapis.com/maps/api/streetview?size=400x400&location=" +
      address.latitude + "," + address.longitude +
      "&fov=90&heading=235&pitch=10";
      if(CONFIG.GOOGLE_API_KEY) {
        url += '&key=' + CONFIG.GOOGLE_API_KEY;
      }
      return url;
  } else {
    return "http://lorempixel.com/200/200/city/";
  }
}

function daysOfTheWeek() {
  return [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
}


export {AddressInfo, BusinessHours, PhoneNumber, ResourceCategories, Website, Languages, StreetView};
