import NewResourcePage from './pages/NewResourcePage';

const newResourcePage = new NewResourcePage();

fixture `Add New Resource`
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
  await Promise.all(
    Object.keys(newAddress)
    .map(prop => t.typeText(newResourcePage.address[prop], newAddress[prop], { replace: true })),
  );

  function dialogHandler(type, text) {
    if (!text.includes('Resource successfuly created')) {
      throw new Error(`Got unexpected dialog: ${text}`);
    }
  }
  await t.setNativeDialogHandler(dialogHandler)
    .click(newResourcePage.saveButton)
    .setNativeDialogHandler(null)
  ;

  const dialogHistory = await t.getNativeDialogHistory();
  await t.expect(dialogHistory.length).eql(1);

  // TODO: Check that the View Resource page has the correct info, but since the
  // Create New Resource page currently takes you to the home page, it's hard to
  // navigate to the View Resource page.
});
