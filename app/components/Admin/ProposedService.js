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
    console.log(service);
    let jsx = [];
    for(let field in service) {
        if(service.hasOwnProperty(field) && field !== 'id' && field !== 'resource') {
            if(field === "notes") {
                let notes = service[field];
                let noteCount = 0;
                notes.forEach((note) => {
                    jsx.push(tableEntry("note"+noteCount++, "note", note.note));
                });
            }
            // else if (field === "schedule") {
            //     let schedule = service[field];
            //     let scheduleDays = schedule.schedule_days;
            //     scheduleDays.forEach((day) => {
            //         jsx.push(
            //             tableEntry(
            //                 "sched"+day.day,
            //                 "Schedule ("+day+")",
            //                 "Opens at: "+day.opens_at+", Closes at: "+day.closes_at
            //             )
            //         );
            //     })
            // }
            else {
                jsx.push(tableEntry(field, field, service[field]));
            }
        }
    }

    return jsx;
}
// function renderProposedServiceFields(service) {
//     let jsx = [];
//     for(let field in service) {
//         if(service.hasOwnProperty(field) && field !== 'id' && field) {
//             if(field !== 'notes' && field !== 'schedule')
//                 jsx.push(
//                     tableEntry(field, field, service[field])
//                 );
//         }
//     }
//
//     return jsx;
// }

function tableEntry(key, fieldName, value) {
    return (
        <div key={key} className="request-entry">
            <p className="request-cell name">{fieldName}</p>
            <p className="request-cell value">{value}</p>
        </div>
    );
}

export default ProposedService;
