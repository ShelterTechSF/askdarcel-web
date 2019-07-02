import React from 'react';
import ReactMarkdown from 'react-markdown';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import {
  AddressInfo,
  PhoneNumber,
  ResourceCategories,
  Website,
  Email,
} from 'components/listing/ResourceInfos';
import {
  ActionSidebar,
  TableOfOpeningTimes,
  MobileActionBar,
} from 'components/listing';
import { MapOfLocations } from 'components/maps';
import { RelativeOpeningTime } from 'components/listing/RelativeOpeningTime';
import Services from 'components/listing/Services';
import Notes from 'components/listing/Notes';
import Loader from 'components/ui/Loader';
import HAPcertified from '../assets/img/ic-hap.png';
import MOHCDFunded from '../assets/img/ic-mohcd-funded-services.png';
import { isSFServiceGuideSite } from '../utils/whitelabel';

const getResourceLocation = resource => {
  const { address } = resource;
  if (!address) return null;

  return {
    id: address.id,
    address,
    name: resource.name,
    schedule: resource.schedule,
  };
};

export class OrganizationListingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resource: null,
    };
    this.isMOHCDFunded = this.isMOHCDFunded.bind(this);
  }

  componentDidMount() {
    this.loadResourceFromServer();
  }

  loadResourceFromServer() {
    const {
      location: {
        query: {
          id,
        },
      },
    } = this.props;
    const url = `/api/resources/${id}`;

    fetch(url, { credentials: 'include' }).then(r => r.json()).then(data => {
      this.setState({ resource: data.resource });
    });
  }

  isMOHCDFunded() {
    const { resource } = this.state;
    let isMOHCDFunded = false;

    // eslint-disable-next-line
    resource && resource.categories.forEach(category => {
      if (category.name === 'MOHCD Funded') {
        isMOHCDFunded = true;
      }
    });

    return isMOHCDFunded;
  }

  render() {
    const { resource } = this.state;
    if (!resource || !window.google) {
      return <Loader />;
    }

    const { notes } = resource;
    const isMOHCDFunded = this.isMOHCDFunded();
    const resourceLocation = getResourceLocation(resource);
    return (
      <div>
        <Helmet>
          <title>
            {resource.name}
              |
            {' '}
            {
              isSFServiceGuideSite()
                ? 'SF Service Guide'
                : 'AskDarcel'
            }
          </title>
          <meta name="description" content={resource.long_description} />
        </Helmet>
        <div className="org-container">
          <article className="org" id="resource">
            <div className="org--main">
              <div className="org--main--left">

                <header className="org--main--header">
                  <div className="badges">
                    {resource.certified && (<img className="certified" src={HAPcertified} alt="Verified by the Homeless Assistance Project" />)}
                    {isMOHCDFunded && (<img className="mohcd-funded" src={MOHCDFunded} alt="Verified by MOHCD" />)}
                  </div>
                  <h1 className="org--main--header--title">{resource.name}</h1>
                  <div className="org--main--header--hours">
                    <RelativeOpeningTime schedule={resource.schedule} />
                  </div>
                  <div className="org--main--header--phone">
                    <PhoneNumber phones={resource.phones} />
                  </div>
                </header>
                <MobileActionBar resource={resource} />
                <div className="org--main--header--description">
                  <h2>About this Organization</h2>
                  <ReactMarkdown className="rendered-markdown" source={resource.long_description || resource.short_description || 'No Description available'} />
                </div>

                <section className="service--section" id="services">
                  <header className="service--section--header">
                    <h4>Services</h4>
                  </header>
                  <Services
                    description={resource.long_description}
                    services={resource.services}
                  />
                </section>

                <Notes notes={notes} id="notes" />

                <section className="info--section" id="info">
                  <header className="service--section--header">
                    <h4>Info</h4>
                  </header>
                  <ul className="info">
                    <div className="info--column">
                      <ResourceCategories categories={resource.categories} />
                      {' '}
                      {resource.address && <AddressInfo address={resource.address} />}
                      <PhoneNumber phones={resource.phones} />
                      <Website website={resource.website} />
                      <Email email={resource.email} />
                    </div>
                  </ul>
                </section>

                {resourceLocation && (
                  <section className="location--section">
                    <header className="service--section--header">
                      <h4>Location</h4>
                    </header>
                    <MapOfLocations
                      locations={[resourceLocation]}
                      locationRenderer={location => (
                        <TableOfOpeningTimes
                          schedule={location.schedule}
                          inherited={location.inherited}
                        />
                      )}
                    />
                  </section>
                )}
              </div>

              <div className="org--aside">
                <ActionSidebar resource={resource} />
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }
}

OrganizationListingPage.defaultProps = {
  userLocation: null,
};

OrganizationListingPage.propTypes = {
  location: PropTypes.shape({
    query: PropTypes.shape({ resourceid: PropTypes.string }).isRequired,
  }).isRequired,
  // userLocation is not required because will be lazy-loaded after initial render.
  userLocation: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
};
