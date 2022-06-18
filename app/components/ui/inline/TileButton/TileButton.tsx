import React from 'react';

import styles from './TileButton.module.scss';

/**
 * A wider than normal button. Currently, this component only has two sizes (medium, large) and
 * sets the background and font color by default. This can be expanded/parameterized in the future.
 */

type Size = 'medium' | 'large';
type ButtonType = 'button' | 'submit' | 'reset';

const TileButton = ({
  text,
  onClick,
  buttonType = 'button',
  size,
  addClass,
}: {
  text: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  readonly buttonType?: ButtonType;
  size?: Size;
  addClass?: string;
}) => (
  <button
    onClick={onClick}
     // ES Lint complains about the type attr being set dynamically, but given that type attr is
     // limited to ButtonType enums, commenting this out should be safe
     /* eslint-disable-next-line react/button-has-type */
    type={buttonType}
    className={`${size ? styles[size] : ''} ${addClass || ''}`}
  >
    {text}
  </button>
);

export default TileButton;
