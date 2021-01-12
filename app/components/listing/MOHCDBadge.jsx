import React from 'react';
import PropTypes from 'prop-types';
import MOHCDFunded from '../../assets/img/ic-mohcd-funded-services.svg';

import styles from './MOHCDBadge.module.scss';

class MOHCDBadge extends React.Component {
  isMOHCDFunded() {
    const { resource } = this.props;
    return resource.categories && resource.categories.some(category => category.name === 'MOHCD Funded');
  }

  render() {
    const isMOHCDFunded = this.isMOHCDFunded();

    return isMOHCDFunded ? (
      <div className={styles.mohcdBadge}>
        <img className={styles.mohcdIcon} src={MOHCDFunded} alt="Verified by MOHCD" />
        <span className={styles.mohcdIconTitle}>Funded by MOHCD</span>
      </div>
    ) : null;
  }
}

MOHCDBadge.propTypes = {
  resource: PropTypes.object.isRequired,
};

export default MOHCDBadge;
