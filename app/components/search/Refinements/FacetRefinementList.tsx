import React, { Component } from "react";
import { connectRefinementList } from "react-instantsearch/connectors";
import type { Hit } from "react-instantsearch-core";
import styles from "./RefinementFilters.module.scss";

type Item = {
  count: number;
  isRefined: boolean;
  label: string;
  value: string[];
};

type Props = {
  items: Hit<Item>[];
  refine: (value: string[]) => void;
  currentRefinement: string[];
  mapping: Record<string, string[]>;
};

type State = {
  isChecked: Record<string, boolean>;
};

// Todo: This component could potentially be consolidated with the the Refinement List Filter
// component when categories/eligibilities are standardized across the homepage Service
// Pathways results and the Search Results pages
class FacetRefinementList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.changeRefinement = this.changeRefinement.bind(this);
    this.setChecks = this.setChecks.bind(this);
    const checks = this.setChecks();
    this.state = {
      isChecked: checks,
    };
  }

  componentDidUpdate(prevProps: Props) {
    const { currentRefinement } = this.props;
    if (
      currentRefinement.sort().join(",") !==
      prevProps.currentRefinement.sort().join(",")
    ) {
      const checks = this.setChecks();
      // setState is done in a condition so it won't create loop
      this.setState({ isChecked: checks }); // eslint-disable-line react/no-did-update-set-state
    }
  }

  setChecks(): Record<string, boolean> {
    const { mapping } = this.props;
    const mapKeys = Object.keys(mapping);
    const checks: Record<string, boolean> = {};
    mapKeys.forEach((key) => {
      checks[key] = this.keyHasAtLeastOneRefined(key);
    });
    return checks;
  }

  changeRefinement(key: string) {
    // eslint-disable-line no-unused-vars
    const { refine } = this.props;
    const { currentRefinement } = this.props;
    const { mapping } = this.props;
    const { isChecked } = this.state;
    let newRefinement;
    if (isChecked[key]) {
      // If key currently checked, unrefine every sub-element (filter through current refinement)
      newRefinement = currentRefinement.filter(
        (value) => !mapping[key].includes(value)
      );
    } else {
      // If key currently unchecked, refine all sub-elements
      newRefinement = currentRefinement.concat(mapping[key]);
    }
    refine(newRefinement);
  }

  keyHasAtLeastOneRefined(key: string) {
    const { currentRefinement } = this.props;
    const { mapping } = this.props;
    return mapping[key].some((value) => currentRefinement.includes(value));
  }

  refinementHasResults(key: string) {
    // this check that a key (checkbox) has at least one sub-elements that is refined
    // e.g if Learning Disabilities is can be refined but not Visual Impairment,
    // Disability is still enabled as a checkbox
    const { items } = this.props;
    const { mapping } = this.props;
    return items.some((item) => mapping[key].includes(item.label));
  }

  render() {
    const { isChecked } = this.state;
    const { mapping } = this.props;
    const mapKeys = Object.keys(mapping);

    return (
      <ul>
        {mapKeys.map((key) => {
          const refinementHasResults = this.refinementHasResults(key);
          // for each map key, display it as a filtering option
          // for onClick of each option, call refine on the values of the key
          // eslint-disable-next-line prefer-template
          return (
            <li key={key}>
              <label
                className={`${styles.checkBox} ${
                  !refinementHasResults ? styles.disabled : ""
                }`}
              >
                {key}
                <input
                  type="checkbox"
                  className={styles.refinementInput}
                  onChange={this.changeRefinement.bind(this, key)}
                  checked={isChecked[key]}
                  disabled={!refinementHasResults}
                />
              </label>
            </li>
          );
        })}
      </ul>
    );
  }
}

export default connectRefinementList<Props>(FacetRefinementList);
