import React from "react";
import EditNotes from "./EditNotes";
import EditSchedule from "./EditSchedule";
import MultiSelectDropdown from "./MultiSelectDropdown";
import FormTextArea from "./FormTextArea";
import { AddressListItem } from "./EditAddress";
import type { Schedule } from "../../models";
import type {
  InternalAddress,
  InternalFlattenedService,
  InternalTopLevelService,
} from "../../pages/OrganizationEditPage";

import s from "./ProvidedService.module.scss";

export interface InternalScheduleDay {
  opens_at: number | null;
  closes_at: number | null;
  /** The DB ID of the ScheduleDay. */
  id?: number | null;
  /** The DB ID of the Schedule that this ScheduleDay is attached to. */
  scheduleId?: number | null;
  openChanged?: boolean;
  closeChanged?: boolean;
}

/** Schedule model used internally on the Edit Page.
 *
 * The difference between the schedule that comes from the API and the schedule
 * that is saved as React UI state is that the UI state schedule's schema groups
 * ScheduleDays by day of week. This allows us to represent blank ScheduleDays
 * when a new, blank time is added but before an open time or a close time is
 * set. The API schedule schema does not support having a ScheduleDay that has
 * no open and close time but that is attached to a day of week. This feature is
 * required for the UI because the blank time needs to appear under a day of
 * week before an open and close time is set.
 *
 * We also have a number of extra fields on the InternalScheduleDay that keep
 * track of which properties have been edited and therefore need to be synced
 * back to the server.
 */
export interface InternalSchedule {
  Monday: InternalScheduleDay[];
  Tuesday: InternalScheduleDay[];
  Wednesday: InternalScheduleDay[];
  Thursday: InternalScheduleDay[];
  Friday: InternalScheduleDay[];
  Saturday: InternalScheduleDay[];
  Sunday: InternalScheduleDay[];
}

/** If the argument is either an InternalSchedule or an empty object, return
 *  true if it is an InternalSchedule.
 */
export function isEmptyInternalSchedule(
  schedule: InternalSchedule | Record<string, never>
): schedule is Record<string, never> {
  return !("Monday" in schedule);
}

/** Build UI state schedule from API schedule.
 *
 * Returns an InternalSchedule.
 */
const buildScheduleDays = (
  schedule: Schedule | { schedule_days: never[] } | undefined
): InternalSchedule => {
  const scheduleId = schedule && "id" in schedule ? schedule.id : null;
  const currSchedule: Partial<InternalSchedule> = {};

  const is24Hours = {
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  };

  const tempSchedule = {
    Monday: [{ opens_at: null, closes_at: null, scheduleId }],
    Tuesday: [{ opens_at: null, closes_at: null, scheduleId }],
    Wednesday: [{ opens_at: null, closes_at: null, scheduleId }],
    Thursday: [{ opens_at: null, closes_at: null, scheduleId }],
    Friday: [{ opens_at: null, closes_at: null, scheduleId }],
    Saturday: [{ opens_at: null, closes_at: null, scheduleId }],
    Sunday: [{ opens_at: null, closes_at: null, scheduleId }],
  };

  if (schedule) {
    schedule.schedule_days.forEach((day) => {
      const currDay = day.day;
      if (!is24Hours[currDay]) {
        // Check to see if any of the hour pairs for the day
        // indicate the resource/service is open 24 hours
        // if there is a pair only have that in the day obj
        if (day.opens_at === 0 && day.closes_at === 2359) {
          is24Hours[currDay] = true;
          // Since this record already exists in our DB, we only need the id
          // scheduleID is needed when creating no data
          currSchedule[currDay] = [
            { opens_at: 0, closes_at: 2359, id: day.id },
          ];
        } else {
          Object.assign(day, { openChanged: false, closeChanged: false });
          const currScheduleDay = currSchedule[currDay];
          if (currScheduleDay) {
            currScheduleDay.unshift(day);
          } else {
            currSchedule[day.day] = [day];
          }
        }
      }
    });
  }
  return { ...tempSchedule, ...currSchedule };
};
export { buildScheduleDays };

type InputFieldProps = {
  type?: string;
  label: React.ReactNode;
  placeholder: string;
  value?: string | null | undefined;
  setValue: (x: string) => void;
};
const InputField = ({
  type = "text",
  label,
  placeholder,
  value = "",
  setValue,
}: InputFieldProps) => (
  <>
    <label htmlFor="input">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value || ""}
      onChange={(evt) => setValue(evt.target.value)}
    />
  </>
);

