import React from 'react';

import styles from './Button.module.scss';

/**
 * A wider than normal button. Currently, this component only has two sizes (medium, large) and
 * sets the background and font color by default. This can be expanded/parameterized in the future.
 */

type ButtonType = 'button' | 'submit' | 'reset';

export const Button = ({
  text,
  onClick,
  buttonType = 'button',
  addClass,
}: {
  text: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  readonly buttonType?: ButtonType;
  addClass?: string;
}) => (
  <button
    onClick={onClick}
     // ES Lint complains about the type attr being set dynamically, but given that type attr is
     // limited to ButtonType enums, commenting this out should be safe
     /* eslint-disable-next-line react/button-has-type */
    type={buttonType}
    className={`${styles.button} ${addClass || ''}`}
  >
    {text}
  </button>
);
