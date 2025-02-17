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
      href="javascript:void( window.open( 'https://forms.office.com/g/vns6t1Y5uJ', 'blank', 'scrollbars=yes, toolbar=no, width=700, height=1000' ) ) "
    >
      Sign up today
    </Button>
  </div>
);
