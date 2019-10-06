import React from 'react';
import { browserHistory, Link } from 'react-router';
import Loader from '../../components/ui/Loader';
import ChangeRequest from '../../components/admin/ChangeRequest';
import ProposedService from '../../components/admin/ProposedService';

import * as DataService from '../../utils/DataService';
import { getAuthRequestHeaders } from '../../utils/index';

export class ChangeRequestsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeResource: undefined,
      changeRequests: {},
      loaded: false,
      resources: {},
    };

    this.update = this.update.bind(this);
    this.loadAllChanges();
  }

  /**
   * Choose a given resource to render individual changes for
   * @param {Object} resource    The resource object
   */
  setActiveResource(resource) {
    this.setState({ activeResource: resource });
  }

  /**
   * Loads and parses all the change requests and pending services
   */
  loadAllChanges() {
    let changeRequests;

    // Requests sent seperately to avoid race conditions since auth invalidates tokens upon request
    DataService.get('/api/change_requests', getAuthRequestHeaders())
      .then(r => {
        changeRequests = r.change_requests;
        return DataService.get('/api/services/pending', getAuthRequestHeaders());
      })
      .then(pendingServices => {
        const parsedChanges = Object.assign(
          { loaded: true, resources: {} },
          { changeRequests, count: changeRequests.length },
          pendingServices,
        );

        // Track invidivual Resources
        const ensureResourceExists = resource => {
          if (parsedChanges.resources[resource.id] === undefined) {
            /* eslint-disable no-param-reassign */
            resource._changeRequests = [];
            resource._proposedServices = [];
            resource._collapsed = true;
            parsedChanges.resources[resource.id] = resource;
          }
        };

        // Attach change requests to this resource
        parsedChanges.changeRequests.forEach(cr => {
          ensureResourceExists(cr.resource);
          parsedChanges.resources[cr.resource.id]._changeRequests.push(cr);
        });

        // Attach proposed services
        parsedChanges.services.forEach(s => {
          ensureResourceExists(s.resource);
          parsedChanges.resources[s.resource.id]._proposedServices.push(s);
        });

        this.setState(parsedChanges);
      })
  }

  /**
   * Updates the view when a child component makes changes,
   * cleaning up changeRequests that have been approved/rejected
   *
   * @param  {Object} resp             The API response
   * @param  {Object} changeRequest    The change request to update
   * @param  {Object} body             The request body saved
   */
  update(resp, changeRequest) {
    const { resources } = this.state;
    const r = resources[changeRequest.resource.id];
    const type = changeRequest.type ? '_changeRequests' : '_proposedServices';
    const pos = r[type].indexOf(changeRequest);

    if (pos > -1) {
      r[type].splice(pos, 1);
    }

    if (r._changeRequests.length === 0 && r._proposedServices.length === 0) {
      delete resources[changeRequest.resource.id];
      this.state.activeResource = undefined;
    }

    this.setState({ resources });
  }

  /**
   * Renders the list of resources on the left, that can be clicked to open
   * the relevant list of changeRequests and proposedServices
   *
   * @param  {Object} resource    A passed in resource
   * @return {JSX}                A full accordian with all the relevant changes
   */
  renderResourceSummaryList() {
    if (this.state.resources) {
      return Object.keys(this.state.resources).map(resourceID => {
        const resource = this.state.resources[resourceID];
        return (
          <div
            key={resource.id}
            className={`results-table-entry resource-title ${this.state.activeResource === resource ? 'active' : ''}`}
            onClick={() => this.setActiveResource(resource)}
            role="link"
            tabIndex="-1"
          >
            <header>
              <h4>{ resource.name }</h4>
            </header>
          </div>
        );
      });
    }
    return (
      <p className="message">
          Hurrah, it looks like you&#39;ve handled all the outstanding change requests!
      </p>
    );
  }

  /**
   * Renders the complete array of changes for a resource, including
   * changeRequests and proposed services, in the appropriate order
   * @param  {Object} resource    A single resource already parsed with
   *                              relevant changeRequests etc attached
   * @return {JSX}                All changeRequests, serviceChanges and
   *                              proposedServices in order.
   */
  renderResourceChangeRequests(resource) {
    const resourceChanges = [];
    const serviceChanges = [];
    const proposedServices = [];
    let service;
    // const services = {};

    resource._changeRequests.forEach(changeRequest => {
      switch (changeRequest.type) {
      case 'ServiceChangeRequest':
        service = changeRequest.resource.services
          .find(s => s.id === changeRequest.object_id);
        serviceChanges.push(
          <ChangeRequest
            key={changeRequest.id}
            changeRequest={changeRequest}
            updateFunction={this.update}
            title={service.name}
          />,
        );

        // TODO Group ServiceChangeRequests by service\
        // if (services[changeRequest.object_id] === undefined) {
        //   services[changeRequest.object_id] = [];
        // }
        // services[changeRequest.object_id].push(changeRequest);
        // console.log(changeRequest)
        break;

        // case 'AddressChangeRequest':
        // case 'NoteChangeRequest':
        // case 'PhoneChangeRequest':
        // case 'ResourceChangeRequest':
        // case 'ScheduleDayChangeRequest':
        //   sections.resourceChanges.push(
        //     <div
        //       key={`change-request-${changeRequest.id}`}
        //       className="request-container resource-change-wrapper"
        //     >
        //       <ChangeRequest
        //         changeRequest={changeRequest}
        //         actionHandler={this.props.actionHandler}
        //       />
        //     </div>
        //   );
        //   break;

      default:
        resourceChanges.push(
          <ChangeRequest
            key={changeRequest.id}
            changeRequest={changeRequest}
            updateFunction={this.update}
          />,
        );
      }
    });

    resource._proposedServices.forEach(svc => {
      proposedServices.push(
        <ProposedService
          key={svc.id}
          service={svc}
          updateFunction={this.update}
        />,
      );
    });

    return (
      <div className="titlebox">
        <h2>
          <Link to={`/organizations/${resource.id}`} target="_blank">
            <i className="material-icons">link</i>
          </Link>
          {resource.name}
        </h2>

        <div className="change-request-wrapper">
          { resourceChanges}
        </div>

        {
          serviceChanges.length || proposedServices.length
            ? <h3>Services</h3>
            : <span />
        }

        <div className="change-request-wrapper">
          { serviceChanges }
          { proposedServices }
        </div>
      </div>
    );
  }

  /**
   * render a full list of changeRequests
   * @return {JSX} A full list of changeRequests seperated by resource
   */
  render() {
    return (
      <div className="admin change-requests results">
        <div className="results-table summary">
          <h1 className="page-title">
            Change Requests
            {' '}
            { this.state.count ? `(${this.state.count})` : '' }
          </h1>

          { this.state.loaded ? this.renderResourceSummaryList() : (<Loader />) }
        </div>
        <div className="results-table details">
          {
            !this.state.activeResource
              ? (<h2 className="inactive">Choose a resource</h2>)
              : this.renderResourceChangeRequests(this.state.activeResource)
          }
        </div>
      </div>
    );
  }
}
