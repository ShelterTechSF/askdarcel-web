import ServicePage from './pages/ServicePage';

const servicePage = new ServicePage();

fixture `Service Page`
  // TODO: Dynamically find a service to test against
  .page(servicePage.url(1));

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
