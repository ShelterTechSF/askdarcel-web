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
        if(service.hasOwnProperty(field) && field !== 'id') {
            if(field === "notes") {
                let notes = service[field];
                let noteCount = 0;
                notes.forEach((note) => {
                    jsx.push(tableEntry("note"+noteCount++, "note", note.note));
                });
            } else if (field === "schedule") {
                let schedule = service[field];
                let scheduleDays = schedule.schedule_days;
                scheduleDays.forEach((day) => {
                    jsx.push(
                        tableEntry(
                            "sched"+day.day,
                            "Schedule ("+day+")",
                            "Opens at: "+day.opens_at+", Closes at: "+day.closes_at
                        )
                    );
                })
            } else {
                jsx.push(tableEntry(field, field, service[field]));
            }
        }
    }

    return jsx;
}

function tableEntry(key, fieldName, value) {
    <div key={key} className="request-entry">
        <p className="request-cell name">{fieldName}</p>
        <p className="request-cell value">{value}</p>
    </div>
}

export default ProposedService;
