import React from "react";

import styles from "./Button.module.scss";

type ButtonType = "button" | "submit" | "reset";
type StyleType = "transparent" | "text";

export const Button = ({
  children,
  onClick,
  buttonType = "button",
  addClass,
  styleType,
  tabIndex,
  disabled,
}: {
  children: string | JSX.Element;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  readonly buttonType?: ButtonType;
  addClass?: string;
  styleType?: StyleType;
  tabIndex?: number;
  disabled?: boolean;
}) => {
  let buttonClass;
  if (styleType === "transparent") {
    buttonClass = styles.buttonTransparent;
  } else if (styleType === "text") {
    buttonClass = styles.textButton;
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
      className={`${buttonClass} ${addClass || ""}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
