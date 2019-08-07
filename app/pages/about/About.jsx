import React from 'react';
import STLogo from './assets/STLogo.png';
import MOHCDLogo from './assets/MOHCDLogo.png';
import JDCLogo from './assets/JDCLogo.png';
import BenetechLogo from './assets/BenetechLogo.png';
import SFFamiliesLogo from './assets/SFFamiliesLogo.png';
import BridgeLogo from './assets/BridgeLogo.png';
import LarkinLogo from './assets/LarkinLogo.png';
import WeworkLogo from './assets/WeworkLogo.png';
import Footer from '../../components/ui/Footer/Footer';
import './About.scss';

export class AboutPage extends React.Component {
  render() {
    return (
      <div className="listing-container about">
        <article className="text-page" id="about">
          <header>
            <h1>
              About the
              <br />
              SF Service Guide
            </h1>
            <p>The SF Service Guide is an online directory of human services in San Francisco. Our goal is to help anyone with access to a smartphone, tablet, or computer find the services they need. The guide's focus is on homelessness and housing services, but also covers a variety of other services, from education and legal aid to senior services and re-entry programs. </p>
          </header>
          <section>
            <h3>Powered by:</h3>
            <div className="row">
              <a href="http://sheltertech.org" rel="noopener norefferer" className="image-container">
                <img src={STLogo} alt="ShelterTech" />
              </a>
              <p>
                The SF Service Guide is developed and maintained by ShelterTech, a volunteer-only 501c(3) non-profit that builds tech products for homeless and at risk communities.
                {' '}
                <a href="http://sheltertech.org" rel="noopener norefferer">Learn more here.</a>
              </p>
            </div>
          </section>
          <section>
            <h3>In partnership with:</h3>
            <div className="row">
              <a href="https://sfmohcd.org/" rel="noopener norefferer" className="image-container">
                <img src={MOHCDLogo} alt="MOHCD" />
              </a>
              <p>
                The SF Service Guide is supported by a grant from the SF Mayor's Office of Housing and Community Development.
              </p>
            </div>
            <div className="row">
              <a href="http://www.sfbar.org/jdc/legal-services/hap/" rel="noopener norefferer" className="image-container">
                <img src={JDCLogo} alt="JDC" />
              </a>
              <p>
                The content on the site is verified for accuracy by our data partner, the Homeless Advocacy Project of the JDC.
              </p>
            </div>
          </section>
          <section>
            <h3>Strategic partners:</h3>
            <ul className="partners-list">
              <li><a href="https://benetech.org/" rel="noopener norefferer"><img src={BenetechLogo} alt="Benetech" /></a></li>
              <li><a href="https://www.sffamilies.org/" rel="noopener norefferer"><img src={SFFamiliesLogo} alt="SF Families" /></a></li>
              <li><img src={BridgeLogo} alt="Bridge" /></li>
              <li><a href="https://larkinstreetyouth.org/" rel="noopener norefferer"><img src={LarkinLogo} alt="Larkin Street Youth Services" /></a></li>
              <li><a href="https://www.wework.com" rel="noopener norefferer"><img src={WeworkLogo} alt="WeWork" /></a></li>
            </ul>
          </section>
        </article>
        <Footer />
      </div>
    );
  }
}
