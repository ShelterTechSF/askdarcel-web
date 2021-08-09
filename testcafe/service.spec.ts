import { ServicePageTestHelper } from './pages';
import EditResourcePage from './pages/EditResourcePage';

const servicePage = new ServicePageTestHelper();
const editResourcePage = new EditResourcePage();

// Define service id to navigate to
// Tests depend on service id
const serviceId = 1;
fixture`Service Page`
  // TODO: Dynamically find a service to test against
  .page(servicePage.url(serviceId));

const modifySheduleTime = async (t, action = 'add') => {
  // Navigate to edit page
  await t.navigateTo(editResourcePage.url(1));

  // Get the correct service and it's schedule
  const service = EditResourcePage.getService(serviceId);
  const { schedule } = service;

  if (action === 'add') {
    await t
      .navigateTo(editResourcePage.url(1))
      .click(schedule.tuesday.addButton)
      .typeText(schedule.tuesday.lastStart, '17:00')
      .typeText(schedule.tuesday.lastEnd, '18:00');
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
    .expect(servicePage.name.exists)
    .ok()

  // Description element should exist
    .expect(servicePage.description.exists)
    .ok()

  // Details element should exist
    .expect(servicePage.details.exists)
    .ok()

  // Print button should exist
    .expect(servicePage.printButton.exists)
    .ok()

  // Directions button should exist
    .expect(servicePage.directionsButton.exists)
    .ok();
});

test('Confirm Service Schedule Day Can Be Added', async t => {
  await servicePage.waitUntilPageLoaded(t);

  // Count the number of schedule days
  const originalScheduleDayCount = await servicePage.schedule.with({ boundTestRun: t }).count;

  await t.navigateTo(servicePage.url(serviceId));

  await modifySheduleTime(t, 'add');

  await t.navigateTo(servicePage.url(serviceId));
  await servicePage.waitUntilPageLoaded(t);
  await t
    .expect(servicePage.schedule.count)
    .eql(originalScheduleDayCount + 1);
});

// TODO: Uncomment with the completion of ISSUE #594
test.skip('Confirm Service Schedule Day Can Be Deleted', async t => {
  await servicePage.waitUntilPageLoaded(t);

  // Count the number of schedule days
  const originalScheduleDayCount = await servicePage.schedule.with({ boundTestRun: t }).count;

  await modifySheduleTime(t);

  await t.navigateTo(servicePage.url(serviceId));
  await servicePage.waitUntilPageLoaded(t);

  await modifySheduleTime(t, 'remove');

  await t.navigateTo(servicePage.url(serviceId));
  await servicePage.waitUntilPageLoaded(t);
  await t
    .expect(servicePage.schedule.count)
    .eql(originalScheduleDayCount - 1);
});
