import React from 'react';
import ChangeRequest from './ChangeRequest';
import * as ChangeRequestTypes from './ChangeRequestTypes';
import ProposedService from './ProposedService';
import Actions from './Actions';

var ChangeRequests = (props) => {
    return (
        <div className="change-requests">
            {renderChangeRequests(props.changeRequests, props.services, props.actionHandler)}
        </div>
    );
};

function renderChangeRequests(changeRequests, services, actionHandler) {
    let resourceToChangeRequests = {};
    let resourceObjects = {};
    let changeRequestWrappers = [];
    changeRequests.forEach((changeRequest) => {
        let resourceID = changeRequest.resource.id;

        if(!resourceToChangeRequests.hasOwnProperty(resourceID)) {
            resourceToChangeRequests[resourceID] = [];
        }

        resourceToChangeRequests[resourceID].push(changeRequest);
        resourceObjects[resourceID] = changeRequest.resource;
    });

    let resourceToServices = {};
    services.forEach((service) => {
        let resourceID = service.resource.id;
        if(!resourceToServices.hasOwnProperty(resourceID)) {
            resourceToServices[resourceID] = [];
        }
        resourceToServices[resourceID].push(service.service);
        resourceObjects[resourceID] = service.resource;
    });

    for(let resourceID in resourceObjects) {
        changeRequestWrappers.push(
            <div key={resourceID} className="group-container">
                <h1>{resourceObjects[resourceID].name}</h1>
                {renderProposedServices(resourceToServices[resourceID], actionHandler)}
                {renderIndividualRequests(resourceToChangeRequests[resourceID], actionHandler)}
            </div>
        );
    }

    // for(let resourceID in resourceToChangeRequests) {
    //     if(resourceToChangeRequests.hasOwnProperty(resourceID)) {
    //         changeRequestWrappers.push(
    //             <div key={resourceID} className="group-container">
    //                 <h1>{resourceObjects[resourceID].name}</h1>
    //                 {renderIndividualRequests(resourceToChangeRequests[resourceID], actionHandler)}
    //             </div>
    //         );
    //     }
    // }

    return changeRequestWrappers;
}

function renderProposedServices(services, actionHandler) {
    if(!services) {
        return;
    }
    return services.map((service) => {
        return (
            <div key={'svc'+service.id}>
                <p>Proposed Service</p>
                <div className="request-container">
                    <ProposedService service={service} />
                    <Actions
                        id={service.id}
                        actionHandler={actionHandler}
                        approveAction={ChangeRequestTypes.APPROVE_SERVICE}
                        rejectAction={ChangeRequestTypes.REJECT_SERVICE}
                    />
                </div>
            </div>
        );
    });
}

function renderIndividualRequests(changeRequests, actionHandler) {
    if(!changeRequests) {
        return;
    }
    let requestsToRender = [];
    changeRequests.forEach((changeRequest) => {
        requestsToRender.push(
            <div key={'cr'+changeRequest.id}>
                <p>{changeRequest.type}</p>
                <div className="request-container">
                    <ChangeRequest changeRequest={changeRequest} />
                    <Actions
                        id={changeRequest.id}
                        actionHandler={actionHandler}
                        approveAction={ChangeRequestTypes.APPROVE}
                        rejectAction={ChangeRequestTypes.DELETE}
                    />
                </div>
            </div>
        );
    });

    return requestsToRender;
}

export default ChangeRequests;
