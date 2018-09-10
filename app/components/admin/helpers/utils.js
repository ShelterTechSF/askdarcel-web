export default {
  getScheduleChanges(changeRequest) {
    const { resource, field_changes } = changeRequest;
    const day = field_changes.find(change => change.field_name === 'day');
    const current_value = resource.schedule.schedule_days
      .find(current => day.field_value === current.day);
    const opens_at = field_changes.find(change => change.field_name === 'opens_at');
    const closes_at = field_changes.find(change => change.field_name === 'closes_at');
    const opened_at = opens_at ? current_value.opens_at : undefined;
    const closed_at = closes_at ? current_value.closes_at : undefined;

    return {
      day: day.field_value,
      opens_at: opens_at ? opens_at.field_value : current_value.opens_at,
      closes_at: closes_at ? closes_at.field_value : current_value.closes_at,
      opened_at,
      closed_at,
    };
  },
};
