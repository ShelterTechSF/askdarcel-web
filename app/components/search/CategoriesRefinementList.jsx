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
      'Housing': ['Housing'],
      'Legal': ['Legal'],
      'Employment': ['Employment'],
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
      this.setState({ isChecked:checks });
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

  changeRefinement(key, event) {
    const { refine } = this.props;
    const { items } = this.props;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (this.categoriesMapping[key].includes(item.label)) {
        refine(item.value);
      }
    }
  }

  render() {
    const { isChecked } = this.state;
    const mapKeys = Object.keys(this.categoriesMapping);
    return (
      <div className="refinement-wrapper">
        <label className="refinement-title">Categories</label>
        <ul className="refinement-ul">
          {mapKeys.map(key => (
            // for each map key, display it as a filtering option
            // for onClick of each option, call refine on the values of the key
            <li key={key} className={'refine-li ' + (isChecked[key] ? 'active' : '')}>
              <label>
                <input
                  type="checkbox"
                  className="refine-checkbox"
                  onChange={this.changeRefinement.bind(this, key)}
                  checked={isChecked[key]}
                />
                {key}
              </label>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default connectRefinementList(CategoriesRefinementList);
