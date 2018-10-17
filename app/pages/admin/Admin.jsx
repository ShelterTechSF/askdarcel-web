import React from 'react';
import { Link } from 'react-router';

export class AdminPage extends React.Component {
  constructor() {
    super();
    this.state = {
      change_requests: [],
      changeRequestsLoaded: false,
      pendingServicesLoaded: false,
    };
  }

  // bulkActionHandler(action, changeRequests) {
  //   return Promise.all(
  //     changeRequests.map((changeRequest) => { // Create an action handler for each CR
  //       const changeRequestFields = changeRequest.field_changes.reduce((a, c) => {
  //         if (a[c.field_name] !== undefined) {
  //           console.warn(
  //            'Discarding duplicate field name in action handler: ',
  //            { current: a[c.field_name], duplicate: c }
  //           );
  //           return a;
  //         }

  //         a[c.field_name] = c.field_value;
  //         return a;
  //       }, {});

  //       return this.actionHandler(changeRequest.id, action, changeRequestFields);
  //     }),
  //   );
  // }

  render() {
    return (
      <ul>
        <li>
          <Link to={'/admin/changes'}>Change Requests</Link>
        </li>
      </ul>
    );
  }
}
