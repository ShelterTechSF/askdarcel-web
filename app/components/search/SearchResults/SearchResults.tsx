import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  connectStateResults,
  SearchResults as SearchResultsProps,
} from "react-instantsearch/connectors";
import { whiteLabel } from "utils";
import { CATEGORIES } from "pages/ServiceDiscoveryForm/constants";
import { SearchMap } from "components/search/SearchMap/SearchMap";
import ResultsPagination from "components/search/Pagination/ResultsPagination";
import { Texting } from "components/Texting";

import { ClinicianActions } from "components/ucsf/ClinicianActions/ClinicianActions";
import { ClientHandouts } from "components/ui/ClientHandoutsModal/ClientHandouts";
import { TextListing } from "components/Texting/Texting";
import { Button } from "components/ui/inline/Button/Button";
import { SearchHit, transformHits } from "../../../models/SearchHits";
import { icon } from "../../../assets";
import styles from "./SearchResults.module.scss";

const SearchResults = ({
  searchResults,
  overlayMapWithSearchResults,
  setAroundLatLng,
  categoryId,
}: {
  searchResults: SearchResultsProps;
  overlayMapWithSearchResults: boolean;
  setAroundLatLng: (latLng: { lat: number; lng: number }) => void;
  categoryId?: string;
}) => {
  const category = CATEGORIES.find((c) => c.id === categoryId);
  const sortBy24HourAvailability = Boolean(category?.sortBy24HourAvailability);
  const hits = transformHits(
    searchResults ? (searchResults.hits as unknown as SearchHit[]) : [],
    sortBy24HourAvailability
  );

  const [centerCoords] = useState(null);
  const [googleMapObject, setMapObject] = useState<google.maps.Map | null>(
    null
  );
  interface ExpandedStatesObject {
    [key: string]: boolean;
  }

  // This object holds the expanded/collapsed state for each individual result
  const [expandedStates, setExpandedStates] = useState<ExpandedStatesObject>(
    {}
  );
  const [disableExpandAllButton, setDisableExpandAllButton] = useState(true);
  const [disableCollapseAllButton, setDisableCollapseAllButton] =
    useState(false);

  useEffect(() => {
    if (hits.length && hits.length !== Object.keys(expandedStates).length) {
      const initialStates: ExpandedStatesObject = {};
      hits.forEach((hit) => {
        initialStates[hit.id] = true;
      });
      setExpandedStates(initialStates);
    }
  }, [hits, expandedStates]);

  useEffect(() => {
    if (centerCoords && googleMapObject) {
      googleMapObject.setCenter(centerCoords);
    }
    document.body.classList.add("searchResultsPage");

    return () => {
      document.body.classList.remove("searchResultsPage");
    };
  }, [googleMapObject, centerCoords]);

  const toggleExpandAllResults = (expand: boolean) => {
    const newExpandedStates: ExpandedStatesObject = {};
    Object.keys(expandedStates).forEach((key) => {
      newExpandedStates[key] = expand;
    });

    setDisableExpandAllButton(expand);
    setDisableCollapseAllButton(!expand);
    setExpandedStates(newExpandedStates);
  };

  const toggleExpandResult = (id: number) => {
    const newState = !expandedStates[id];
    const updatedExpandedStates = {
      ...expandedStates,
      [id]: newState,
    };
    setExpandedStates(updatedExpandedStates);

    const allStates = Object.values(updatedExpandedStates);
    setDisableExpandAllButton(allStates.every((state) => state === true));
    setDisableCollapseAllButton(allStates.every((state) => state === false));
  };

  if (!searchResults) return null;

  return (
    <div className={styles.searchResultsAndMapContainer}>
      <div
        className={`${styles.toggleExpandSearchResultsContainer} ${
          overlayMapWithSearchResults ? styles.overlayMapWithSearchResults : ""
        }`}
      >
        <Button
          styleType="text"
          addClass={styles.toggleExpandAllButton}
          disabled={disableExpandAllButton}
          onClick={() => toggleExpandAllResults(true)}
        >
          Expand All
        </Button>
        <Button
          styleType="text"
          addClass={styles.toggleExpandAllButton}
          disabled={disableCollapseAllButton}
          onClick={() => toggleExpandAllResults(false)}
        >
          Collapse All
        </Button>
      </div>
      <div
        className={`${styles.searchResultsContainer} ${
          overlayMapWithSearchResults ? styles.overlayMapWithSearchResults : ""
        }`}
      >
        <div
          className={`${styles.noResultsMessage} ${
            hits && hits.length ? styles.hidden : ""
          }`}
        >
          No results found in your area. Try a different location, category, or
          search term.
        </div>
        {hits.map((hit, index) => (
          <SearchResult
            hit={hit}
            index={index}
            categoryId={categoryId}
            expanded={expandedStates[hit.id]}
            onToggle={() => toggleExpandResult(hit.id)}
            key={hit.id}
          />
        ))}
        <ResultsPagination noResults={!hits || !hits.length} />
      </div>
      <SearchMap
        hits={hits}
        page={0}
        hitsPerPage={hits.length}
        mapObject={googleMapObject}
        setMapObject={setMapObject}
        setAroundLatLng={setAroundLatLng}
        overlayMapWithSearchResults={overlayMapWithSearchResults}
      />
    </div>
  );
};

