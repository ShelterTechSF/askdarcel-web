import ResourcePage from './pages/ResourcePage';
import EditResourcePage from './pages/EditResourcePage';

const resourcePage = new ResourcePage();
const editResourcePage = new EditResourcePage();

fixture `Edit Resource`
  .page(ResourcePage.url(1));


async function testEditTextProperty(t, showPageSelector, editPageSelector, newValue) {
  await t
    .click(resourcePage.editButton)
    .typeText(editPageSelector, newValue, { replace: true })
    .click(editResourcePage.saveButton)
    .expect(showPageSelector.textContent)
    .contains(newValue)
    ;
}

test('Edit resource name', async t => {
  await testEditTextProperty(t, resourcePage.resourceName, editResourcePage.name, 'New Resource Name');
});


test('Edit resource address', async t => {
  const newProps = {
    address1: '123 Fake St.',
    address2: 'Suite 456',
    address3: 'Room 789',
    address4: 'Desk 10',
    city: 'Springfield',
    stateOrProvince: 'Illinois',
    country: 'United States',
    postalCode: '62701',
  };
  // TODO: Some fields are not displayed on the show page
  const notVisibleOnShowPage = ['address3', 'address4', 'country'];

  // Make edits
  await t.click(resourcePage.editButton);
  await Promise.all(
    Object.keys(newProps)
    .map(prop => t.typeText(editResourcePage.address[prop], newProps[prop], { replace: true })),
  );
  await t.click(editResourcePage.saveButton);

  // Check visibility of edits on show page
  await Promise.all(
    Object.keys(newProps)
    .filter(prop => !notVisibleOnShowPage.includes(prop))
    .map(prop => t.expect(resourcePage.address.textContent).contains(newProps[prop])),
  );

  // Check visibility of edits on edit page
  await t.click(resourcePage.editButton);
  await Promise.all(Object.keys(newProps).map(
    prop => t.expect(editResourcePage.address[prop].value).eql(newProps[prop]),
  ));
});


test('Edit resource phone number', async t => {
  const newNumber = '415-555-5555';
  const newFormattedNumber = '(415) 555-5555';
  const newServiceType = 'Main number';

  // Make edits
  await t.click(resourcePage.editButton);
  const phone = EditResourcePage.getPhone(0);
  await t
    .typeText(phone.number, newNumber, { replace: true })
    .typeText(phone.serviceType, newServiceType, { replace: true })
    .click(editResourcePage.saveButton)
    ;

  // Check visibility of edits on show page
  await t
    .expect(resourcePage.phones.parent().textContent).contains(newFormattedNumber)
    .expect(resourcePage.phones.parent().textContent).contains(newServiceType)
    ;
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
    .click(resourcePage.editButton)
    .click(editResourcePage.addPhoneButton)
    ;
  const phone = EditResourcePage.getPhone(-1);
  await t
    .typeText(phone.number, newNumber, { replace: true })
    .typeText(phone.serviceType, newServiceType, { replace: true })
    .click(editResourcePage.saveButton)
    ;

  // Check visibility of edits on show page
  await t
    .expect(resourcePage.phones.parent().textContent).contains(newFormattedNumber)
    .expect(resourcePage.phones.parent().textContent).contains(newServiceType)
    .expect(resourcePage.phones.count)
    .eql(originalCount + 1)
    ;
});

test('Delete resource phone number', async t => {
  await t.hover(resourcePage.phones);
  const originalCount = await resourcePage.phones.with({ boundTestRun: t }).count;

  await t
    .click(resourcePage.editButton)
    .click(editResourcePage.deletePhoneButton)
    .click(editResourcePage.saveButton)
    ;

  await t
    .expect(resourcePage.phones.count)
    .eql(originalCount - 1)
    ;
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

test('Add new service', async t => {
  // Navigate to edit page
  await t
    .click(resourcePage.editButton);

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
  await t
    .typeText(editResourcePage.newServiceName, 'Test Service', { replace: true })
    .click(editResourcePage.saveButton)
    .expect(resourcePage.services.count)
    .eql(originalServiceCount + 1);
});

test('Delete a service', async t => {
  // Wait for page to load before counting services by using hover action.
  await t
    .hover(resourcePage.editButton);

  // Count the number of services
  const originalServiceCount = await resourcePage.services.with({ boundTestRun: t }).count;

  // Navigate to edit page and delete the last service
  await t
    .click(resourcePage.editButton)
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
