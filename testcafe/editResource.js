import ResourcePage from './pages/ResourcePage';
import EditResourcePage from './pages/EditResourcePage';
import ServicePage from './pages/ServicePage';

const resourcePage = new ResourcePage();
const editResourcePage = new EditResourcePage();
const servicePage = new ServicePage();

fixture`Edit Resource`
  .page(ResourcePage.url(1));

async function testEditTextProperty(t, showPageSelector, editPageSelector, newValue) {
  await t
    .navigateTo(editResourcePage.url(1))
    .typeText(editPageSelector, newValue, { replace: true })
    .click(editResourcePage.saveButton)
    .expect(showPageSelector.textContent)
    .contains(newValue);
}

test('Edit resource name', async t => {
  await testEditTextProperty(t, resourcePage.resourceName, editResourcePage.name, 'New Resource Name');
});

test('Edit resource address', async t => {
  await t.navigateTo(editResourcePage.url(1));

  const newProps = {
    name: 'Main HQ',
    address1: '123 Fake St.',
    address2: 'Suite 456',
    city: 'Springfield',
    stateOrProvince: 'Illinois',
    postalCode: '62701',
  };

  // Make edits
  await t.click(EditResourcePage.getAddressEditButton(0));
  await Object.keys(newProps).reduce(
    (_t, prop) => _t.typeText(
      editResourcePage.addressModal[prop],
      newProps[prop],
      { replace: true },
    ),
    t,
  );
  await t.click(editResourcePage.addressModal.saveButton);
  await t.click(editResourcePage.saveButton);

  // Check visibility of edits on show page
  await Object.keys(newProps)
    .reduce(
      (_t, prop) => _t.expect(resourcePage.address.textContent).contains(newProps[prop]),
      t,
    );

  await t.navigateTo(editResourcePage.url(1));

  // Check visibility of edits on edit page
  await t.click(EditResourcePage.getAddressEditButton(0));
  await Object.keys(newProps).reduce(
    (_t, prop) => _t.expect(editResourcePage.addressModal[prop].value).eql(newProps[prop]),
    t,
  );
});

test('Edit resource phone number', async t => {
  const newNumber = '415-555-5555';
  const newFormattedNumber = '(415) 555-5555';
  const newServiceType = 'Main number';

  // Make edits
  const phone = EditResourcePage.getPhone(0);
  await t
    .navigateTo(editResourcePage.url(1))
    .typeText(phone.number, newNumber, { replace: true })
    .typeText(phone.serviceType, newServiceType, { replace: true })
    .click(editResourcePage.saveButton);

  // Check visibility of edits on show page
  await t
    .expect(resourcePage.phones.parent().textContent).contains(newFormattedNumber)
    .expect(resourcePage.phones.parent().textContent).contains(newServiceType);
});

test('Add resource phone number', async t => {
  const newNumber = '415-555-5556';
  const newFormattedNumber = '(415) 555-5556';
  const newServiceType = 'Added number';

  // Wait for page to load before counting phone numbers by using hover action.
  await t.hover(resourcePage.phones);
  const originalCount = await resourcePage.phones.with({ boundTestRun: t }).count;

  // Make edits
  await t
    .navigateTo(editResourcePage.url(1))
    .click(editResourcePage.addPhoneButton);
  const phone = EditResourcePage.getPhone(-1);
  await t
    .typeText(phone.number, newNumber, { replace: true })
    .typeText(phone.serviceType, newServiceType, { replace: true })
    .click(editResourcePage.saveButton);

  // Check visibility of edits on show page
  await t
    .expect(resourcePage.phones.parent().textContent).contains(newFormattedNumber)
    .expect(resourcePage.phones.parent().textContent).contains(newServiceType)
    .expect(resourcePage.phones.count)
    .eql(originalCount + 1);
});

test('Delete resource phone number', async t => {
  await t.hover(resourcePage.phones);
  const originalCount = await resourcePage.phones.with({ boundTestRun: t }).count;

  await t
    .navigateTo(editResourcePage.url(1))
    .click(editResourcePage.deletePhoneButton)
    .click(editResourcePage.saveButton);
  await t
    .expect(resourcePage.phones.count)
    .eql(originalCount - 1);
});

test('Edit resource website', async t => {
  await testEditTextProperty(
    t,
    resourcePage.website,
    editResourcePage.website,
    'http://www.example.com/',
  );
});

test('Edit resource email', async t => {
  await testEditTextProperty(
    t,
    resourcePage.email,
    editResourcePage.email,
    'example@example.com',
  );
});

test('Edit resource description', async t => {
  await testEditTextProperty(
    t,
    resourcePage.description,
    editResourcePage.description,
    'This is my new description',
  );
});

test('Add Resource Note', async t => {
  const newNote = 'A new note has been added';

  // Wait for page to load before counting phone Notes by using hover action.
  await t.hover(resourcePage.noteContainer);

  const originalCount = await resourcePage.notes.with({ boundTestRun: t }).count;

  // Make edits
  await t
    .navigateTo(editResourcePage.url(1))
    .click(editResourcePage.addNoteButton);
  // create
  const note = EditResourcePage.getResourceNote(-1);
  await t
    .typeText(note.content, newNote, { replace: true })
    .click(editResourcePage.saveButton);

  // Check visibility of edits on show page
  await t
    .expect(resourcePage.notes.parent().textContent).contains(newNote)
    .expect(resourcePage.notes.count)
    .eql(originalCount + 1);
});

