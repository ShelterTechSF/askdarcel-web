import config from './config';
import SearchPage from './pages/SearchPage';

const searchPage = new SearchPage();

fixture `Listings Page`
  .page `${config.baseUrl}/resources?categoryid=234`;

test('Confirm listings page describes resources/services correctly', async t => {
  const numResults = '1 Total Results';
  const walkingDistance = ' walking';
  const resourceName = 'A Test Resource';
  const serviceName = 'A Test Service';
  const serviceDesc = 'I am a long description of a resource.';
  const hoursRegEx = /\bOpen until .*M|Closed\b/;
  await t
       .expect(searchPage.resultsCount.textContent)
       .contains(numResults)

       .expect(searchPage.firstResultName.textContent)
       .contains(resourceName)

       .expect(searchPage.firstResultAddress.textContent)
       .contains(walkingDistance)

       .expect(searchPage.firstServiceName.textContent)
       .contains(serviceName)

       .expect(searchPage.firstServiceDesc.textContent)
       .contains(serviceDesc)

       .expect(searchPage.openHours.textContent)
       .match(hoursRegEx)
  ;
});
