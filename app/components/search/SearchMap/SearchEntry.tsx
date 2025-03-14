import React, { Component } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import whiteLabel from "utils/whitelabel";
import { RelativeOpeningTime } from "components/listing/RelativeOpeningTime";
import type { SearchHit } from "models/SearchHits";
import "./SearchEntry.scss";

const {
  appImages: { mohcdSeal },
} = whiteLabel;

type Props = {
  hitNumber: string;
  hit: SearchHit;
};

export default class SearchEntry extends Component<Props> {
  renderAddressMetadata() {
    const { hit } = this.props;
    const { addresses: rawAddresses } = hit;
    const addresses = rawAddresses || [];

    if (addresses.length === 0) {
      return <span>No address found</span>;
    }
    if (addresses.length > 1) {
      return <span>Multiple locations</span>;
    }
    if (addresses[0].address_1) {
      return <span>{addresses[0].address_1}</span>;
    }
    return <span>No address found</span>;
  }

  render() {
    const { hit, hitNumber } = this.props;
    const description = hit.long_description || "No description, yet...";
    const { recurringSchedule, type } = hit;

    // handle resources and services slightly differently.
    let basePath = "organizations";
    let entryId = hit.resource_id;
    if (type === "service") {
      basePath = "services";
      entryId = hit.service_id;
    }
    return (
      <Link to={{ pathname: `/${basePath}/${entryId}` }}>
        <li className={`results-table-entry ${type}-entry`}>
          <div className="entry-details">
            <div className="entry-header">
              <h4 className="entry-headline">{`${hitNumber}. ${hit.name}`}</h4>
              {hit.is_mohcd_funded && (
                <div className="mohcd-funded">
                  <img src={mohcdSeal} alt="MOHCD seal" />
                  <p>Funded by MOHCD</p>
                </div>
              )}
            </div>
            {type === "service" && (
              <p className="entry-meta">
                <Link to={`/organizations/${hit.resource_id}`}>
                  {hit.service_of}
                </Link>
              </p>
            )}
            <p className="entry-meta">
              {this.renderAddressMetadata()}
              {recurringSchedule && (
                <span className="entry-schedule">
                  <RelativeOpeningTime recurringSchedule={recurringSchedule} />
                </span>
              )}
            </p>
            <div className="entry-body">
              <ReactMarkdown
                className="rendered-markdown search-entry-body"
                source={description}
              />
            </div>
          </div>
          <ul className="action-buttons">
            {hit._geoloc && (
              <li className="action-button">
                <a
                  href={`http://google.com/maps/dir/?api=1&destination=${hit._geoloc.lat},${hit._geoloc.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="material-symbols-outlined">directions</i>
                  Go
                </a>
              </li>
            )}
          </ul>
        </li>
      </Link>
    );
  }
}
