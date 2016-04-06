import React from 'react';
import styles from './Resource.scss';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
let MdPlace =  require('react-icons/lib/md/place');
let MdAccessTime = require('react-icons/lib/md/access-time');
let MdLocalPhone = require('react-icons/lib/md/local-phone');
let MdTranslate = require('react-icons/lib/md/translate');
let MdPublic = require('react-icons/lib/md/public');

class ResourceAddressInfo extends React.Component {
	render() {
		return (
			<div className={styles.wrapper}>
				<MdPlace className={styles.icon}/>
				{buildLocation(this.props.addresses)}
			</div>
		);
	}
}
const AddressInfo = withStyles(ResourceAddressInfo, styles);

class ResourceBusinessHours extends React.Component {
	render() {
		return (
			<div className={styles.wrapper}>
				<MdAccessTime className={styles.icon} />
				{buildHoursText(this.props.schedule_days)}
			</div>
		);
	}
}
const BusinessHours = withStyles(ResourceBusinessHours, styles);

class ResourcePhoneNumber extends React.Component {
	render() {
		return (
			<div className={styles.wrapper}>
				<MdLocalPhone className={styles.icon} />
				{buildPhoneNumber(this.props.phones)}
			</div>
		);
	}
}
const PhoneNumber = withStyles(ResourcePhoneNumber, styles);

class ResourceLanguages extends React.Component {
	render() {
		return (
			<div className={styles.wrapper}>
				<MdTranslate className={styles.icon} />
				<p>English, Spanish</p>
			</div>
		); 
	}
}
const Languages = withStyles(ResourceLanguages, styles);

class ResourceWebsite extends React.Component {
	render() {
		return (
			<div className={styles.wrapper}>
				<MdPublic className={styles.icon} />
				<p>{this.props.website}</p>
			</div>
		); 
	}
}
const Website = withStyles(ResourceWebsite, styles);

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

function buildLocation(addresses) {
	let line1 = "";
	let line2 = "";

	if(addresses && addresses.length && addresses.length > 0) {
		let address = addresses[0];

		if(address.address_1) {
			line1 += address.address_1;
		}

		if(address.address_1) {
			line1 += ", " + address.address_2;
		}

		if(address.city) {
			line1 += ", " + address.city;
		}

		if(address.state_province) {
			line1 += ", " + address.state_province;
		}

		if(address.postal_code) {
			line1 += ", " + address.postal_code;
		}
	}

	return (
		<p>
		{line1}
		</p>
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


export {AddressInfo, BusinessHours, PhoneNumber, Website, Languages};