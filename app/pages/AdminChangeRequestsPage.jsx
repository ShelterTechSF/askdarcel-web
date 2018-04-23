import React from 'react';
import PropTypes from 'prop-types';
import TextareaAutosize from 'react-autosize-textarea';
import { getExistingValueFromChangeRequest } from 'models/admin';

import * as DataService from '../utils/DataService';
import { getAuthRequestHeaders } from '../utils/index';

class AdminChangeRequestsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      existingRecord: {},
      changeRequestFields: {},
    };
  }

  changeFieldValue(key, value) {
    const tempChangeRequestFields = this.state.changeRequestFields;
    tempChangeRequestFields[key] = value;
    this.setState({ changeRequestFields: Object.assign({}, tempChangeRequestFields) });
  }

  approve() {
    const details = {};
    this.props.changeRequest.field_changes.forEach((change) => {
      details[change.field_name] = change.field_value;
    });
    const body = Object.assign({}, details, this.state.changeRequestFields);

    return DataService.post(
      `/api/change_requests/${this.props.changeRequest.id}/approve`,
      { change_request: body },
      getAuthRequestHeaders(),
    )
    .then(response =>
      this.props.updateFunction(response, this.props.changeRequest),
    )
    .catch((err) => {
      console.log(err);
    });
  }

  reject() {
    return DataService.post(
      `/api/change_requests/${this.props.changeRequest.id}/reject`,
      {},
      getAuthRequestHeaders(),
    )
    .then(response =>
      this.props.updateFunction(response, this.props.changeRequest, {}),
    )
    .catch((err) => {
      console.log(err);
    });
  }

  renderFieldChange(change) {
    const fieldName = change.field_name;
    const fieldValue = change.field_value;
    const existingValue = getExistingValueFromChangeRequest(
      this.props.changeRequest,
      fieldName,
      fieldValue,
    );

    switch (this.props.changeRequest.type) {
      default:
        return (
          <div key={fieldName} className="change-wrapper">
            <label htmlFor={fieldName}>
              { fieldName.replace(/_/g, ' ') }
              { existingValue ? '' : (<sub>NEW</sub>) }
            </label>
            <div className="request-fields">
              <div className="request-entry">
                <TextareaAutosize
                  value={fieldValue}
                  onChange={e => this.changeFieldValue(fieldName, e.target.value)}
                  className="request-cell value"
                />
              </div>
              {
                existingValue
                ? (
                  <p className="change-existing">
                    {
                      this.getExistingValueFromChangeRequest(
                        this.props.changeRequest,
                        fieldName,
                        fieldValue,
                      )
                    }
                  </p>
                )
                : ''
              }
            </div>
          </div>
        );
    }
  }

  render() {
    return (
      <div className="change-request">

        <h4>{ this.props.title || '' }</h4>

        <div className="changes">
          {
            this.props.changeRequest.field_changes.map(f => (
              <div key={f.field_name}>
                {this.renderFieldChange(f)}
              </div>
            ))
          }
        </div>

        <div className="actions request-cell btn-group">
          <button onClick={() => this.approve()}>
            <i className="material-icons">done</i>
            Approve
          </button>

          <button onClick={() => this.reject()} className="danger">
            <i className="material-icons">delete</i>
            Reject
          </button>
        </div>
      </div>
    );
  }
}

AdminChangeRequestsPage.propTypes = {
  title: PropTypes.string,
  changeRequest: PropTypes.object.isRequired,
  updateFunction: PropTypes.func.isRequired,
};

AdminChangeRequestsPage.defaultProps = {
  title: '',
};

export default AdminChangeRequestsPage;
