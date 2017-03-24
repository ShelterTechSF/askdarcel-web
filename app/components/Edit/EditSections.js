import React from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router'
import { images } from '../../assets';
import Loader from '../Loader';
import EditAddress from './EditAddress';
import EditServices from './EditServices';
import EditNotes from './EditNotes';
import EditSchedule from './EditSchedule';
import * as dataService from '../../utils/DataService';
import { withRouter } from 'react-router';

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
        this.postNotes = this.postNotes.bind(this);
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
	      	this.setState({resource: data.resource});
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
        //fire off resource request
        if(resourceModified) {
            promises.push(dataService.post('/api/resources/' + resource.id + '/change_requests', {change_request: resourceChangeRequest}));
        }

        //Phone
        let phoneChangeRequests = {};
        if(this.state.phone) {
            for(let key in this.state.phone) {
                if(this.state.phone.hasOwnProperty(key) &&
                this.state.phone[key].number !== resource.phones[0].number) {
                    phoneChangeRequests[key] = {number: this.state.phone[key].number};
                }
            }
        }
        //Fire off phone requests
        this.postObject(phoneChangeRequests, 'phones', promises);

        //schedule
        this.postObject(this.state.schedule_days, 'schedule_days', promises);

        //address
        if(this.hasKeys(this.state.address) && this.state.resource.address) {
            promises.push(dataService.post('/api/addresses/' + this.state.resource.address.id + '/change_requests', {
                change_request: this.state.address
            }));
        }

        //Services
        this.postServices(this.state.services.services, promises);

        //Notes
        this.postNotes(this.state.notes.notes, promises);

        var that = this;
        Promise.all(promises).then(function(resp) {
            that.props.router.push({ pathname: "/resource", query: { id: that.state.resource.id } });
        }).catch(function(err) {
            console.log(err);
        });

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

                if(currentService.notesObj) {
                    this.postNotes(currentService.notesObj.notes, promises, {path: 'services', id: key});
                    delete currentService.notesObj;
                }

                if(!isEmpty(currentService)) {
                    if(key < 0) {
                        newServices.push(currentService);
                    } else {
                        let uri = '/api/services/' + key + '/change_requests';
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

    postNotes(notesObj, promises, uriObj) {
        let newNotes = [];
        for(let key in notesObj) {
            if(notesObj.hasOwnProperty(key)) {
                let currentNote = notesObj[key];
                if(key < 0) {
                    let uri = '/api/' + uriObj.path + '/' + uriObj.id + '/notes';
                    // promises.push(dataService.post(uri, {notes: }))
                    console.log(uri);
                } else {
                    let uri = '/api/notes/' + key + '/change_requests';
                    promises.push(dataService.post(uri, {change_request: currentNote}));
                }
            }
        }
    }

    handlePhoneChange(e) {
        if(this.state.resource.phones[0]) {
            this.setState({phone: {number: e.target.value}});
        }
    }

    handleResourceFieldChange(e) {
        let field = e.target.dataset.field;
        let value = e.target.value;
        let object = {};
        object[field] = value;
        this.setState(object);
	}

    handleScheduleChange(scheduleObj) {
        // let currScheduleMap = this.state.scheduleMap;
        // let field = e.target.dataset.field;
        // let day = e.target.dataset.key;
        // let value = e.target.value;
        // let serverDay = currScheduleMap[day];
        // let formattedTime = this.formatTime(value);
        //
        // if(formattedTime !== serverDay[field]) {
        //     let schedule_days = this.state.schedule_days;
        //     let newDay = schedule_days[serverDay.id] ? schedule_days[serverDay.id] : {};
        //     newDay[field] = value;
        //     schedule_days[serverDay.id] = newDay;
        //     this.setState({schedule_days: schedule_days});
        // }
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
            <ul className="edit-section-list">
                <label>Contact</label>
                <li key="name" className="edit-section-item">
                    <label>Name</label>
                    <input type="text" placeholder="Name" data-field='name' defaultValue={resource.name} onChange={this.handleResourceFieldChange} />
                </li>
                <li key="tel" className="edit-section-item tel">
                    <label>Telephone</label>
                    <input type="tel" placeholder="Phone number" data-id={resource.phones[0] && resource.phones[0].id} defaultValue={resource.phones[0] && resource.phones[0].number} onChange={this.handlePhoneChange} />
                </li>
                <li key="website" className="edit-section-item email">
                    <label>Website</label>
                    <input type="url" defaultValue={resource.website} data-field='website' onChange={this.handleResourceFieldChange}/>
                </li>
                <label>Description</label>
                <li key="long_description" className="edit-section-item">
                    <label>Long Description</label>
                    <textarea defaultValue={resource.long_description} data-field='long_description' onChange={this.handleResourceFieldChange} />
                </li>
                <li key="short_description" className="edit-section-item">
                    <label>Short Description</label>
                    <textarea defaultValue={resource.short_description} data-field='short_description' onChange={this.handleResourceFieldChange} />
                </li>
                <label>Address</label>
                <EditAddress address={this.state.resource.address} updateAddress={this.handleAddressChange}/>

                <EditNotes notes={this.state.resource.notes} handleNotesChange={this.handleNotesChange} />

                <EditServices services={this.state.resource.services} handleServiceChange={this.handleServiceChange} />

                <label>Hours</label>
                <EditSchedule schedule={this.state.resource.schedule} handleScheduleChange={this.handleScheduleChange} />
            </ul>
        );
    }

    render() {
        return (
            !this.state.resource || !this.state.scheduleMap? <Loader /> :
            <div className="edit-page">
                <header className="edit-header">
                    <a className="back-btn"></a>
                    <h1 className="edit-title">{this.state.resource.name}</h1>
                    <button className="edit-submit-btn" disabled={this.state.submitting} onClick={this.handleSubmit}>Save</button>
                </header>
                <ul className="edit-sections">
                <section className="edit-section SECTION_NAME">
                    {this.renderSectionFields()}
                </section>
                </ul>
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
