import React from 'react';
import Loader from '../Loader';
import ChangeRequests from './ChangeRequests';
import * as dataService from '../../utils/DataService';
import * as changeRequestConstants from './ChangeRequestTypes';
import { getAuthRequestHeaders } from '../../utils/index';

class Admin extends React.Component {
    constructor() {
        super();
        this.state = {
            change_requests: [],
            changeRequestsLoaded: false,
            pendingServicesLoaded: false
        };

        this.actionHandler = this.actionHandler.bind(this);
        this.getChangeRequests = this.getChangeRequests.bind(this);
        this.removeChangeRequest = this.removeChangeRequest.bind(this);
        this.getPendingServices = this.getPendingServices.bind(this);
        this.removeService = this.removeService.bind(this);
    }

    componentDidMount() {
        this.getChangeRequests();
        this.getPendingServices();
    }

    getPendingServices() {
        dataService.get('/api/services/pending', getAuthRequestHeaders()).then((json) => {
            this.setState({
                services: json.services,
                pendingServicesLoaded: true
            });
        });
    }

    getChangeRequests() {
      dataService.get('/api/change_requests', getAuthRequestHeaders()).then((json) => {
        this.setState({
          change_requests: json.change_requests,
          changeRequestsLoaded: true
        });
      });
    }

    actionHandler(id, action) {
        let requestString = action.replace(/{(.*?)}/, id);
        let removalFunc;
        let logMessage;

        switch(action) {
            case changeRequestConstants.APPROVE:
                removalFunc = this.removeChangeRequest;
                logMessage = "Error while trying to approve change request.";
                break;
            case changeRequestConstants.DELETE:
                removalFunc = this.removeChangeRequest;
                logMessage = "Error while trying to reject change request.";
                break;
            case changeRequestConstants.APPROVE_SERVICE:
                removalFunc = this.removeService;
                logMessage = "Error while trying to approve service";
                break;
            case changeRequestConstants.REJECT_SERVICE:
                removalFunc = this.removeService;
                logMessage = "Error while trying to reject service";
                break;
        }

        dataService.post(requestString, getAuthRequestHeaders())
            .then((response) => {
                if(response.ok) {
                    removalFunc(id);
                } else {
                    console.log(logMessage);
                }
            })
    }

    removeChangeRequest(changeRequestID) {
        let changeRequests = this.state.change_requests;
        this.setState({ change_requests: changeRequests.filter(changeRequest => changeRequest.id != changeRequestID) });
    }

    removeService(serviceID) {
        let services = this.state.services;
        this.setState({ services: services.filter(service => service.id != serviceID)});
    }

    render() {
        let pendingServicesLoaded = this.state.pendingServicesLoaded;
        let changeRequestsLoaded = this.state.changeRequestsLoaded;
        return (
            !(this.state.pendingServicesLoaded &&
                this.state.changeRequestsLoaded) ? <Loader /> :
            <div className="admin">
              <ChangeRequests
                changeRequests={this.state.change_requests}
                services={this.state.services}
                actionHandler={this.actionHandler}/>
            </div>
        )
    }
}

export default Admin;
