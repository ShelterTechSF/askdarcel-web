// import * as ChangeRequestTypes from './ChangeRequestTypes';
// import Actions from './Actions';
import React from 'react';
import * as _ from 'lodash/fp/object';
import ChangeRequest from './ChangeRequest';
import ProposedService from './ProposedService';

class ChangeRequests extends React.Component {

  static renderRequestWrapper(changeRequest, actionHandler) {
    return (
      <div className="request-container">
        <ChangeRequest changeRequest={changeRequest} actionHandler={actionHandler} />
      </div>
    );
  }

  static renderIndividualRequests(changeRequests, actionHandler) {
    if (!changeRequests) { return; }
    const resourceInfoToRender = [];
    const requestsToRender = [];

    changeRequests.forEach((changeRequest) => {
      switch (changeRequest.type) {
        case 'ResourceChangeRequest':
          resourceInfoToRender.push(
            <div key={`cr${changeRequest.id}`}>
              <span> { ChangeRequests.renderRequestWrapper(changeRequest, actionHandler) } </span>
            </div>,
          );
          break;
        case 'ServiceChangeRequest':
          requestsToRender.push(
            <div key={`cr${changeRequest.id}`} className="service-wrapper">
              { ChangeRequests.renderRequestWrapper(changeRequest, actionHandler) }
            </div>,
          );
          break;
        default:
          // console.log('rendering unknown', changeRequest);
          // TODO: Pretty sure there are no other types for now
      }
    });

    if (requestsToRender.length) {
      requestsToRender.unshift(
        <span key="title">
          <hr />
          <h3>Services</h3>
        </span>
      );
    }

    return resourceInfoToRender.concat(requestsToRender);
  }

  static renderProposedServices(services, actionHandler) {
    if (!services) { return; }
    return services.map(service => (
      <div key={`svc${service.id}`}>
        <p>Proposed Service</p>
        <div className="request-container">
          <ProposedService service={service} actionHandler={actionHandler} />
        </div>
      </div>
    ));
  }

  constructor(props) {
    super(props);
    this.state = {
      resourceToCollapsed: {},
    };
    this.props.changeRequests.forEach((changeRequest) => {
      let resourceID = changeRequest.resource.id;
      this.state.resourceToCollapsed[resourceID] = true;
    });
    this.props.services.forEach((service) => {
      let resourceID = service.resource.id;
      this.state.resourceToCollapsed[resourceID] = true;
    });
  }

  toggleCollapsed(resourceID) {
    let resourceToCollapsed = _.extend({}, this.state.resourceToCollapsed);
    resourceToCollapsed[resourceID] ^= true;
    this.setState({
      resourceToCollapsed: resourceToCollapsed,
    });
  }

  renderChangeRequests(changeRequests, services, actionHandler) {
    const resourceToChangeRequests = {};
    const resourceObjects = {};
    const changeRequestWrappers = [];
    const resourceToServices = {};

    changeRequests.forEach((changeRequest) => {
      const resourceID = changeRequest.resource.id;

      if (!resourceToChangeRequests.hasOwnProperty(resourceID)) {
        resourceToChangeRequests[resourceID] = [];
      }

      resourceToChangeRequests[resourceID].push(changeRequest);
      resourceObjects[resourceID] = changeRequest.resource;
    });

    services.forEach((service) => {
      console.log(service)
      const resourceID = service.resource.id;
      if (!resourceToServices.hasOwnProperty(resourceID)) {
        resourceToServices[resourceID] = [];
      }
      resourceToServices[resourceID].push(service);
      resourceObjects[resourceID] = service.resource;
    });

    for (let resourceID in resourceObjects) {
      const collapsed = this.state.resourceToCollapsed[resourceID] ? 'collapsed' : '';
      changeRequestWrappers.push(
        <div key={resourceID} className={`group-container ${collapsed}`}>
          <h2 onClick={() => this.toggleCollapsed(resourceID)}>
            {resourceObjects[resourceID].name}
            <span className={`material-icons expander ${collapsed} right`}>expand_less</span>
          </h2>
          <div className={`group-content ${collapsed}`}>
            {ChangeRequests.renderIndividualRequests(resourceToChangeRequests[resourceID], actionHandler)}
            {ChangeRequests.renderProposedServices(resourceToServices[resourceID], actionHandler)}
          </div>
        </div>
      );
    }

    return changeRequestWrappers;
  }

  render() {
    return (
      <div className="change-requests">
        <h1 className="page-title">
          {`Change Requests (${this.props.changeRequests.length})`}
        </h1>
        {this.renderChangeRequests(
          this.props.changeRequests,
          this.props.services,
          this.props.actionHandler,
        )}
      </div>
    );
  }
}

export default ChangeRequests;
