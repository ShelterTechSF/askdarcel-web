import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditNotes from './EditNotes';
import EditSchedule from './EditSchedule';
import MultiSelectDropdown from './MultiSelectDropdown';
import FormTextArea from './FormTextArea';

class ProvidedService extends Component {
  constructor(props) {
    super(props);

    // Notice
    // It's really unclear when to use the version of the service in the state
    // vs. when to use the version in the props.
    // Currently, it looks like the one in state only keeps track of changes
    // that have been made to the service, and a missing key implies that there
    // is no change to that field. A longer-term refactoring should involve
    // keeping track of the deltas in one location rather than having the logic
    // distributed throughout the whole application.
    this.state = {
      service: {},
    };

    const { service } = this.props;

    this.textAreas = [
      {
        label: 'Service Description',
        placeholder: "Describe what you'll receive from this service in a few sentences.",
        field: 'long_description',
        defaultValue: service.long_description,
        onChange: this.handleFieldChange.bind(this),
      },
      {
        label: 'Application Process',
        placeholder: 'How do you apply for this service?',
        field: 'application_process',
        defaultValue: service.application_process,
        onChange: this.handleFieldChange.bind(this),
      },
      {
        label: 'Required Documents',
        placeholder: 'What documents do you need to bring to apply?',
        field: 'required_documents',
        defaultValue: service.required_documents,
        onChange: this.handleFieldChange.bind(this),
      },
      {
        // TODO: Make this a multiselectdropdown, create a new table in the DB for languages,
        //       and seed it with languages
        label: 'Interpretation Services',
        placeholder: 'What interpretation services do they offer?',
        field: 'interpretation_services',
        defaultValue: service.interpretation_services,
        onChange: this.handleFieldChange.bind(this),
      },
    ];

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleNotesChange = this.handleNotesChange.bind(this);
    this.handleScheduleChange = this.handleScheduleChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleEligibilityChange = this.handleEligibilityChange.bind(this);
  }

  handleChange(service) {
    this.setState({ service }, () => {
      const { service: { key }, handleChange } = this.props;
      handleChange(key, service);
    });
  }

  handleFieldChange(e) {
    const { service } = this.state;
    service[e.target.dataset.field] = e.target.value;
    this.handleChange(service);
  }

  handleNotesChange(notesObj) {
    const { service } = this.state;
    service.notesObj = notesObj;
    this.handleChange(service);
  }

  handleScheduleChange(scheduleObj) {
    const { service } = this.state;
    service.scheduleObj = scheduleObj;
    this.handleChange(service);
  }

  handleCategoryChange(categories) {
    const { service } = this.state;
    service.categories = categories;
    this.handleChange(service);
  }

  handleEligibilityChange(eligibilities) {
    const { service } = this.state;
    service.eligibilities = eligibilities;
    this.handleChange(service);
  }

  render() {
    const { handleDeactivation, index, service } = this.props;
    const { service: stateService, submitting } = this.state;
    return (
      <li id={`${service.id}`} className="edit--service edit--section">
        <header className="edit--section--header">
          <h4>
            {`Service ${index + 1}: ${service.name}`}
          </h4>
          <button
            className="remove-item"
            type="button"
            id="service--deactivation"
            disabled={submitting}
            onClick={() => handleDeactivation('service', service.id)}
          >
            Remove Service
          </button>
        </header>

        <ul className="edit--section--list">
          <li className="edit--section--list--item">
            <label htmlFor="input">Name of the Service</label>
            <input
              type="text"
              placeholder="What is this service called?"
              data-field="name"
              defaultValue={service.name}
              onChange={this.handleFieldChange}
            />
          </li>

          <li className="edit--section--list--item">
            <label htmlFor="input">Nickname</label>
            <input
              type="text"
              placeholder="What it's known as in the community"
              data-field="alternate_name"
              defaultValue={service.alternate_name}
              onChange={this.handleFieldChange}
            />
          </li>

          <li key="email" className="edit--section--list--item email">
            <label htmlFor="email">Service E-Mail</label>
            <input
              type="email"
              defaultValue={service.email}
              data-field="email"
              onChange={this.handleFieldChange}
            />
          </li>

          {this.textAreas.map(textArea => (
            <FormTextArea
              label={textArea.label}
              placeholder={textArea.placeholder}
              field={textArea.field}
              value={stateService[textArea.field] || textArea.defaultValue || ''}
              onChange={textArea.onChange}
            />
          ))}

          <li className="edit--section--list--item">
            <MultiSelectDropdown
              selectedItems={service.eligibilities}
              handleSelectChange={this.handleEligibilityChange}
              label="Eligibility"
              optionsRoute="eligibilities"
            />
          </li>

          <li className="edit--section--list--item">
            <label htmlFor="input">Cost</label>
            <input
              placeholder="How much does this service cost?"
              data-field="fee"
              defaultValue={service.fee}
              onChange={this.handleFieldChange}
            />
          </li>

          <li className="edit--section--list--item">
            <label htmlFor="input">Wait Time</label>
            <input
              placeholder="Is there a waiting list or wait time?"
              data-field="wait_time"
              defaultValue={service.wait_time}
              onChange={this.handleFieldChange}
            />
          </li>

          <li className="edit--section--list--item">
            <label htmlFor="input">Service&#39;s Website</label>
            <input
              placeholder="http://"
              data-field="url"
              defaultValue={service.url}
              onChange={this.handleFieldChange}
            />
          </li>

          <EditSchedule
            canInheritFromParent
            schedule={service.schedule}
            handleScheduleChange={this.handleScheduleChange}
          />

          <EditNotes notes={service.notes} handleNotesChange={this.handleNotesChange} />

          <MultiSelectDropdown
            selectedItems={service.categories}
            handleSelectChange={this.handleCategoryChange}
            label="Categories"
            optionsRoute="categories"
          />
        </ul>
      </li>
    );
  }
}

ProvidedService.propTypes = {
  service: PropTypes.shape({
    id: PropTypes.string,
    fee: PropTypes.number,
    categories: PropTypes.array,
    notes: PropTypes.array,
    schedule: PropTypes.object,
    eligibility: PropTypes.bool,
    eligibilities: PropTypes.array,
    email: PropTypes.string,
    name: PropTypes.string,
    required_documents: PropTypes.string,
    application_process: PropTypes.string,
    long_description: PropTypes.string,
    key: PropTypes.string,
  }).isRequired,
  handleDeactivation: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default ProvidedService;
