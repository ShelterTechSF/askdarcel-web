import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const UserWay = ({ appID }) => {
  useEffect(() => {
    const userWayScriptId = 'userway-script';
    if (document.getElementById(userWayScriptId) != null) return;

    const userWayScript = document.createElement('script');
    userWayScript.id = userWayScriptId;
    userWayScript.type = 'text/javascript';
    userWayScript.async = true;
    userWayScript.src = 'https://cdn.userway.org/widget.js';
    userWayScript.setAttribute('data-account', appID);
    document.body.appendChild(userWayScript);
  });

  return (
    <noscript>
      Please ensure Javascript is enabled for purposes of
      <a href="https://userway.org">website accessibility</a>
    </noscript>
  );
};

UserWay.propTypes = {
  appID: PropTypes.string.isRequired,
};

export default UserWay;
