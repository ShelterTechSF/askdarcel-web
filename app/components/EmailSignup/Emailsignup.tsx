/* eslint-disable no-script-url */

import React from "react";
import styles from "./EmailSignup.module.scss";
import { Button } from "components/ui/inline/Button/Button";
import classNames from "classnames";

export const EmailSignup = () => (
  <div className={classNames(styles.emailSignupContainer, "no-print")}>
    <h2>Join our mailing list to get updates</h2>
    <Button
      isExternalLink={false}
      href="javascript:void( window.open( 'https://dcyf.jotform.com/242708128943966', 'blank', 'scrollbars=yes, toolbar=no, width=700, height=500' ) ) "
    >
      Sign up today
    </Button>
  </div>
);