type EditAddressesProps = {
  service: InternalFlattenedService;
  resourceAddresses: InternalAddress[];
  handleChange: <K extends keyof InternalTopLevelService>(
    field: K,
    value: InternalTopLevelService[K]
  ) => void;
};
const EditAddresses = ({
  service,
  resourceAddresses,
  handleChange,
}: EditAddressesProps) => {
  const selectableOptions = resourceAddresses.flatMap((address, handle) => {
    // Don't include addresses that have already been added to the service
    if (service.addressHandles.includes(handle)) {
      return [];
    }
    // Don't show addresses that have been marked for removal
    if (resourceAddresses[handle].isRemoved) {
      return [];
    }
    // HACK: Filter out any addresses that were just created on the Edit page
    // but have not been saved to the DB yet, since they do not have IDs and the
    // current create address API does not return the ID of the address, which
    // prevents other logic on the Edit page from functioning correctly.
    if (!("id" in resourceAddresses[handle])) {
      return [];
    }
    return [{ value: handle, label: address.name || address.address_1 }];
  });
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = parseInt(e.target.value, 10);
    handleChange("addressHandles", [...service.addressHandles, selectedValue]);
  };
  return (
    <li className="edit--section--list--item">
      <label>
        Location
        <select
          className={s.addressSelect}
          value=""
          onChange={handleSelectChange}
        >
          <option value="">Add location from organization</option>
          {selectableOptions.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <div className={s.addressList}>
        {service.addressHandles.map((handle, displayIndexMinusOne) => {
          const address = resourceAddresses[handle];
          return (
            <AddressListItem
              key={handle}
              displayIndex={displayIndexMinusOne + 1}
              address={address}
              onRemove={() =>
                handleChange(
                  "addressHandles",
                  service.addressHandles.filter((a) => a !== handle)
                )
              }
            />
          );
        })}
      </div>
    </li>
  );
};

const TEXT_AREAS = [
  {
    label: "Service Description",
    placeholder:
      "Describe what you'll receive from this service in a few sentences.",
    field: "long_description",
  },
  {
    label:
      "Service Short Description (NOTE: THIS FIELD IS CURRENTLY ONLY USED FOR SERVICES ON THE UCSF INTIMATE PARTNER VIOLENCE TILE. PLEASE DO NOT EDIT THIS UNLESS YOU ARE SPECIFICALLY UPDATING IT FOR THIS REASON.)",
    placeholder:
      "Describe what you'll receive from this service in a few sentences.",
    field: "short_description",
  },
  {
    label: "Application Process",
    placeholder: "How do you apply for this service?",
    field: "application_process",
  },
  {
    label: "Required Documents",
    placeholder: "What documents do you need to bring to apply?",
    field: "required_documents",
  },
  {
    // TODO: Make this a multiselectdropdown, create a new table in the DB for languages,
    //       and seed it with languages
    label: "Interpretation Services",
    placeholder: "What interpretation services do they offer?",
    field: "interpretation_services",
  },
] as const;

type ProvidedServiceProps = {
  editServiceById: (
    id: number,
    changes: Partial<InternalFlattenedService>
  ) => void;
  handleDeactivation: (type: "resource" | "service", id: number) => void;
  index: number;
  service: InternalFlattenedService;
  resourceAddresses: InternalAddress[];
};

