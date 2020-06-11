import React, { Component } from 'react';
import { STEPS } from 'components/ui/Modal/ServiceDiscoveryModal/constants';
import ServiceDiscoveryResults from '../../../../pages/ServiceDiscoveryResults/ServiceDiscoveryResults';
import { BaseModal } from '../Modal';
import * as dataService from '../../../../utils/DataService';

import styles from './ServiceDiscoveryModal.scss';


class ServiceDiscoveryModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentStep: 0,
      eligibilities: [],
      subcategories: [],
      checkedItems: {},
    };

    this.goToNextStep = this.goToNextStep.bind(this);
  }

  componentDidMount() {
    const { categoryId } = this.props;

    dataService.get(`api/eligibilities?category_id=${categoryId}`).then(response => {
      const { eligibilities } = response;
      this.setState({
        eligibilities,
      });
    });

    dataService.get(`api/categories/subcategories?id=${categoryId}`).then(response => {
      const { categories } = response;
      this.setState({
        subcategories: categories,
      });
    });
  }

  goToNextStep() {
    const { currentStep } = this.state;
    this.setState({ currentStep: currentStep + 1 });
  }

  handleCheckboxClick(optionId) {
    const { checkedItems } = this.state;
    checkedItems[optionId] = !checkedItems[optionId];
  }

  render() {
    const { closeModal, steps } = this.props;
    const {
      eligibilities, subcategories, checkedItems, currentStep,
    } = this.state;

    const getModalContent = () => {
      switch (steps[currentStep]) {
        case STEPS.ELIGIBILITIES:
          return (
            <div className={styles.contentContainer}>
              <h1>Tell us more about you</h1>
              <h2>Select any eligibilities you identify with.</h2>
              <ul>
                {eligibilities.map(option => (
                  <li className={styles.listOption} key={option.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={checkedItems[option.id]}
                        onChange={() => this.handleCheckboxClick(option.id)}
                      />
                      <span>{option.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          );
        case STEPS.SUBCATEGORIES:
          return (
            <div className={styles.contentContainer}>
              <h1>Tell us more about you</h1>
              <h2>What are you currently looking for? Select all that apply.</h2>
              <ul>
                {subcategories.map(option => (
                  <li className={styles.listOption} key={option.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={checkedItems[option.id]}
                        onChange={() => this.handleCheckboxClick(option.id)}
                      />
                      <span>{option.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          );
        case STEPS.RESULTS:
        default:
          return (
            <div className={styles.contentContainer}>
              <ServiceDiscoveryResults />
            </div>
          );
      }
    };

    const modalFooter = (
      <div className={styles.footer}>
        <button type="button" className={styles.actionBack} onClick={e => { e.stopPropagation(); closeModal(); }}>Back</button>
        <button type="button" className={styles.actionSubmit} onClick={this.goToNextStep}>Submit</button>
      </div>
    );

    return (
      <BaseModal
        isFullScreen
        backButtonText="All resource guides"
        modalContent={getModalContent()}
        modalFooter={
          (steps[currentStep] === STEPS.ELIGIBILITIES || steps[currentStep] === STEPS.SUBCATEGORIES)
          && modalFooter
        }
        {...this.props}
      />
    );
  }
}
export default ServiceDiscoveryModal;