// NOTE: If the `Add Resource Note` test fails, this test will fail
// because it depends on the above test to create a note
// TODO: Update seeded data to include a note initially to decouple
// tests
test('Edit Resource Note', async t => {
  const newNote = 'Modified Note Text';

  // Wait for page to load before counting phone Notes by using hover action.
  await t.navigateTo(editResourcePage.url(1));

  // Make edits
  const note = EditResourcePage.getResourceNote(0);
  await t
    .typeText(note.content, newNote, { replace: true })
    .click(editResourcePage.saveButton);

  // Check visibility of edits on show page
  await t
    .expect(resourcePage.notes.parent().textContent).contains(newNote);
});

// NOTE: If the `Add Resource Note` test fails, this test will fail
// because it depends on the above test to create a note
// TODO: Update seeded data to include a note initially to decouple
// tests
test('Delete Resource Note', async t => {
  // Wait for page to load before counting phone Notes by using hover action.
  await t.hover(resourcePage.notes);
  const originalCount = await resourcePage.notes.with({ boundTestRun: t }).count;

  await t
    .navigateTo(editResourcePage.url(1))
    .click(editResourcePage.deleteNoteButton)
    .click(editResourcePage.saveButton);
  await t
    .expect(resourcePage.notes.count)
    .eql(originalCount - 1);
});

test('Add new service', async t => {
  const SERVICE_DATA = {
    NAME: 'Test Service',
    NICKNAME: 'Best Service',
    EMAIL: '1800bestservice@best.com',
    DESCRIPTION: 'I go here when I want the best best service.',
    APP_PROCESS: 'Walk in and ask for assistance',
    REQ_DOCS: 'No ID required',
    INTERP_SERVICES: 'ASL provided',
    COST: 'Free',
    WAIT_TIME: 'N/A',
    WEBSITE: 'https://bestservice.com',
  };

  // Wait for page to load by using hover action.
  await t.navigateTo(editResourcePage.url(1));

  // Navigate to edit page

  // Wait for page to load before counting services by using hover action.
  await t.hover(editResourcePage.addServiceButton);
  // Count the number of services
  const originalServiceCount = await editResourcePage.services.with({ boundTestRun: t }).count;

  // Add a service
  await t
    .click(editResourcePage.addServiceButton);

  // Check edit resource page
  await t
    .expect(editResourcePage.services.count)
    .eql(originalServiceCount + 1);

  // Save and check resource page
  // Normally TestCafe will automatically scroll to an element that it needs to
  // interact with, but when it scrolls *up*, it won't scroll up far enough and
  // the sticky nav will end up obscuring the element. We force TestCafe to
  // scroll to the top of the page before asking it to enter text into the new
  // service name field so that it scrolls *down*.
  await t.eval(() => window.scrollTo(0, 0));

  // Fill out new service information
  const {
    name,
    nickname,
    email,
    description,
    appProcess,
    requiredDocs,
    interpServices,
    cost,
    waitTime,
    website,
  } = editResourcePage.newService;

  await t
    .typeText(name, SERVICE_DATA.NAME, { replace: true })
    .typeText(nickname, SERVICE_DATA.NICKNAME, { replace: true })
    .typeText(email, SERVICE_DATA.EMAIL, { replace: true })
    .typeText(description, SERVICE_DATA.DESCRIPTION, { replace: true })
    .typeText(appProcess, SERVICE_DATA.APP_PROCESS, { replace: true })
    .typeText(requiredDocs, SERVICE_DATA.REQ_DOCS, { replace: true })
    .typeText(interpServices, SERVICE_DATA.INTERP_SERVICES, { replace: true })
    .typeText(cost, SERVICE_DATA.COST, { replace: true })
    .typeText(waitTime, SERVICE_DATA.WAIT_TIME, { replace: true })
    .typeText(website, SERVICE_DATA.WEBSITE, { replace: true })
    .click(editResourcePage.saveButton);

  // New service should exist in services list
  await t
    .expect(resourcePage.services.count)
    .eql(originalServiceCount + 1);

  // Click on new service to navigate to service page
  await t
    .click(resourcePage.servicesHeader);

  // Test services page
  // Name should be displayed
  await t.expect(servicePage.name.textContent).eql(SERVICE_DATA.NAME);
  // Email should be displayed
  await t.expect(servicePage.email.textContent).eql(SERVICE_DATA.EMAIL);
  // Description should be displayed
  await t.expect(servicePage.description.textContent).eql(SERVICE_DATA.DESCRIPTION);
  // Application process should be displayed
  await t.expect(servicePage.appProcess.textContent).eql(SERVICE_DATA.APP_PROCESS);
  // Required Documents should be displayed
  await t.expect(servicePage.requiredDocs.textContent).eql(SERVICE_DATA.REQ_DOCS);
  // Cost should be displayed
  await t.expect(servicePage.cost.textContent).eql(SERVICE_DATA.COST);
});

test('Delete a service', async t => {
  // Wait for page to load before counting services by using hover action.
  await t.hover(resourcePage.services);

  // Count the number of services
  const originalServiceCount = await resourcePage.services.with({ boundTestRun: t }).count;

  // Navigate to edit page and delete the last service
  await t
    .navigateTo(editResourcePage.url(1))
    .setNativeDialogHandler(() => true)
    .click(editResourcePage.removeFirstServiceButton);

  // Wait for page to load before counting services by using hover action.
  await t
    .hover(editResourcePage.addServiceButton)
    .click(editResourcePage.saveButton);

  // Test
  await t
    .expect(resourcePage.services.count)
    .eql(originalServiceCount - 1);
});
