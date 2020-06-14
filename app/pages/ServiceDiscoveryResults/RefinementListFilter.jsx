import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connectRefinementList } from 'react-instantsearch/connectors';
import styles from './ServiceDiscoveryResults.scss';

class RefinementListFilter extends Component {
  static propTypes = {
    refine: PropTypes.func.isRequired,
    currentRefinement: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    const checks = {};
    props.availableOptions
      .forEach(opt => { checks[opt.name] = props.selectedOptions[opt.id]; });

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
    const { availableOptions, currentRefinement } = this.props;
    const checks = {};
    availableOptions.forEach(opt => {
      checks[opt.name] = currentRefinement.includes(opt.name);
    });
    return checks;
  }

  changeRefinement(option, event) { // eslint-disable-line no-unused-vars
    const { refine } = this.props;
    const { currentRefinement } = this.props;
    const { isChecked } = this.state;
    let newRefinement;
    if (isChecked[option]) {
      // If option currently checked, remove from refinement
      newRefinement = currentRefinement.filter(value => option !== value);
    } else {
      // If key currently unchecked, add to refinement
      newRefinement = currentRefinement.concat(option);
    }
    refine(newRefinement);
  }

  render() {
    const { isChecked } = this.state;
    const { availableOptions } = this.props;

    return (
      <div className="refinement-wrapper">
        <ul className="refinement-ul">
          {availableOptions.map(option => (
            <label key={option.id} className={styles.checkBox}>
              {option.name}
              <input
                type="checkbox"
                name={option.name}
                id={option.id}
                value={isChecked[option.name]}
                checked={isChecked[option.name]}
                onChange={this.changeRefinement.bind(this, option.name)}
              />
            </label>
          ))}
        </ul>
      </div>
    );
  }
}

export default connectRefinementList(RefinementListFilter);