const SearchResult = ({
  hit,
  index,
  categoryId,
  expanded,
  onToggle,
}: {
  hit: SearchHit;
  index: number;
  categoryId: string | undefined;
  expanded: boolean;
  onToggle: () => void;
}) => {
  const [textingIsOpen, setTextingIsOpen] = useState(false);
  const [clinicianActionsIsOpen, setClinicianActionsIsOpen] = useState(false);
  const [handoutModalIsOpen, setHandoutModalIsOpen] = useState(false);

  type HandoutLanguage = "es" | "tl" | "zh-TW" | "vi" | "ru" | "ar";
  const handoutUrl = (hitId: number, language: HandoutLanguage | null) => {
    const handoutRoute =
      categoryId === "2000006"
        ? "intimate-partner-violence-handout"
        : "service-handout";

    return `/${handoutRoute}/${hitId}${
      language ? `?handoutLanguage=${language}` : ""
    }`;
  };

  let listing: TextListing;
  if (hit.type === "service") {
    listing = {
      listingName: hit.name,
      type: hit.type,
      serviceId: hit.id,
    };
  } else {
    listing = {
      listingName: hit.name,
      type: hit.type,
      resourceId: hit.id,
    };
  }

  const toggleTextingModal = () => setTextingIsOpen(!textingIsOpen);

  const texting = (
    <div
      className={styles.sideLink}
      data-field="text-me"
      role="button"
      tabIndex={0}
      onClick={toggleTextingModal}
    >
      <img
        src={icon("text-message")}
        alt="chat-bubble"
        className={styles.sideLinkIcon}
      />
      <div className={styles.sideLinkText}>Text me the info</div>
    </div>
  );

  const toggleClinicianActionsModal = () => {
    setClinicianActionsIsOpen(!clinicianActionsIsOpen);
  };
  const toggleHandoutModal = () => {
    setHandoutModalIsOpen(!handoutModalIsOpen);
  };

  const clinicianActionsLink = (
    <div
      className={styles.sideLink}
      role="button"
      tabIndex={0}
      onClick={toggleClinicianActionsModal}
    >
      <img
        src={icon("clinician-action")}
        alt="clinician action"
        className={styles.sideLinkIcon}
      />
      <div className={styles.sideLinkText}>Clinician actions</div>
    </div>
  );

  const handoutsLink = (
    <div
      className={styles.sideLink}
      role="button"
      tabIndex={0}
      onClick={toggleHandoutModal}
    >
      <img
        src={icon("print-blue")}
        alt="printout icon"
        className={styles.sideLinkIcon}
      />
      <div className={styles.sideLinkText}>Print</div>
    </div>
  );

  const renderAddressMetadata = (hit_: SearchHit) => {
    if (!hit_.addresses || hit_.addresses.length === 0) {
      return <span>No address found</span>;
    }
    if (hit_.addresses.length > 1) {
      return <span>Multiple locations</span>;
    }
    if (hit_.addresses[0].address_1) {
      return <span>{hit_.addresses[0].address_1}</span>;
    }
    return <span>No address found</span>;
  };

  const phoneNumber = hit?.phones?.[0]?.number;
  const formatPhoneNumber = (number: string) => {
    // Takes 9 or 10 digit raw phone number input and outputs xxx-xxx-xxxx
    // If the input doesn't match regex, function returns number's original value
    if (!number) {
      return "";
    }

    const cleaned = number.toString().replace(/\D/g, "");
    const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return [match[2], "-", match[3], "-", match[4]].join("");
    }

    return number;
  };

  const url = hit.type === "service" ? hit.url : hit.website;
  const showDischargeSidelinks =
    whiteLabel.showClinicianAction && whiteLabel.showHandoutsIcon;

  const basePath = hit.type === "service" ? `services` : `organizations`;

  return (
    <div className={styles.searchResult}>
      {/* Modals */}
      <Texting
        closeModal={toggleTextingModal}
        listing={listing}
        isShowing={textingIsOpen}
      />
      {hit.type === "service" && (
        <ClinicianActions
          isOpen={clinicianActionsIsOpen}
          setIsOpen={toggleClinicianActionsModal}
          actions={hit.instructions?.[0] ?? ""}
        />
      )}
      {hit.type === "service" && (
        <ClientHandouts
          isOpen={handoutModalIsOpen}
          setIsOpen={toggleHandoutModal}
          handoutCollection={[
            {
              key: -1,
              description: "English",
              url: handoutUrl(hit.id, null),
            },
            {
              key: -2,
              description: "Spanish",
              url: handoutUrl(hit.id, "es"),
            },
            {
              key: -3,
              description: "Tagalog",
              url: handoutUrl(hit.id, "tl"),
            },
            {
              key: -4,
              description: "Chinese (Traditional)",
              url: handoutUrl(hit.id, "zh-TW"),
            },
            {
              key: -5,
              description: "Vietnamese",
              url: handoutUrl(hit.id, "vi"),
            },
            {
              key: -6,
              description: "Russian",
              url: handoutUrl(hit.id, "ru"),
            },
            {
              key: -7,
              description: "Arabic",
              url: handoutUrl(hit.id, "ar"),
            },
          ]}
        />
      )}
      {/* End modals */}

      <div className={styles.searchResultTitleContainer}>
        <div>
          <div className={styles.title}>
            <Link
              to={{ pathname: `/${basePath}/${hit.id}` }}
              className="notranslate"
            >{`${index + 1}. ${hit.name}`}</Link>
          </div>
          {hit.type === "service" && (
            <div className={styles.serviceOf}>
              <Link
                to={`/organizations/${hit.resource_id}`}
                className="notranslate"
              >
                {hit.service_of}
              </Link>
            </div>
          )}
        </div>
        <div className={styles.expandResultButtonContainer}>
          <button
            type="button"
            onClick={onToggle}
            className={styles.expandResultButton}
          >
            <img
              className={`${styles.expandResultIcon} ${
                expanded ? "" : styles.collapsed
              }`}
              src={icon("thick-chevron")}
              alt="Expand Results Toggle"
            />
          </button>
        </div>
      </div>
      <div className={styles.searchResultContent}>
        <div className={styles.searchText}>
          {expanded && (
            <>
              <div className={`notranslate ${styles.address}`}>
                {renderAddressMetadata(hit)}
              </div>
              <ReactMarkdown
                className={`rendered-markdown ${styles.description}`}
                source={hit.long_description ?? undefined}
                linkTarget="_blank"
              />
            </>
          )}
        </div>

        <div className={styles.sideLinks}>
          {expanded && (
            <>
              <div
                className={
                  showDischargeSidelinks ? "" : styles.hideDischargeSidelinks
                }
              >
                {hit.type === "service" &&
                  !!hit.instructions?.length &&
                  clinicianActionsLink}
                {handoutsLink}
              </div>
              <div
                className={
                  showDischargeSidelinks ? styles.deemphasizeSideLinks : ""
                }
              >
                {phoneNumber && (
                  <div
                    className={`${styles.sideLink} ${styles.showInPrintView}`}
                  >
                    <img
                      src={icon("phone-blue")}
                      alt="phone"
                      className={styles.sideLinkIcon}
                    />
                    <a
                      href={`tel:${phoneNumber}`}
                      className={styles.sideLinkText}
                    >{`Call ${formatPhoneNumber(phoneNumber)}`}</a>
                  </div>
                )}
                <div />
                {url && (
                  <div className={styles.sideLink}>
                    <img
                      src={icon("popout-blue")}
                      alt="website"
                      className={styles.sideLinkIcon}
                    />
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={url}
                      className={styles.sideLinkText}
                    >
                      Go to website
                    </a>
                  </div>
                )}
                {texting}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Connects the Algolia searchState and searchResults to this component
// Learn more here: https://community.algolia.com/react-instantsearch/connectors/connectStateResults.html
export default connectStateResults(SearchResults);
