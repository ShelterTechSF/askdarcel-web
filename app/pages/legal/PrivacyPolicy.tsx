import React from 'react';
import ReactMarkdown from 'react-markdown';
import Footer from '../../components/ui/Footer/Footer';

const privacyPolicyContent = `
# Privacy Policy
We do everything within our power to protect your privacy given the sensitive nature of many of the services listed on SF Service Guide.
## Our Privacy Promises
- We operate as a 501c(3) non-profit and do not, and never will, sell personally identifiable information to other organisations: be that governmental, other non-profits, or for-profit companies.
- We will only request personally identifiable information from you when it's necessary.
- Any information that does not have to be linked specifically to you will be anonymized so that it cannot be identified to your use of the product.
- Any information that does have to be linked specifically to you will only be stored with your permission.
- Any personally identifiable information will be stored following industry standard encryption and security protocols.
- We will never share your personally identifiable information without your consent.
- We will never share your personally identifiable information with mailing lists, advertisers, or other forms of unsolicited communication.
- At any time you can request for us to remove any and all of your personally identifiable information from our database.
## Personal Identifiable Information
We may collect personal identification information from you in a variety of ways, including, but not limited to:
- When you visit SF Service Guide
- Create an account
- Subscribe to our newsletter
- Respond to a survey
- Fill out a form
- In connection with other activities, services, feature, or resources we make available.
You may be asked for, when it's necessary, your name, email address, phone number, and information to help you better find services on SF Service Guide.
You may also visit SF Service Guide anonymously.
We will collect personal identification information from you only if you voluntarily submit such information to us.
You can always refuse to supply personally identification information, but that may prevent you from engaging in certain site related activities.
## Why Do We Collect Personal Identifiable Information
It helps us provide a better service that's more relevant and helpful to you. We use your personal information to:
* Confirm your identity when you log in
* Respond to your inquiries
* Troubleshoot problems
* Analyze site usage
* Customize your experience and the site’s content, layout, and services
* Detect and protect us against error, fraud, and other criminal activity
* Enforce our [Terms of Service](/terms-of-service) and other related policies
* Improve our content and product
* Inform you about product updates
### Non-Personal Identification Information
Non-personal identification information may be gathered when you use SF Service Guide. This information may include the device, browser, and other technical means of connecting to SF Service Guide. This information helps us better understand how our users access SF Service Guide and helps us improve how you access its content.
### How We Protect Your Information
We adopt industry standard data collection, storage and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your personal information, username, password, and data stored on our servers.
Sensitive and private data exchange between the SF Service Guide and your device happens over a SSL secured communication channel and is encrypted and protected with digital signatures.
### We Don't Share Your Personal Information
We will not give out any personal information without your knowledge. We will never provide personal information to any outside company, including advertisers. We would only disclose the personal information of a user to cooperate with a criminal investigation or if we were served with a subpoena in a lawsuit.
### We Don't Sell Your Information
We do not sell, rent or lend any of your personal identifiable information to third parties other than in accordance with this policy.
### Third-Party Websites
We do not share personal information with third party websites except to analyse site usage so we can improve our product.
### Will I be added to any mailing lists?
We do not sell, rent or lend email addresses to any third parties. We may send you an occasional email to inform you of updates to SF Service Guide, events that we are running in association with SF Service Guide, and any emails necessary to your proper use of SF Service Guide's features.
### Web Browser Cookies
We may use “cookies” to enhance your experience on SF Service Guide. Your web browser places cookies on your hard drive for record-keeping purposes and sometimes to track information about you. User may choose to set their web browser to refuse cookies, or to alert you when cookies are being sent. If they do so, note that some parts of SF Service Guide may not function properly.
### Changes To This Policy
Whenever we choose to make changes to our Privacy Policy, we will send an email explaining the changes.
### Your Acceptance of These Terms
By using this SF Service Guide, you signify your acceptance of this policy. If you do not agree to this policy, please do not use SF Service Guide. Your continued use of SF Service Guide following the posting of changes to this policy will be deemed your acceptance of those changes.
### Removing My Information or Cancelling My Account
You may remove your personal identifiable information or cancel your account with SF Service Guide at any time. To do this, send an email to the address below with the subject: “Remove my personal information”.
### Contacting Us
If you have questions about this Privacy Policy, the practices of SF Service Guide, or any other dealings with SF Service Guide, please contact us at :
ShelterTech
<info@sheltertech.org>
`;

export const PrivacyPolicyPage = () => (
  <div className="listing-container">
    <article className="text-page listing" id="privacyPolict">
      <div className="listing--main">
        <ReactMarkdown className="rendered-markdown" source={privacyPolicyContent} />
      </div>
    </article>
    <Footer />
  </div>
);
