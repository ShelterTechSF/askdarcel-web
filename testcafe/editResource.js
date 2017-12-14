import config from './config';
import ResourcePage from './pages/ResourcePage';
import EditPage from './pages/EditPage';

const resourcePage = new ResourcePage();
const editPage = new EditPage();

fixture `Edit Resource`
  .page `${config.baseUrl}/resource?id=1`;

test('Edit resource name', async t => {
  const newName = 'New Resource Name';
  await t
    .click(resourcePage.editButton)
    .typeText(editPage.name, newName, { replace: true })
    .click(editPage.saveButton)
    .expect(resourcePage.resourceName.textContent).contains(newName)
    ;
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
  }
  // TODO: Some fields are not displayed on the show page
  const notVisibleOnShowPage = ['address3', 'address4', 'country'];

  // Make edits
  await t.click(resourcePage.editButton);
  for (const prop in newProps) {
    await t.typeText(editPage.address[prop], newProps[prop], { replace: true });
  }
  await t.click(editPage.saveButton);

  // Check visibility of edits on show page
  for (const prop in newProps) {
    if (notVisibleOnShowPage.includes(prop)) continue;
    await t.expect(resourcePage.address.textContent).contains(newProps[prop]);
  }

  // Check visibility of edits on edit page
  await t.click(resourcePage.editButton);
  for (const prop in newProps) {
    await t.expect(editPage.address[prop].value).eql(newProps[prop]);
  }
});


test('Edit resource phone number', async t => {
  const newNumber = '415-555-5555';
  const newFormattedNumber = '(415) 555-5555';
  const newServiceType = 'Main number';

  // Make edits
  await t.click(resourcePage.editButton);
  const phone = editPage.getPhone(0);
  await t
    .typeText(phone.number, newNumber, { replace: true })
    .typeText(phone.serviceType, newServiceType, { replace: true })
    .click(editPage.saveButton)
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
    .click(editPage.addPhoneButton)
    ;
  const phone = editPage.getPhone(-1);
  await t
    .typeText(phone.number, newNumber, { replace: true })
    .typeText(phone.serviceType, newServiceType, { replace: true })
    .click(editPage.saveButton)
    ;

  // Check visibility of edits on show page
  await t
    .expect(resourcePage.phones.parent().textContent).contains(newFormattedNumber)
    .expect(resourcePage.phones.parent().textContent).contains(newServiceType)
    .expect(resourcePage.phones.count).eql(originalCount + 1)
    ;
});
