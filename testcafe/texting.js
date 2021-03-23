/*
import SearchResultsPage from './pages/SearchResultsPage';
import Texting from './pages/Texting';


const searchResultsPage = new SearchResultsPage();
const texting = new Texting();


fixture`Texting info`
  .page(SearchResultsPage.url());

test('Text info, Basic', async t => {
  const data = {
    recipientName: 'test name',
    phoneNumber: '4154353493',
  };

  await t.click(searchResultsPage.textMeInfo);

  // check submit button is disabled
  await t.expect(texting.submitButton.hasAttribute('disabled')).ok();

  await t.typeText(texting.recipientName, data.recipientName, { replace: true });
  await t.typeText(texting.phoneNumber, data.phoneNumber, { replace: true });
  await t.click(texting.agree);

  // check submit button is not disabled
  await t.expect(texting.submitButton.hasAttribute('disabled')).notOk();

  await t.click(texting.submitButton);
  // Check the request fulfilled successfully
  // await t.expect(texting.sent.innerText).contains('Sent!');

}); */
