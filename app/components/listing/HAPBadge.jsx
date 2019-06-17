import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import HAPcertified from '../../assets/img/ic-hap-certified.svg';

import styles from './HAPBadge.scss';

class HAPBadge extends React.Component {
  render() {
    const { resource } = this.props;

    return resource.certified ? (
      <div className={styles.hapBadge}>
        <img className={styles.hapIcon} src={HAPcertified} alt="Verified by the Homeless Assistance Project" />
        <span className={styles.hapIconTitle}>{`Verified by HAP ${moment(resource.certified_at).format('MMM DD, YYYY')}`}</span>
      </div>
    ) : null;
  }
}

HAPBadge.propTypes = {
  resource: PropTypes.object.isRequired,
};

export default HAPBadge;
