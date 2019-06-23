import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import EditNotes from './EditNotes';
import EditSchedule from './EditSchedule';
import MultiSelectDropdown from './MultiSelectDropdown';
import FormTextArea from './FormTextArea';
import { buildScheduleDays } from '../../pages/OrganizationEditPage';


const InputField = ({
  type, label, placeholder, value, setValue,
}) => (
  <Fragment>
    <label htmlFor="input">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value || ''}
      onChange={evt => setValue(evt.target.value)}
    />
  </Fragment>
);

InputField.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string,
  setValue: PropTypes.func.isRequired, // A function to call when setting a new value
};

InputField.defaultProps = {
  type: 'text',
  value: '',
};


const TEXT_AREAS = [
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


const ProvidedService = ({
  editServiceById, handleDeactivation, index, service,
}) => {
  const handleChange = (field, value) => {
    const { id } = service;
    editServiceById(id, { id, [field]: value });
  };

  const setShouldInheritScheduleFromParent = shouldInherit => {
    const { scheduleObj: scheduleDaysByDay } = service;

    let tempScheduleDays = {};

    if (shouldInherit) {
      tempScheduleDays = Object.entries(scheduleDaysByDay).reduce(
        (acc, [day, scheduleDays]) => (
          {
            ...acc,
            [day]: scheduleDays.map(scheduleDay => ({
              ...scheduleDay,
              opens_at: null,
              closes_at: null,
              openChanged: true,
              closeChanged: true,
            })),
          }
        ),
        {},
      );
    } else {
      tempScheduleDays = buildScheduleDays(service.schedule);
    }
    handleChange('shouldInheritScheduleFromParent', shouldInherit);
    handleChange('scheduleObj', tempScheduleDays);
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
            value={service.name}
            setValue={value => handleChange('name', value)}
          />
        </li>

        <li className="edit--section--list--item">
          <InputField
            label="Nickname"
            placeholder="What it's known as in the community"
            value={service.alternate_name}
            setValue={value => handleChange('alternate_name', value)}
          />
        </li>

        <li key="email" className="edit--section--list--item email">
          <InputField
            type="email"
            label="Service E-Mail"
            placeholder="Email address for this service"
            value={service.email}
            setValue={value => handleChange('email', value)}
          />
        </li>

        {TEXT_AREAS.map(textArea => (
          <li className="edit--section--list--item" key={textArea.field}>
            <FormTextArea
              label={textArea.label}
              placeholder={textArea.placeholder}
              value={service[textArea.field] || ''}
              setValue={value => handleChange(textArea.field, value)}
            />
          </li>
        ))}

        <li className="edit--section--list--item">
          <MultiSelectDropdown
            selectedItems={service.eligibilities}
            handleSelectChange={value => handleChange('eligibilities', value)}
            label="Eligibility"
            optionsRoute="eligibilities"
          />
        </li>

        <li className="edit--section--list--item">
          <InputField
            label="Cost"
            placeholder="How much does this service cost?"
            value={service.fee}
            setValue={value => handleChange('fee', value)}
          />
        </li>

        <li className="edit--section--list--item">
          <InputField
            label="Wait Time"
            placeholder="Is there a waiting list or wait time?"
            value={service.wait_time}
            setValue={value => handleChange('wait_time', value)}
          />
        </li>

        <li className="edit--section--list--item">
          <InputField
            label="Service&#39;s Website"
            placeholder="http://"
            value={service.url}
            setValue={value => handleChange('url', value)}
          />
        </li>

        <EditSchedule
          canInheritFromParent
          shouldInheritFromParent={service.shouldInheritScheduleFromParent}
          setShouldInheritFromParent={setShouldInheritScheduleFromParent}
          scheduleId={service.schedule.id}
          scheduleDaysByDay={service.scheduleObj}
          handleScheduleChange={value => handleChange('scheduleObj', value)}
        />

        <EditNotes
          notes={service.notes}
          handleNotesChange={value => handleChange('notesObj', value)}
        />

        <li className="edit--section--list--item">
          <MultiSelectDropdown
            selectedItems={service.categories}
            handleSelectChange={value => handleChange('categories', value)}
            label="Categories"
            optionsRoute="categories"
          />
        </li>
      </ul>
    </li>
  );
};

ProvidedService.propTypes = {
  service: PropTypes.shape({
    id: PropTypes.number,
    fee: PropTypes.string,
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
    shouldInheritScheduleFromParent: PropTypes.bool.isRequired,
  }).isRequired,
  handleDeactivation: PropTypes.func.isRequired,
  editServiceById: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default ProvidedService;
