import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connectRefinementList } from 'react-instantsearch/connectors';

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
    this.eligibilitiesMapping = {
      Disability: ['Disability', 'Developmental Disability', 'Physical Disability', 'Learning Disability', 'Intellectual Disability'],
      Families: ['Families', 'Families with Babies'],
      Homeless: ['Homeless'],
      'Mental Health/Substance Use': ['Mental Illness', 'Substance Dependency'],
      'Re-Entry/Incarcerated': ['Re-Entry'],
      'Seniors (55+ years old)': ['Seniors (55+ years old)'],
      'Transitional Aged Youth': ['Transitional Aged Youth'],
      'Trauma Survivors': ['Trauma Survivors'],
      Veterans: ['Veterans'],
    };
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
    const { currentRefinement } = this.props;
    const mapKeys = Object.keys(this.eligibilitiesMapping);
    const checks = [];
    for (let i = 0; i < mapKeys.length; i++) {
      const key = mapKeys[i];
      let atLeastOneRefined = false;
      for (let i_1 = 0; i_1 < this.eligibilitiesMapping[key].length; i_1++) {
        const val = this.eligibilitiesMapping[key][i_1];
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
      if (this.eligibilitiesMapping[key].includes(item.label)) {
        refine(item.value);
      }
    }
  }

  render() {
    const { isChecked } = this.state;
    const mapKeys = Object.keys(this.eligibilitiesMapping);
    return (
      <div className="refinement-wrapper">
        <p className="refinement-title">Eligibilities</p>
        <ul className="refinement-ul">
          {mapKeys.map(key => (
            // for each map key, display it as a filtering option
            // for onClick of each option, call refine on the values of the key
            // eslint-disable-next-line prefer-template
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

export default connectRefinementList(EligibilitiesRefinementList);
