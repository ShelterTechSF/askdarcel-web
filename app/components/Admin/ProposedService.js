import React from 'react';

var ProposedService = (props) => {
    return (
        <div className="change-log">
            {renderProposedService(props.service)}
        </div>
    );
}

function renderProposedService(service) {
    return (
        <div className="request-fields">
            {renderProposedServiceFields(service)}
        </div>
    );
}

function renderProposedServiceFields(service) {
    let jsx = [];
    for(let field in service) {
        if(service.hasOwnProperty(field) &&
            typeof service[field] !== 'object' &&
            field !== 'id') {
                jsx.push(
                    <div key={field} className="request-entry">
                        <p className="request-cell name">{field}</p>
                        <p className="request-cell value">{service[field]}</p>
                    </div>
                );
        }
    }

    return jsx;
}

export default ProposedService;
