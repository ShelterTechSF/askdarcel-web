import config from './config';
import SearchPage from './pages/SearchPage';

const searchPage = new SearchPage();

// Test_Category_Top_Level is part of the rake db:populate fixtures
fixture`Listings Page`
  .page`${config.baseUrl}/search?refinementList[categories][0]=Test_Category_Top_Level`;

test('Confirm listings page describes resources/services correctly', async (t) => {
  const organizationName = 'A Test Resource';
  const organizationDesc = 'I am a long description of a resource.';
  const serviceName = 'A Test Service';
  const serviceDesc = 'I am a long description of a service.';
  // const hoursRegEx = /\bOpen until .*M|Closed\b/;
  await t
    // TODO fix flaky assertion
    // .expect(searchPage.searchRows.count)
    // .eql(4) // One for the resource, one for the service

    .expect(searchPage.firstOrganizationName.textContent)
    .contains(organizationName)

    .expect(searchPage.firstOrganizationDesc.textContent)
    .contains(organizationDesc)

    .expect(searchPage.firstServiceName.textContent)
    .contains(serviceName)

    .expect(searchPage.firstServiceDesc.textContent)
    .contains(serviceDesc);

  // TODO: Uncomment once service hours are back
  // .expect(searchPage.openHours.textContent)
  // .match(hoursRegEx)
});
