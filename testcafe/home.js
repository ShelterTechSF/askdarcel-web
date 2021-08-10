import config from './config';
import FindPage from './pages/FindPage';
import SearchPage from './pages/SearchPage';
// import ResourcePage from './pages/ResourcePage';

const findPage = new FindPage();
const searchPage = new SearchPage();
// const resourcePage = new ResourcePage();

fixture`Home Page`
  .page`${config.baseUrl}`;

// TODO: Investigate why this is failing
// test('Basic navigation test', async (t) => {
//   await t
//     .click(findPage.categoryButton.withText('Food'))
//     .expect(searchPage.resultsCount.textContent).contains('Total Results')
//     .click(searchPage.resultEntry)
//     .expect(resourcePage.description.textContent)
//     .contains('About this resource')
//     ;
// });

test('Basic search test', async t => {
  await t
    .typeText(findPage.searchBox, 'Food')
    .pressKey('enter')
    .expect(searchPage.pagination.exists)
    .ok();
});
