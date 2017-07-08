import React from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router'
import { images } from '../../assets';
import Loader from '../Loader';
import EditAddress from './EditAddress';
import EditServices from './EditServices';
import EditNotes from './EditNotes';
import EditSchedule from './EditSchedule';
import EditPhones from './EditPhones';
import * as dataService from '../../utils/DataService';
import { withRouter } from 'react-router';
import { daysOfTheWeek } from '../../utils/index';
import _ from 'lodash';

class EditSections extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            scheduleObj: {},
            schedule_days: {},
            resourceFields: {},
            serviceFields: {},
            addressFields: {},
            services: {},
            notes: {},
            phones: [],
            submitting: false
        };

        this.handleResourceFieldChange = this.handleResourceFieldChange.bind(this);
        this.handleScheduleChange = this.handleScheduleChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.handleServiceChange = this.handleServiceChange.bind(this);
        this.handleNotesChange = this.handleNotesChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.postServices = this.postServices.bind(this);
        this.postObject = this.postObject.bind(this);
        this.postNotes = this.postNotes.bind(this);
        this.postSchedule = this.postSchedule.bind(this);
    }

    hasKeys(object) {
        let size = 0;
        for(let key in object) {
            if(object.hasOwnProperty(key)) {
                return true;
            }
        }

        return false;
    }

    componentDidMount() {
        let { query } = this.props.location;
	    let resourceID = query.resourceid;
	    let url = '/api/resources/' + resourceID;
	    fetch(url).then(r => r.json())
	    .then(data => {
            data.resource.services[0].inherit_schedule = true;
	      	this.setState({
                  resource: data.resource,
                  originalResource: data.resource
            });

            let scheduleMap = {};
            data.resource.schedule.schedule_days.forEach(function(day) {
                scheduleMap[day.day] = day;
            });
            this.setState({scheduleMap: scheduleMap});
	    });
    }

    handleSubmit() {
        this.setState({submitting: true});
        let resource = this.state.resource;
        let promises = [];

        //Resource
        let resourceChangeRequest = {};
        let resourceModified = false;
        if(this.state.name && this.state.name !== resource.name) {
            resourceChangeRequest.name = this.state.name;
            resourceModified = true;
        }
        if(this.state.long_description && this.state.long_description !== resource.long_description) {
            resourceChangeRequest.long_description = this.state.long_description;
            resourceModified = true;
        }
        if(this.state.short_description && this.state.short_description !== resource.short_description) {
            resourceChangeRequest.short_description = this.state.short_description;
            resourceModified = true;
        }
        if(this.state.website && this.state.website !== resource.website) {
            resourceChangeRequest.website = this.state.website;
            resourceModified = true;
        }
        if(this.state.name && this.state.name !== resource.name) {
            resourceChangeRequest.name = this.state.name;
            resourceModified = true;
        }
        if(this.state.email && this.state.email !== resource.email) {
            resourceChangeRequest.email = this.state.email;
            resourceModified = true;
        }
        //fire off resource request
        if(resourceModified) {
            promises.push(dataService.post('/api/resources/' + resource.id + '/change_requests', {change_request: resourceChangeRequest}));
        }

        //Fire off phone requests
        this.postCollection(this.state.phones, this.state.resource.phones, 'phones', promises);

        //schedule
        this.postObject(this.state.scheduleObj, 'schedule_days', promises);

        //address
        if(this.hasKeys(this.state.address) && this.state.resource.address) {
            promises.push(dataService.post('/api/addresses/' + this.state.resource.address.id + '/change_requests', {
                change_request: this.state.address
            }));
        }

        //Services
        this.postServices(this.state.services.services, promises);

        //Notes
        this.postNotes(this.state.notes, promises, {path: "resources", id: this.state.resource.id});

        var that = this;
        Promise.all(promises).then(function(resp) {
            that.props.router.push({ pathname: "/resource", query: { id: that.state.resource.id } });
        }).catch(function(err) {
            console.log(err);
        });

    }

    postCollection(collection, originalCollection, path, promises) {
        for(let i = 0; i < collection.length; i++) {
            let item = collection[i];

            if(i < originalCollection.length && item.dirty) {
                let diffObj = this.getDiffObject(item, originalCollection[i]);
                if(diffObj.numKeys > 0) {
                    delete diffObj.obj.dirty;
                    this.updateCollectionObject(diffObj.obj, item.id, path, promises);
                }
            } else if(item.dirty) {
                //post a new object
            }
        }
    }

    getDiffObject(curr, orig) {
        let diffObj = {
            obj: {},
            numKeys: 0
        };

        for(let key in curr) {
            if(!_.isEqual(curr[key], orig[key])) {
                diffObj.obj[key] = curr[key];
                diffObj.numKeys++;
            }
        }

        return diffObj;
    }

    updateCollectionObject(object, id, path, promises) {
        promises.push(
            dataService.post(
                '/api/' + path + '/' + id + '/change_requests', 
                {change_request: object}
            )
        );
    }

    postObject(object, path, promises) {
        for(let key in object) {
            if(object.hasOwnProperty(key)) {
                promises.push(dataService.post('/api/' + path + '/' + key + '/change_requests', {change_request: object[key]}));
            }
        }
    }

    postServices(servicesObj, promises) {
        let newServices = [];
        for(let key in servicesObj) {
            if(servicesObj.hasOwnProperty(key)) {
                let currentService = servicesObj[key];

                if(key < 0) {
                    if(currentService.notesObj) {
                        let notes = this.objToArray(currentService.notesObj.notes);
                        delete currentService.notesObj;
                        currentService.notes = notes;
                    }

                    if(!currentService.inherit_schedule) {
                        currentService.schedule = this.createFullSchedule(currentService.scheduleObj);
                    }
                    delete currentService.scheduleObj;

                    if(!isEmpty(currentService)) {
                        newServices.push(currentService);
                    }
                } else {
                    let uri = '/api/services/' + key + '/change_requests';
                    this.postNotes(currentService.notesObj, promises, {path: "services", id: key});
                    delete currentService.notesObj;

                    if(!currentService.inherit_schedule) {
                        this.postSchedule(currentService.scheduleObj, promises);
                    }
                    delete currentService.scheduleObj;

                    if(!isEmpty(currentService)) {
                        promises.push(dataService.post(uri, {change_request: currentService}));
                    }

                }
            }
        }

        if(newServices.length > 0) {
            let uri = '/api/resources/' + this.state.resource.id + '/services';
            promises.push(dataService.post(uri, {services: newServices}));
        }
    }

    createFullSchedule(scheduleObj) {
        let daysTemplate = {};
        for(let i = 0; i < daysOfTheWeek().length; i++) {
            let day = daysOfTheWeek()[i];
            daysTemplate[day] = {
                day: day,
                opens_at: null,
                closes_at: null
            }
        }

        if(scheduleObj) {
            for(let key in scheduleObj) {
                if(scheduleObj.hasOwnProperty(key)) {
                    let scheduleDay = scheduleObj[key];
                    for(let dayKey in scheduleDay) {
                        daysTemplate[scheduleDay.day][dayKey] = scheduleDay[dayKey];
                    }
                }
            }
        }

        let scheduleDays = [];
        for(let day in daysTemplate) {
            if(daysTemplate.hasOwnProperty(day)) {
                scheduleDays.push(daysTemplate[day]);
            }
        }

        return {schedule_days: scheduleDays};
    }

    objToArray(obj) {
        let arr = [];
        for(let key in obj) {
            if(obj.hasOwnProperty(key)) {
                arr.push(obj[key]);
            }
        }

        return arr;
    }

    postSchedule(scheduleObj, promises, uriObj) {
        if(scheduleObj) {
            if(scheduleObj.inheritSchedule) {
                //Post schedule with flag set
            } else {
                this.postObject(scheduleObj, 'schedule_days', promises);
            }
        }
    }

    postNotes(notesObj, promises, uriObj) {
        if(notesObj) {
            let notes = notesObj.notes;
            let newNotes = [];
            for(let key in notes) {
                if(notes.hasOwnProperty(key)) {
                    let currentNote = notes[key];
                    if(key < 0) {
                        let uri = '/api/' + uriObj.path + '/' + uriObj.id + '/notes';
                        promises.push(dataService.post(uri, {note: currentNote}));
                    } else {
                        let uri = '/api/notes/' + key + '/change_requests';
                        promises.push(dataService.post(uri, {change_request: currentNote}));
                    }
                }
            }
        }
    }

    handlePhoneChange(phoneCollection) {
        this.setState({phones: phoneCollection});
    }

    handleResourceFieldChange(e) {
        let field = e.target.dataset.field;
        let value = e.target.value;
        let object = {};
        object[field] = value;
        this.setState(object);
	}

    handleScheduleChange(scheduleObj) {
        this.setState({scheduleObj: scheduleObj});
    }

    handleAddressChange(addressObj) {
        this.setState({address: addressObj});
    }

    handleServiceChange(servicesObj) {
        this.setState({services: servicesObj});
    }

    handleNotesChange(notesObj) {
        this.setState({notes: notesObj});
    }

    handleServiceNotesChange(notesObj) {
        this.setState({serviceNotes: notesObj});
    }

    formatTime(time) {
        //FIXME: Use full times once db holds such values.
        return time.substring(0, 2);
    }

    renderSectionFields() {
        let fields = [];
        let resource = this.state.resource;
        return (
        <section id="info" className="edit--section">
        	<header className="edit--section--header">
        		<h4>Info</h4>
        	</header>
          <ul className="edit--section--list">

            <li key="name" className="edit--section--list--item">
                <label>Name</label>
                <input type="text" placeholder="Name" data-field='name' defaultValue={resource.name} onChange={this.handleResourceFieldChange} />
            </li>

            <EditAddress address={this.state.resource.address} updateAddress={this.handleAddressChange}/>

            <EditPhones collection={this.state.resource.phones} handleChange={this.handlePhoneChange} />

            <li key="website" className="edit--section--list--item email">
                <label>Website</label>
                <input type="url" defaultValue={resource.website} data-field='website' onChange={this.handleResourceFieldChange}/>
            </li>

            <li key="email" className="edit--section--list--item email">
                <label>E-Mail</label>
                <input type="url" defaultValue={resource.email} data-field='email' onChange={this.handleResourceFieldChange}/>
            </li>

            <li key="long_description" className="edit--section--list--item">
                <label>Description</label>
                <textarea className="" defaultValue={resource.long_description} data-field='long_description' onChange={this.handleResourceFieldChange} />
            </li>

            <EditSchedule schedule={this.state.resource.schedule} handleScheduleChange={this.handleScheduleChange} />

            <EditNotes notes={this.state.resource.notes} handleNotesChange={this.handleNotesChange} />

          </ul>
        </section>
        );
    }

    renderServices() {
    	let fields = [];
      let resource = this.state.resource;
    	return (
    		<section id="services" className="edit--section">
    			<header className="edit--section--header">
    				<h4>Services</h4>
    			</header>
    			<ul className="edit--section--list">
    				<EditServices services={this.state.resource.services} handleServiceChange={this.handleServiceChange} />
    			</ul>
    		</section>
    	)
    }

    render() {
      return (
        !this.state.resource ? <Loader /> :
        <div className="edit">
        	<div className="edit--main">
            <header className="edit--main--header">
              <h1 className="edit--main--header--title">{this.state.resource.name}</h1>
            </header>
            <div className="edit--sections">
	            {this.renderSectionFields()}
	            {this.renderServices()}
            </div>
          </div>
          <div className="edit--aside">
          	<div className="edit--aside--content">
	          	<button className="edit--aside--content--submit" disabled={this.state.submitting} onClick={this.handleSubmit}>Save changes</button>
	          	<nav className="edit--aside--content--nav">
	          		<ul>
	          			<li><a href="#info">Info</a></li>
	          			<li><a href="#services">Services</a></li>
	          		</ul>
	          	</nav>
	          </div>
          </div>
        </div>
      )
    }
}

function isEmpty(map) {
   for(var key in map) {
      return !map.hasOwnProperty(key);
   }
   return true;
}

export default withRouter(EditSections);
