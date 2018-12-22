import ServicePage from './pages/ServicePage';
import EditResourcePage from './pages/EditResourcePage';

const servicePage = new ServicePage();
const editResourcePage = new EditResourcePage();

// Define service id to navigate to
// Tests depend on service id
const serviceId = 5;
fixture `Service Page`
  // TODO: Dynamically find a service to test against
  .page(servicePage.url(serviceId));

const modifySheduleTime = async (t, action = 'add') => {
  // Click edit service button
  await t
    .click(servicePage.editButton);

  // Get the correct service and it's schedule
  const service = EditResourcePage.getService(serviceId);
  const schedule = service.schedule;

  if (action === 'add') {
    await t
      .click(schedule.tuesday.addButton)
      .typeText(schedule.tuesday.lastStart, '17:00')
      .typeText(schedule.tuesday.lastEnd, '18:00')
      ;
  } else if (action === 'remove') {
    await t
      .click(schedule.tuesday.removeButton);
  }

  // Test that there is one more day added
  return t.click(editResourcePage.saveButton);
};

test('Confirm Page Loads with Information', async t => {
  await t
        // Name element should exist
        .expect(servicePage.serviceName.exists)
        .ok()

        // Description element should exist
        .expect(servicePage.description.exists)
        .ok()

        // Details element should exist
        .expect(servicePage.details.exists)
        .ok()

        // Edit button should exist
        .expect(servicePage.editButton.exists)
        .ok()

        // Print button should exist
        .expect(servicePage.printButton.exists)
        .ok()

        // Directions button should exist
        .expect(servicePage.directionsButton.exists)
        .ok()
  ;
});

test('Confirm Service Schedule Day Can Be Added', async t => {
  // Wait for page to load before counting services by using hover action.
  await t.hover(servicePage.editButton);

  // Count the number of schedule days
  const originalScheduleDayCount = await servicePage.schedule.with({ boundTestRun: t }).count;

  await modifySheduleTime(t);

  await t
    .navigateTo(servicePage.url(serviceId))
    .hover(servicePage.editButton)
    .expect(servicePage.schedule.count)
    .eql(originalScheduleDayCount + 1)
    ;
});

// TODO: Uncomment with the completion of ISSUE #594
test.skip('Confirm Service Schedule Day Can Be Deleted', async t => {
  // Wait for page to load before counting services by using hover action.
  await t.hover(servicePage.editButton);

  // Count the number of schedule days
  const originalScheduleDayCount = await servicePage.schedule.with({ boundTestRun: t }).count;

  await modifySheduleTime(t);

  await t
    .navigateTo(servicePage.url(serviceId))
    .hover(servicePage.editButton);

  await modifySheduleTime(t, 'remove');

  await t
    .navigateTo(servicePage.url(serviceId))
    .hover(servicePage.editButton)
    .expect(servicePage.schedule.count)
    .eql(originalScheduleDayCount - 1)
    ;
});
