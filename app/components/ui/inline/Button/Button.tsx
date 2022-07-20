import React from 'react';

import styles from './Button.module.scss';

type ButtonType = 'button' | 'submit' | 'reset';
type StyleType = 'transparent';

const Button = ({
  children,
  onClick,
  buttonType = 'button',
  addClass,
  styleType,
  tabIndex,
}: {
  children: string | JSX.Element;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  readonly buttonType?: ButtonType;
  addClass?: string;
  styleType?: StyleType;
  tabIndex?: number;
}) => {
  let buttonClass;
  if (styleType === 'transparent') {
    buttonClass = styles.buttonTransparent;
  } else {
    buttonClass = styles.button;
  }

  return (
    <button
      onClick={onClick}
      // ES Lint complains about the type attr being set dynamically, but given that type attr is
      // limited to ButtonType enums, commenting this out should be safe
      /* eslint-disable-next-line react/button-has-type */
      type={buttonType}
      tabIndex={tabIndex}
      className={`${buttonClass} ${addClass || ''}`}
    >
      {children}
    </button>
  );
};

export default Button;
