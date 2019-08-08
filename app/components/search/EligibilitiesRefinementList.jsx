import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connectRefinementList } from 'react-instantsearch/connectors';
import { eligibilitiesMapping } from '../../utils/refinementMappings';

class EligibilitiesRefinementList extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    refine: PropTypes.func.isRequired,
    currentRefinement: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.changeRefinement = this.changeRefinement.bind(this);
    this.setChecks = this.setChecks.bind(this);
    const checks = this.setChecks();
    this.state = {
      isChecked: checks,
    };
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
    const mapKeys = Object.keys(eligibilitiesMapping);
    const checks = [];
    mapKeys.forEach(key => {
      checks[key] = this.keyHasAtLeastOneRefined(key);
    });
    return checks;
  }

  changeRefinement(key, event) { // eslint-disable-line no-unused-vars
    const { refine } = this.props;
    const { currentRefinement } = this.props;
    const { isChecked } = this.state;
    let newRefinement;
    if (isChecked[key]) {
      // If key currently checked, unrefine every sub-element (filter through current refinement)
      newRefinement = currentRefinement.filter(value => !eligibilitiesMapping[key].includes(value));
    } else {
      // If key currently unchecked, refine all sub-elements
      newRefinement = currentRefinement.concat(eligibilitiesMapping[key]);
    }
    refine(newRefinement);
  }

  keyHasAtLeastOneRefined(key) {
    const { currentRefinement } = this.props;
    return eligibilitiesMapping[key].some(value => currentRefinement.includes(value));
  }

  refinementHasResults(key) {
    // this check that a key (checkbox) has at least one sub-elements that is refined
    // e.g if Learning Disabilities is can be refined but not Visual Impairment,
    // Disability is still enabled as a checkbox
    const { items } = this.props;
    return items.some(item => eligibilitiesMapping[key].includes(item.label));
  }

  render() {
    const { isChecked } = this.state;
    const mapKeys = Object.keys(eligibilitiesMapping);
    return (
      <div className="refinement-wrapper">
        <p className="refinement-title">Eligibilities</p>
        <ul className="refinement-ul">
          {mapKeys.map(key => {
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
          })}
        </ul>
      </div>
    );
  }
}

export default connectRefinementList(EligibilitiesRefinementList);
