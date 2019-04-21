import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import EditNotes from './EditNotes';
import EditSchedule from './EditSchedule';
import MultiSelectDropdown from './MultiSelectDropdown';
import FormTextArea from './FormTextArea';


const InputField = ({
  type, label, placeholder, value, setValue,
}) => (
  <Fragment>
    <label htmlFor="input">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={evt => setValue(evt.target.value)}
    />
  </Fragment>
);

InputField.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired, // A function to call when setting a new value
};

InputField.defaultProps = {
  type: 'text',
};


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

    this.textAreas = [
      {
        label: 'Service Description',
        placeholder: "Describe what you'll receive from this service in a few sentences.",
        field: 'long_description',
      },
      {
        label: 'Application Process',
        placeholder: 'How do you apply for this service?',
        field: 'application_process',
      },
      {
        label: 'Required Documents',
        placeholder: 'What documents do you need to bring to apply?',
        field: 'required_documents',
      },
      {
        // TODO: Make this a multiselectdropdown, create a new table in the DB for languages,
        //       and seed it with languages
        label: 'Interpretation Services',
        placeholder: 'What interpretation services do they offer?',
        field: 'interpretation_services',
      },
    ];

    this.handleNotesChange = this.handleNotesChange.bind(this);
    this.handleScheduleChange = this.handleScheduleChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleEligibilityChange = this.handleEligibilityChange.bind(this);
  }

  // This is meant to gradually replace handleFieldChange in a way that does not
  // depend on the caller necessarily being a DOM event.
  handleServiceFieldChange = (field, value) => {
    const { service } = this.state;
    service[field] = value;
    this.handleChange(service);
  }

  handleChange(service) {
    this.setState({ service }, () => {
      const { service: { key }, handleChange } = this.props;
      handleChange(key, service);
    });
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
    const flattenedService = {
      ...service,
      ...stateService,
    };
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
            <InputField
              label="Name of the Service"
              placeholder="What is this service called?"
              value={flattenedService.name}
              setValue={value => this.handleServiceFieldChange('name', value)}
            />
          </li>

          <li className="edit--section--list--item">
            <InputField
              label="Nickname"
              placeholder="What it's known as in the community"
              value={flattenedService.alternate_name}
              setValue={value => this.handleServiceFieldChange('alternate_name', value)}
            />
          </li>

          <li key="email" className="edit--section--list--item email">
            <InputField
              type="email"
              label="Service E-Mail"
              placeholder="Email address for this service"
              value={flattenedService.email}
              setValue={value => this.handleServiceFieldChange('email', value)}
            />
          </li>

          {this.textAreas.map(textArea => (
            <li className="edit--section--list--item" key={textArea.field}>
              <FormTextArea
                label={textArea.label}
                placeholder={textArea.placeholder}
                value={flattenedService[textArea.field] || ''}
                setValue={value => this.handleServiceFieldChange(textArea.field, value)}
              />
            </li>
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
            <InputField
              label="Cost"
              placeholder="How much does this service cost?"
              value={flattenedService.fee}
              setValue={value => this.handleServiceFieldChange('fee', value)}
            />
          </li>

          <li className="edit--section--list--item">
            <InputField
              label="Wait Time"
              placeholder="Is there a waiting list or wait time?"
              value={flattenedService.wait_time}
              setValue={value => this.handleServiceFieldChange('wait_time', value)}
            />
          </li>

          <li className="edit--section--list--item">
            <InputField
              label="Service&#39;s Website"
              placeholder="http://"
              value={flattenedService.url}
              setValue={value => this.handleServiceFieldChange('url', value)}
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
