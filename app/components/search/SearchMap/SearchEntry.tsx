import React, { Component } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import websiteConfig from "utils/websiteConfig";
import { RelativeOpeningTime } from "components/listing/RelativeOpeningTime";
import type { TransformedSearchHit } from "models/SearchHits";
import "./SearchEntry.scss";

const {
  appImages: { mohcdSeal },
} = websiteConfig;

interface Props {
  hit: TransformedSearchHit;
}

export default class SearchEntry extends Component<Props> {
  render() {
    const { hit } = this.props;
    const { recurringSchedule, type } = hit;

    return (
      <Link to={{ pathname: hit.path }}>
        <li className={`results-table-entry ${type}-entry`}>
          <div className="entry-details">
            <div className="entry-header">
              <h4 className="entry-headline">{hit.headline}</h4>
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
              {hit.addressDisplay}
              {recurringSchedule && (
                <span className="entry-schedule">
                  <RelativeOpeningTime recurringSchedule={recurringSchedule} />
                </span>
              )}
            </p>
            <div className="entry-body">
              <ReactMarkdown
                className="rendered-markdown search-entry-body"
                source={hit.longDescription}
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
                  <i className="material-icons">directions_outlined</i>
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
