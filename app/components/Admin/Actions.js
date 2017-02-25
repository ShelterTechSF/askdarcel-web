import React from 'react';
import * as ChangeRequestTypes from './ChangeRequestTypes';

var Actions = (props) => {
    let id = props.id;
    let approveAction = props.approveAction;
    let rejectAction = props.rejectAction;
    return (
        <div className="actions request-cell">
            <i className="material-icons" onClick={() => props.actionHandler(id, rejectAction)}>delete</i>
            <i className="material-icons" onClick={() => props.actionHandler(id, approveAction)}>done</i>
        </div>
    );
};

export default Actions;
