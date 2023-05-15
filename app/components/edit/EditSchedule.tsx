import React, { Component } from "react";
import EditScheduleDay from "./EditScheduleDay";
import type { InternalSchedule, InternalScheduleDay } from "./ProvidedService";

import "./EditSchedule.scss";

type Props = {
  scheduleDaysByDay: InternalSchedule;
  canInheritFromParent: boolean;
  shouldInheritFromParent: boolean;
  setShouldInheritFromParent?: (shouldInherit: boolean) => void;
  handleScheduleChange: (scheduleObj: InternalSchedule) => void;
  scheduleId: number | undefined;
};

class EditSchedule extends Component<Props> {
  setScheduleDaysForDay = (
    day: keyof InternalSchedule,
    scheduleDays: InternalScheduleDay[]
  ) => {
    const { handleScheduleChange, scheduleDaysByDay } = this.props;
    handleScheduleChange({
      ...scheduleDaysByDay,
      [day]: scheduleDays,
    });
  };

  render() {
    // This component is shared between organizations and services. Organizations
    // are top level, and cannot inherit schedules. OTOH Services can inherit
    // their schedule from their parent organization. This prop controls this
    // difference in behavior.
    const {
      canInheritFromParent,
      scheduleDaysByDay,
      scheduleId,
      setShouldInheritFromParent,
      shouldInheritFromParent,
    } = this.props;
    return (
      <li key="hours" className="edit--section--list--item hours">
        <span className="label">Hours</span>
        {canInheritFromParent && (
          <div className="inherit-schedule">
            <label htmlFor="inherit" className="inline-checkbox">
              <input
                id="inherit"
                className="input-checkbox"
                type="checkbox"
                checked={shouldInheritFromParent}
                onChange={() => {
                  if (!setShouldInheritFromParent)
                    throw new Error(
                      "setShouldInheritFromParent was undefined, but it must be defined if canInheritFromParent is true"
                    );
                  setShouldInheritFromParent(!shouldInheritFromParent);
                }}
              />
              Inherit schedule from parent organization
            </label>
          </div>
        )}
        {!shouldInheritFromParent && (
          <div>
            <span className="label open-24-label">24 hrs?</span>
            <ul className="edit-hours-list">
              {Object.entries(scheduleDaysByDay).map((entry) => {
                // TypeScript cannot infer the precise types of `day` and
                // `scheduleDays`, since `Object.entries()` may return more
                // properties than we were expecting. This should be replaced
                // with a type-specific iterator, where we only iterate over
                // keys that we expect.
                const [day, scheduleDays] = entry as [
                  keyof InternalSchedule,
                  InternalScheduleDay[]
                ];
                return (
                  <EditScheduleDay
                    key={day}
                    day={day}
                    scheduleId={scheduleId}
                    scheduleDays={scheduleDays}
                    setScheduleDays={(newScheduleDays) =>
                      this.setScheduleDaysForDay(day, newScheduleDays)
                    }
                  />
                );
              })}
            </ul>
          </div>
        )}
      </li>
    );
  }
}

export default EditSchedule;