const ProvidedService = ({
  editServiceById,
  handleDeactivation,
  index,
  service,
  resourceAddresses,
}: ProvidedServiceProps) => {
  const handleChange = <K extends keyof InternalTopLevelService>(
    field: K,
    value: InternalTopLevelService[K]
  ) => {
    const { id } = service;
    const valueChanged = service[field] !== value;

    if (valueChanged) {
      editServiceById(id, { id, [field]: value });
    }
  };

  const setShouldInheritScheduleFromParent = (shouldInherit: boolean) => {
    const { scheduleObj: scheduleDaysByDay } = service;

    let tempScheduleDays: InternalSchedule;

    if (shouldInherit) {
      // We perform the reduce() with a type of Partial<InternalSchedule>, since
      // we're building up the InternalSchedule day by day, but we know that
      // we'll have all the keys in the end, so we cast back to
      // InternalSchedule.
      const scheduleDaysByDayEntries = Object.entries(scheduleDaysByDay) as [
        keyof InternalSchedule,
        InternalFlattenedService[]
      ][];
      tempScheduleDays = scheduleDaysByDayEntries.reduce<
        Partial<InternalSchedule>
      >(
        (acc, [day, scheduleDays]) => ({
          ...acc,
          [day]: scheduleDays.map((scheduleDay) => ({
            ...scheduleDay,
            opens_at: null,
            closes_at: null,
            openChanged: true,
            closeChanged: true,
          })),
        }),
        {}
      ) as InternalSchedule;
    } else {
      tempScheduleDays = buildScheduleDays(service.schedule);
    }
    handleChange("shouldInheritScheduleFromParent", shouldInherit);
    handleChange("scheduleObj", tempScheduleDays);
  };

  return (
    <li id={`${service.id}`} className="edit--service edit--section">
      <header className="edit--section--header">
        <h4>{`Service ${index + 1}: ${service.name || "New Service"}`}</h4>
        <button
          className="remove-item"
          type="button"
          id="service--deactivation"
          onClick={() => handleDeactivation("service", service.id)}
        >
          Remove Service
        </button>
      </header>

      <ul className="edit--section--list">
        <li className="edit--section--list--item">
          <FormTextArea
            textareaClassName="edit-section-internal-note"
            label={
              <div>
                <p className="internal-note-label-text">
                  Internal Notes about Editing this Service
                </p>
                <p className="internal-note-label-subtext">
                  (These notes will NOT be displayed to users. They are for
                  internal use only, to help with content editing.)
                </p>
              </div>
            }
            placeholder="Add any info that future content editors should be aware of when updating this service. Adding dates to your notes will help with tracking changes."
            value={service.internal_note ?? ""}
            setValue={(value) => handleChange("internal_note", value)}
          />
        </li>

        <li className="edit--section--list--item">
          <InputField
            label="Name of the Service"
            placeholder="What is this service called?"
            value={service.name}
            setValue={(value) => handleChange("name", value)}
          />
        </li>

        <li className="edit--section--list--item">
          <InputField
            label="Nickname"
            placeholder="What it's known as in the community"
            value={service.alternate_name}
            setValue={(value) => handleChange("alternate_name", value)}
          />
        </li>

        <EditAddresses
          service={service}
          resourceAddresses={resourceAddresses}
          handleChange={handleChange}
        />

        <li key="email" className="edit--section--list--item email">
          <InputField
            type="email"
            label="Service E-Mail"
            placeholder="Email address for this service"
            value={service.email}
            setValue={(value) => handleChange("email", value)}
          />
        </li>

        {TEXT_AREAS.map((textArea) => (
          <li className="edit--section--list--item" key={textArea.field}>
            <FormTextArea
              label={textArea.label}
              placeholder={textArea.placeholder}
              value={service[textArea.field] ?? ""}
              setValue={(value) => handleChange(textArea.field, value)}
            />
          </li>
        ))}

        <li className="edit--section--list--item">
          <FormTextArea
            label="Clinician Actions (Include any COVID Actions)"
            placeholder="Add a list of actions to be taken by clinician and/or client prior to providing service referral (markdown is supported)"
            value={service.instructions?.[0]?.instruction ?? ""}
            setValue={(value) =>
              handleChange("instructions", [
                {
                  id: service.instructions?.[0]?.id ?? -2,
                  service_id: service.id,
                  instruction: value,
                },
              ])
            }
          />
        </li>

        <li className="edit--section--list--item">
          <MultiSelectDropdown
            selectedItems={service.eligibilities}
            handleSelectChange={(value) => handleChange("eligibilities", value)}
            label="Eligibility"
            optionsRoute="eligibilities"
          />
        </li>

        <li className="edit--section--list--item">
          <InputField
            label="Cost"
            placeholder="How much does this service cost?"
            value={service.fee}
            setValue={(value) => handleChange("fee", value)}
          />
        </li>

        <li className="edit--section--list--item">
          <InputField
            label="Wait Time"
            placeholder="Is there a waiting list or wait time?"
            value={service.wait_time}
            setValue={(value) => handleChange("wait_time", value)}
          />
        </li>

        <li className="edit--section--list--item">
          <InputField
            label="Service&#39;s Website"
            placeholder="http://"
            value={service.url}
            setValue={(value) => handleChange("url", value)}
          />
        </li>

        <EditSchedule
          canInheritFromParent
          shouldInheritFromParent={service.shouldInheritScheduleFromParent}
          setShouldInheritFromParent={setShouldInheritScheduleFromParent}
          scheduleId={
            "id" in service.schedule ? service.schedule.id : undefined
          }
          scheduleDaysByDay={service.scheduleObj}
          handleScheduleChange={(value) => handleChange("scheduleObj", value)}
        />

        <EditNotes
          notes={service.notes}
          handleNotesChange={(value) => handleChange("notesObj", value)}
        />

        <li className="edit--section--list--item">
          <MultiSelectDropdown
            selectedItems={service.categories}
            handleSelectChange={(value) => handleChange("categories", value)}
            label="Categories"
            optionsRoute="categories"
          />
        </li>
      </ul>
    </li>
  );
};

export default ProvidedService;
