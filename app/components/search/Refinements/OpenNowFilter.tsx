import React from "react";
import { connectRefinementList } from "react-instantsearch/connectors";
import { getCurrentDayTime } from "utils/index";
import styles from "./RefinementFilters.module.scss";

type Props = {
  currentRefinement: string[];
  refine: (value: string[]) => void;
};

/**
 * A custom Algolia InstantSearch RefinementList widget representing the Open
 * Now checkbos.
 *
 * We implement this as a custom widget because we want to show users a
 * different representation of the search parameter than is actually stored
 * internally. Internally the open_times attribute is represented as an array of
 * times in 30-minute chunks, where the presence of a chunk indicates that the
 * organization or service is open during that chunk. Externally, we only want
 * to present a binary Open Now filter where activating the filter means
 * filtering for schedules where an open_times chunk exists for the user's
 * current local time.
 *
 * For example, if it is Sunday 10:00 AM locally, then enabling the Open Now
 * filter should filter for organizations or services which have 'Su-10:00' in
 * the open_times array.
 */
const OpenNowFilter = ({ currentRefinement, refine }: Props) => {
  const isActive = currentRefinement.length !== 0;
  const toggleRefinement = () => {
    if (isActive) {
      refine([]);
    } else {
      refine([getCurrentDayTime()]);
    }
  };

  return (
    <label key="openNow" className={styles.checkBox}>
      Open Now
      <input
        type="checkbox"
        name="openNow"
        id="openNow"
        className={styles.refinementInput}
        value="openNow"
        checked={isActive}
        onChange={toggleRefinement}
      />
    </label>
  );
};

export default connectRefinementList(OpenNowFilter);
