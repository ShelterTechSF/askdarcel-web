import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connectRefinementList } from 'react-instantsearch/connectors';
import styles from './ServiceDiscoveryResults.scss';

class EligibilitiesListFilter extends Component {
  static propTypes = {
    refine: PropTypes.func.isRequired,
    currentRefinement: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    const { availableEligibilities, selectedEligibilities, refine } = props;
    const initialRefinement = availableEligibilities
      .filter(elg => selectedEligibilities[elg.id])
      .map(e => e.name);
    refine(initialRefinement);

    const checks = {};
    props.availableEligibilities
      .forEach(elg => { checks[elg.name] = props.selectedEligibilities[elg.id]; });

    this.state = {
      isChecked: checks,
    };

    this.changeRefinement = this.changeRefinement.bind(this);
    this.setChecks = this.setChecks.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { currentRefinement } = this.props;
    if (currentRefinement.sort().join(',') !== prevProps.currentRefinement.sort().join(',')) {
      const checks = this.setChecks();
      // setState is done in a condition so it won't create loop
      this.setState({ isChecked: checks }); // eslint-disable-line react/no-did-update-set-state
    }
  }

  setChecks() {
    const { availableEligibilities, currentRefinement } = this.props;
    const checks = {};
    availableEligibilities.forEach(elg => {
      checks[elg.name] = currentRefinement.includes(elg.name);
    });
    return checks;
  }

  changeRefinement(eligibility, event) { // eslint-disable-line no-unused-vars
    const { refine } = this.props;
    const { currentRefinement } = this.props;
    const { isChecked } = this.state;
    let newRefinement;
    if (isChecked[eligibility]) {
      // If eligibility currently checked, remove from refinement
      newRefinement = currentRefinement.filter(value => eligibility !== value);
    } else {
      // If key currently unchecked, add to refinement
      newRefinement = currentRefinement.concat(eligibility);
    }
    refine(newRefinement);
  }

  render() {
    const { isChecked } = this.state;
    const { availableEligibilities } = this.props;

    return (
      <div className="refinement-wrapper">
        <ul className="refinement-ul">
          {availableEligibilities.map(eligibility => (
            <label key={eligibility.id} className={styles.checkBox}>
              {eligibility.name}
              <input
                type="checkbox"
                name={eligibility.name}
                id={eligibility.id}
                checked={isChecked[eligibility.name]}
                onChange={this.changeRefinement.bind(this, eligibility.name)}
              />
            </label>
          ))}
          {/* {mapKeys.map(key => {
            const refinementHasResults = this.refinementHasResults(key);
            // for each map key, display it as a filtering option
            // for onClick of each option, call refine on the values of the key
            // eslint-disable-next-line prefer-template
            return (
              <li
                key={key}
                className={`refine-li ${isChecked[key] ? 'active' : ''
                }${!refinementHasResults ? 'refine-li-disabled' : ''}`}
              >
                <label>
                  <input
                    type="checkbox"
                    className="refine-checkbox"
                    onChange={this.changeRefinement.bind(this, key)}
                    checked={isChecked[key]}
                    disabled={!refinementHasResults}
                  />
                  {key}
                </label>
              </li>
            );
          })} */}
        </ul>
      </div>
    );
  }
}

export default connectRefinementList(EligibilitiesListFilter);
