import NewResourcePage from './pages/NewResourcePage';
import ResourcePage from './pages/ResourcePage';

const newResourcePage = new NewResourcePage();

fixture`Add New Resource`.page(NewResourcePage.url());

test('Add new resource, basic', async (t) => {
  // TODO: Currently, all that is required is a name and an address
  // what should the minimum data be for a new resource?
  const data = {
    name: 'New Resource Name',
    address: {
      address1: '123 Fake St.',
      city: 'San Francisco',
      stateOrProvince: 'CA',
      postalCode: '94110',
    },
    phone: {
      number: '1234567890',
      type: 'LandLine',
    },
    website: 'https://theBestResource.best',
    email: 'theBestResource1337@aol.com',
    description: 'A description of this resource',
    note: 'A new note about this resource',
  };

  // Add name
  await t.typeText(newResourcePage.name, data.name, { replace: true });

  // Add address
  await t.click(newResourcePage.addAddressButton);
  await Object.keys(data.address).reduce(
    (_t, prop) =>
      _t.typeText(newResourcePage.addressModal[prop], data.address[prop], {
        replace: true,
      }),
    t
  );
  await t.click(newResourcePage.addressModal.saveButton);

  // Add phone
  await t.click(newResourcePage.addPhoneButton);
  const phone = NewResourcePage.getPhone(-1);
  await t
    .typeText(phone.number, data.phone.number, { replace: true })
    .typeText(phone.serviceType, data.phone.type, { replace: true });

  // Add website
  await t.typeText(newResourcePage.website, data.website, { replace: true });

  // Add email
  await t.typeText(newResourcePage.email, data.email, { replace: true });

  // Add description
  await t.typeText(newResourcePage.description, data.description, {
    replace: true,
  });

  // Add note
  await t.click(newResourcePage.addNoteButton);
  const note = NewResourcePage.getResourceNote(-1);
  await t.typeText(note.content, data.note, { replace: true });

  // Save data
  function dialogHandler(type, text) {
    if (!text.includes('Resource successfuly created')) {
      throw new Error(`Got unexpected dialog: ${text}`);
    }
  }
  await t
    .setNativeDialogHandler(dialogHandler)
    .click(newResourcePage.saveButton)
    .setNativeDialogHandler(null);
  const dialogHistory = await t.getNativeDialogHistory();

  // Tests
  await t.expect(dialogHistory.length).eql(1);

  // Get resource page
  const resourcePage = new ResourcePage();

  // Ensure resource name is correct
  await t.expect(resourcePage.resourceName.textContent).eql(data.name);

  // Ensure resource address is correct
  await t
    .expect(resourcePage.address.textContent)
    .contains(data.address.address1);
  await t.expect(resourcePage.address.textContent).contains(data.address.city);
  await t
    .expect(resourcePage.address.textContent)
    .contains(data.address.stateOrProvince);
  await t
    .expect(resourcePage.address.textContent)
    .contains(data.address.postalCode);

  // Ensure resource phone is correct
  await t
    .expect(resourcePage.phones.parent().textContent)
    .contains(data.phone.number)
    .expect(resourcePage.phones.parent().textContent)
    .contains(data.phone.type);

  // Ensure resource website is correct
  await t.expect(resourcePage.website.textContent).eql(data.website);

  // Ensure resource email is correct
  await t.expect(resourcePage.email.textContent).eql(data.email);

  // Ensure resource description is correct
  await t.expect(resourcePage.description.textContent).eql(data.description);

  // TODO: Uncomment test with the fix of https://github.com/ShelterTechSF/askdarcel-api/issues/449
  // Ensure resource note is correct
  // await t.expect(resourcePage.notes.parent().textContent).eql(data.note);
});
