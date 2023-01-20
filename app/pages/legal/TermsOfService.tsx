import React from "react";
import ReactMarkdown from "react-markdown";
import { Footer } from "../../components/ui";

const termsOfServiceContent = `
# SF Service Guide Terms of Service

PLEASE READ THE FOLLOWING TERMS OF USE (“TERMS”) CAREFULLY BEFORE USING SF SERVICE GUIDE (“SF SERVICE GUIDE” OR THE “SERVICE”). BY ACCESSING OR USING SF SERVICE GUIDE, YOU AGREE, WITHOUT LIMITATION OR QUALIFICATION, TO BE BOUND BY THESE TERMS. IF YOU DO NOT ACCEPT THESE TERMS, YOU WILL NOT BE ABLE TO USE SF SERVICE GUIDE.

1. Agreement
    1. These Terms of Use (“Terms”) constitute an agreement (“Agreement”) between ShelterTech and the User concerning SF Service Guide. The “User” is you. ShelterTech developed and operates SF Service Guide to provide a continuously-updated resource directory of services for the homeless and the undeserved. Please read these terms carefully before using SF Service Guide. By using SF Service Guide in any way, you agree to be bound by these terms. If you do not accept these terms, you wil not be able to use SF Service Guide.
    2. This Agreement governs your access to and use of SF Service Guide.
    3. You must be at least 13 years old to use SF Service Guide. By using SF Service Guide, you represent and warrant that you are at least age 13, and you agree to be bound by the terms and conditions of this Agreement.

2. Usage Restrictions.
    1. You agree to access and use SF Service Guide only for lawful purposes. You are solely responsible for the knowledge of and adherence to any and all laws, statutes, rules and regulations pertaining to your use of SF Service Guide.  In addition, ShelterTech expects Users of SF Service Guide to respect the rights and dignity of others. By accessing SF Service Guide, you agree that you will not:
    2. Use SF Service Guide in a way to give rise to civil liability or encourage others to engage in any conduct which would give rise to civil liability;
    3. Use SF Service Guide to commit or facilitate the commission of a criminal offense or to encourage others to engage in any other conduct which would constitute a criminal offense;
    4. Obtain or try to obtain any source data from SF Service Guide except through ShelterTech's authorized Application Programming Interface (“API”) or obtain and use such data for commercial purposes;
    5. Not use any automated system, software or other manual or automatic device to index, scrape, extract or in any other way gather information contained in SF Service Guide except as permitted by the API infrastructure;
    6. Use SF Service Guide to upload any content that contains a software virus, “Trojan Horse” or any other computer code, files, or programs that may alter, damage, or interrupt the functionality of the SF Service Guide or ShelterTech infrastructure;
    7. Modify, reverse engineer, decompile, or disassemble SF Service Guide or attempt to do so, whether in whole or in part, or bypass, modify, defeat, or tamper with or circumvent any of the functions or protections of SF Service Guide or any mechanisms operatively linked to SF Service Guide, for example, by augmenting or substituting any digital rights management functionality;
    8. Link to, mirror, or frame any portion of SF Service Guide;
    9. Attempt to gain unauthorized access to, disrupt or impair any aspect of SF Service Guide or its related systems or networks;
    10. Post or transmit anything that is or may be considered threatening , harassing, degrading, hateful or intimidating;  defamatory;  fraudulent or tortious; obscene, indecent, pornographic or otherwise objectionable; or  protected by copyright, trademark, trade secret, right of publicity or other proprietary right without the express prior consent of the owner of such right;
    11. Post or transit anything that is or may be considered unsolicited or unauthorized advertising, promotional material, “junk mail,” “spam,” “chain letter,” “pyramid scheme” or investment opportunity, or any other form of solicitation;
    12. Post or transmit anything that is any material, non-public information about a company without the proper authorization to do so;
    13. Use SF Service Guide for any fraudulent or unlawful purposes;
    14. Use SF Service Guide to defame, abuse, harass, stalk, threaten or otherwise violate the legal rights of others, including without limitation others’ privacy rights or rights of publicity, or harvest or collect personally identifiable information about other users of the Site;
    15. Impersonate any person or entity, including without limitation any representative of ShelterTech; falsely state or otherwise misrepresent your affiliation with any person or entity in connection with the SF Service Guide; or express or imply that ShelterTech endorses any statement that you make; or
    16. Use SF Service Guide to advertise or offer to sell or buy any goods or services without ShelterTech's express prior written consent.

3. Collection and Dissemination of Information.
    1. SF Service Guide is offered for informational purposes only. While ShelterTech will at all times attempt to provide accurate and timely information, ShelterTech does NOT guarantee the accuracy of the information in SF Service Guide.
    2. Much of the content of SF Service Guide is made available by third parties, including providers of community, non-profit and social services, and these entities are not responsible or liable for any such content.
    3. SF Service Guide may collect personally identifiable information from you to help you better access services through SF Service Guide. ShelterTech will never give out any personally identifiable information without your knowledge and will never provide personally identifiable information to any outside company, including advertisers. For more information, review ShelterTech's privacy policy (http://%20privacy%20policy/).

4. Intellectual Property
    1. All design, information, text, graphics, images, pages, interfaces, links, software, and other items and materials contained or displayed in SF Service Guide, and the selection and arrangements thereof, remain the property of their respective owners. All rights are reserved.
    2. Except as expressly set forth herein, this Agreement does not grant either party any rights, implied or otherwise, to the other's content or any of the other's intellectual property.

5. User Support.
    1. ShelterTech does not offer individual user support for SF Service Guide. If you have any suggestions or believe you are experiencing a bug or issue please promptly report it by e-mailing info@sheltertech.org. info@sheltertech.org is only used for reviewing non-emergency technical support and/or technical feedback.

6. Disclaimers
    1. SF Service Guide and all information contained in it are distributed and transmitted "as is" and “as available” without warranties of any kind, either express or implied, including but not limited to warranties of title or implied warranties of merchantability or fitness for a particular purpose with respect to the quality, content, accuracy, timeliness, completeness, currency, freedom from interruption, freedom from computer virus, freedom from errors or omissions, non-infringement of content placed in SF Service Guide including any of the design, information, text, graphics, images, pages, interfaces, links, software, or other information and items contained in or displayed in jps.
    2. ShelterTech is not responsible for any special, indirect, incidental or consequential damages (regardless of whether they were foreseeable) that may arise from the use of, or the inability to use SF Service Guide, whether the materials contained in SF Service Guide are provided by sheltertech or a third party.
    3. Any material downloaded or otherwise obtained through the use of SF Service Guide is done at the user’s own discretion and risk. you will be solely responsible for any damage to your computer system or other device or loss of data that results from the download of any such material.
    4. SF Service Guide is for informational purposes only and not for the purpose of providing legal advice.
    5. ShelterTech does not guarantee that use of SF Service Guide will be secure or that any use of SF Service Guide will be uninterrupted. please note that information on SF Service Guide may occasionally be inaccurate, incorrect or out of date.

7. Indemnification.
    1. You agree to defend, indemnify, and hold harmless ShelterTech and all of its employees and agents from any and all claims (even if the allegations of the claim are without merit) or judgments for damages incurred in connection with any actual or alleged breach or by you of this Agreement, including reasonable attorneys' fees and costs.  You agree to cooperate fully in the defense of any such claim. ShelterTech reserves the right to assume, at its own expense, the exclusive defense and control of any matter otherwise subject to indemnification by you.  You agree not to settle any such matter without the written consent of ShelterTech.

8. Links to or From Other Sites.
    1. SF Service Guide may provide links to other websites and online resources. Other wesbites may provide links to SF Service Guide with or without authorization. Except as otherwise expressly stated on SF Service Guide, ShelterTech is not affiliated or associated with the operators of any third-party websites or other resources that link to or are linked from the Site. ShelterTech expressly disclaims any responsibility for the accuracy, content, or availability of information found on third-party websites or resources that link to or are linked from SF Service Guide. ShelterTech cannot ensure User satisfaction with any products or services that are available through any third-party website or resource that links to or is linked from SF Service Guide, because these third-party websites and resources are owned and operated by independent entities. ShelterTech does not endorse any of the products or services, You agree that your use of third-party websites and other online resources is at your own risk and subject to the terms and conditions of use applicable to such resources.

9. Registration, User Names and Passwords.
    1. Users may need to register to use all or part of SF Service Guide. Users represent and warrant that all information submitted in connection with such registration is complete and accurate. ShelterTech may refuse to grant Users, and Users may not use, a user name or e-mail address that is already beng used by someone else, that may be construed as impersonating another person, that belongs to another person, that violates the intellectual property or rights of another person, that is offensive or that ShelterTech chooses to reject for any reason in its sole discretion. ShelterTech may reject or require a User to change any username or password. Usernames and passwords are for personal use only and should be kept confidential. Users, and not ShelterTech, are responsible for any use or misuse of User's username of password. Users should notify ShelterTech of any unauthorized use of a username or password. User's are fully responsible for all interactions with SF Service Guide that occur in connection with their password or username.

10. Information or Complaints
    1. If you have a question or complaint regarding the Site, please send an e-mail to info@sheltertech.org. You may also contact us by writing to XXXX. Under California Civil Code Section 1789.3, California users are entitled to the following consumer rights notice: California residents may reach the Complaint Assistance Unit of the Division of Consumer Services of the California Department of Consumer Affairs by mail at 1625 North Market Blvd., Sacramento, CA 95834, or by telephone at (916) 445-1254 or (800) 952-5210.

11. Miscellaneous
    1. Nothing contained in these Terms constitutes or is intended to constitute legal advice by ShelterTech or any of its agencies, officers, employees, agents, attorneys, or representatives.
    2. The User agrees that if ShelterTech does not exercise or enforce any legal right or remedy which is contained in the Terms (or which ShelterTech otherwise has under applicable law), such omission will not be taken to be a formal waiver of ShelterTech’s rights and shall not be construed to be a modification of the Terms.
    3. If any court of competent jurisdiction rules that any provision of these Terms is invalid, then that provision will be removed from the Terms without affecting the rest of the Terms. The remaining provisions of the Terms will continue to be valid and enforceable.
    4. The Terms, and the User’s relationship with ShelterTech under the Terms, shall be governed by and construed in accordance with the Laws of the State of  California (notwithstanding California choice-of-law rules).
    5. The User agrees that any and all claims asserted by or against ShelterTech arising under or related to the Terms shall solely be heard and determined either in the courts of the United States located in the City or County of San Francisco or in the courts of the State of California located in the City and County of San Francisco.
    6. Nothing in this Agreement will act to limit ShelterTech’s ability to seek equitable relief under this Agreement.
    7. The User may not assign this Agreement or any part of it, or any rights to use SF Service Guide, either temporarily or permanently, to any other party. Any attempt to do so is void. ShelterTech may assign this Agreement without your consent.
    8. ShelterTech reserves the right to revise and otherwise change the Terms at any time. Users will be notified of any modification by reasonable means, including by posting the revised version of this Agreement on SF Service Guide. Users can determine when ShelterTech last changed this Agreement by referring to the “Last Updated” date below.
    9. The Terms constitute the entire Agreement between the User and ShelterTech with respect to access to and use of SF Service Guide, and they supersede all prior or contemporaneous communications and proposals, whether electronic, oral or written, between the User and ShelterTech with respect to SF Service Guide.

`;

export const TermsOfServicePage = () => (
  <div className="listing-container">
    <article className="text-page listing" id="privacyPolict">
      <div className="listing--main">
        <ReactMarkdown
          className="rendered-markdown"
          source={termsOfServiceContent}
        />
      </div>
    </article>
    <Footer />
  </div>
);
