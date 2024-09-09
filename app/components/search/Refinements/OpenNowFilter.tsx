import React, { useEffect, useState } from "react";
import { useRefinementList, UseRefinementListProps } from "react-instantsearch";
import { getCurrentDayTime } from "utils/index";
import styles from "./RefinementFilters.module.scss";

interface Props extends UseRefinementListProps {}

/**
 * A custom Algolia InstantSearch RefinementList widget representing the Open
 * Now checkbox.
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
const OpenNowFilter = (props: Props) => {
  const { refine, items } = useRefinementList(props);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (items.map((item) => item.value).includes(getCurrentDayTime())) {
      setChecked(true);
    }
  }, [items]);

  const toggleRefinement = () => {
    if (checked) {
      setChecked(false);
    } else if (items.map((item) => item.value).includes(getCurrentDayTime())) {
      setChecked(true);
    }
    refine(getCurrentDayTime());
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
        checked={checked}
        onChange={toggleRefinement}
      />
    </label>
  );
};

export default OpenNowFilter;
