import NewResourcePage from './pages/NewResourcePage';
import ResourcePage from './pages/ResourcePage';

const newResourcePage = new NewResourcePage();

fixture`Add New Resource`
  .page(NewResourcePage.url());

test('Add new resource, basic', async t => {
  const newName = 'New Resource Name';

  // TODO: These are all currently required, but should they be?
  const newAddress = {
    address1: '123 Fake St.',
    city: 'San Francisco',
    stateOrProvince: 'CA',
    country: 'United States',
    postalCode: '94110',
  };

  await t.typeText(newResourcePage.name, newName, { replace: true });
  await Object.keys(newAddress).reduce(
    (_t, prop) => _t.typeText(newResourcePage.address[prop], newAddress[prop], { replace: true }),
    t,
  );

  function dialogHandler(type, text) {
    if (!text.includes('Resource successfuly created')) {
      throw new Error(`Got unexpected dialog: ${text}`);
    }
  }
  await t.setNativeDialogHandler(dialogHandler)
    .click(newResourcePage.saveButton)
    .setNativeDialogHandler(null);
  const dialogHistory = await t.getNativeDialogHistory();
  await t.expect(dialogHistory.length).eql(1);

  // Get resource page
  const resourcePage = new ResourcePage();

  // Ensure resource name is correct
  await t.expect(resourcePage.resourceName.textContent).eql(newName);

  // Ensure resource address is correct
  await t.expect(resourcePage.address.textContent).contains(newAddress.address1);
  await t.expect(resourcePage.address.textContent).contains(newAddress.city);
  await t.expect(resourcePage.address.textContent).contains(newAddress.stateOrProvince);
  await t.expect(resourcePage.address.textContent).contains(newAddress.postalCode);
});
