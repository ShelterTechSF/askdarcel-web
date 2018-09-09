import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditNotes from './EditNotes';
import EditSchedule from './EditSchedule';
import MultiSelectDropdown from './MultiSelectDropdown';
import FormTextArea from './FormTextArea';

class ProvidedService extends Component {
  constructor(props) {
    super(props);

    this.state = {
      service: {},
    };

    this.textAreas = [
      {
        label: 'Service description',
        placeholder: "Describe what you'll receive from this service in a few sentences.",
        field: 'long_description',
        defaultValue: this.props.service.long_description,
        onChange: this.handleFieldChange.bind(this),
      },
      {
        label: 'Application Process',
        placeholder: 'How do you apply for this service?',
        field: 'application_process',
        defaultValue: this.props.service.application_process,
        onChange: this.handleFieldChange.bind(this),
      },
      {
        label: 'Required Documents',
        placeholder: 'What documents do you need to bring to apply?',
        field: 'required_documents',
        defaultValue: this.props.service.required_documents,
        onChange: this.handleFieldChange.bind(this),
      },
      {
        // TODO: Make this a multiselectdropdown, create a new table in the DB for languages,
        //       and seed it with languages
        label: 'Interpretation Services',
        placeholder: 'What interpretation services do they offer?',
        field: 'interpretation_services',
        defaultValue: this.props.service.interpretation_services,
        onChange: this.handleFieldChange.bind(this),
      },
    ];

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleNotesChange = this.handleNotesChange.bind(this);
    this.handleScheduleChange = this.handleScheduleChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleElgibilityChange = this.handleElgibilityChange.bind(this);
  }

  handleChange(service) {
    this.setState({ service }, () => {
      this.props.handleChange(this.props.service.key, service);
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

  handleElgibilityChange(eligibilities) {
    const { service } = this.state;
    service.eligibilities = eligibilities;
    this.handleChange(service);
  }

  render() {
    return (
      <li id={`${this.props.service.id}`} className="edit--service edit--section">
        <header className="edit--section--header">
          <h4>Service {this.props.index + 1}: {this.props.service.name}</h4>
          <button
            className="remove-item"
            id="service--deactivation"
            disabled={this.state.submitting}
            onClick={() => this.props.handleDeactivation('service', this.props.service.id)}
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
              defaultValue={this.props.service.name}
              onChange={this.handleFieldChange}
            />
          </li>

          <li className="edit--section--list--item">
            <label htmlFor="input">Nickname</label>
            <input
              type="text"
              placeholder="What it's known as in the community"
              data-field="alternate_name"
              defaultValue={this.props.service.alternate_name}
              onChange={this.handleFieldChange}
            />
          </li>

          <li key="email" className="edit--section--list--item email">
            <label htmlFor="email">Service E-Mail</label>
            <input
              type="email"
              defaultValue={this.props.service.email}
              data-field="email"
              onChange={this.handleFieldChange}
            />
          </li>

          {this.textAreas.map(textArea => (
            <FormTextArea
              label={textArea.label}
              placeholder={textArea.placeholder}
              field={textArea.field}
              defaultValue={textArea.defaultValue}
              onChange={textArea.onChange}
            />
          ))}

          <li className="edit--section--list--item">
            <MultiSelectDropdown
              selectedItems={this.props.service.eligibilities}
              handleSelectChange={this.handleElgibilityChange}
              label={'Elgibility'}
              optionsRoute={'eligibilities'}
            />
          </li>

          <li className="edit--section--list--item">
            <label htmlFor="input">Cost</label>
            <input
              placeholder="How much does this service cost?"
              data-field="fee"
              defaultValue={this.props.service.fee}
              onChange={this.handleFieldChange}
            />
          </li>

          <li className="edit--section--list--item">
            <label htmlFor="input">Wait Time</label>
            <input
              placeholder="Is there a waiting list or wait time?"
              data-field="wait_time"
              defaultValue={this.props.service.wait_time}
              onChange={this.handleFieldChange}
            />
          </li>

          <li className="edit--section--list--item">
            <label htmlFor="input">Service&#39;s Website</label>
            <input
              placeholder="http://"
              data-field="url"
              defaultValue={this.props.service.url}
              onChange={this.handleFieldChange}
            />
          </li>

          <EditSchedule
            schedule={this.props.service.schedule}
            handleScheduleChange={this.handleScheduleChange}
          />

          <EditNotes notes={this.props.service.notes} handleNotesChange={this.handleNotesChange} />

          <MultiSelectDropdown
            selectedItems={this.props.service.categories}
            handleSelectChange={this.handleCategoryChange}
            label={'Categories'}
            optionsRoute={'categories'}
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
