import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connectRefinementList } from 'react-instantsearch/connectors';

class CategoriesRefinementList extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    refine: PropTypes.func.isRequired,
    currentRefinement: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.changeRefinement = this.changeRefinement.bind(this);
    this.setChecks = this.setChecks.bind(this);
    this.categoriesMapping = {
      'Basic Needs & Shelter': ['Basic Needs & Shelter'],
      'Eviction Prevention': ['Eviction Prevention'],
      'Health & Medical': ['Health & Medical'],
      Housing: ['Housing'],
      Legal: ['Legal'],
      Employment: ['Employment'],
    };
    const checks = this.setChecks();
    this.state = {
      isChecked: checks,
    };
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    const { currentRefinement } = this.props;
    if (currentRefinement !== prevProps.currentRefinement) {
      const checks = this.setChecks();
      // setState is done in a condition so it won't create loop
      this.setState({ isChecked: checks }); // eslint-disable-line react/no-did-update-set-state
    }
  }

  setChecks() {
    const { currentRefinement } = this.props;
    const mapKeys = Object.keys(this.categoriesMapping);
    const checks = [];
    for (let i = 0; i < mapKeys.length; i++) {
      const key = mapKeys[i];
      let atLeastOneRefined = false;
      for (let i_1 = 0; i_1 < this.categoriesMapping[key].length; i_1++) {
        const val = this.categoriesMapping[key][i_1];
        if (currentRefinement.includes(val)) {
          atLeastOneRefined = true;
          break;
        }
      }
      checks[key] = atLeastOneRefined;
    }
    return checks;
  }

  changeRefinement(key, event) { // eslint-disable-line no-unused-vars
    const { refine } = this.props;
    const { items } = this.props;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (this.categoriesMapping[key].includes(item.label)) {
        refine(item.value);
      }
    }
  }

  refinementHasResults(key) {
    const { items } = this.props;
    return items.find(item => item.label === key);
  }

  render() {
    const { isChecked } = this.state;
    const mapKeys = Object.keys(this.categoriesMapping);
    return (
      <div className="refinement-wrapper">
        <p className="refinement-title">Categories</p>
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

export default connectRefinementList(CategoriesRefinementList);
