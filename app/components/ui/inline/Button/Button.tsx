import React from "react";
import classNames from "classnames";
import styles from "./Button.module.scss";

type ButtonType = "button" | "submit" | "reset";
type StyleType = "transparent" | "text" | "default";
type SizeType = "xs" | "sm" | "base" | "lg" | "xl";
type VariantType =
  | "primary"
  | "secondary"
  | "linkBlue"
  | "linkWhite"
  | "brandDark";

/**
 * NOTE: 😅 This component is an impressively complicated piece of code that
 * supports a combinatorial number of possibilities. It's a challenge to reason
 * about what particular combination of parameters to use to achieve your
 * desired presentation. It also appears incomplete as some style types are not
 * implemented yet. There's got to be a better way to express button variations
 * than a single component with over a dozen parameter levers. Let's continue
 * to use this component with caution until we emerge from the MVP stage of
 * this project and better understand our north star for subsequent rounds of
 * development.
 */
export const Button = ({
  children,
  onClick,
  buttonType = "button",
  addClass,
  styleType = "default",
  size = "base",
  variant = "primary",
  arrowVariant,
  iconVariant = "before",
  iconName,
  tabIndex,
  disabled,
  href,
  mobileFullWidth = true,
  isVisualOnly = false,
  isExternalLink,
}: {
  children: string | JSX.Element;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  readonly buttonType?: ButtonType;
  addClass?: string; // phase out as we replace old buttons with new
  styleType?: StyleType; // phase out as we replace old buttons with new
  size?: SizeType;
  variant?: VariantType;
  tabIndex?: number;
  disabled?: boolean;
  arrowVariant?: "before" | "after";
  iconVariant?: "before" | "after";
  iconName?: string; // use font awesome icon name without 'fa-'
  href?: string;
  mobileFullWidth?: boolean;
  isVisualOnly?: boolean; // Maintains button styling as visual cue clickable cards but hidden to screen readers
  isExternalLink?: boolean;
}) => {
  const buttonClass = classNames(
    styles.button,
    styles[`button--${styleType}`],
    styles[`button--${size}`],
    styles[`button--${variant}`],
    styles[`button--arrow-${arrowVariant}`],
    {
      [styles["mobile-full-width"]]: mobileFullWidth,
      [`${styles["button--link"]} ${styles[`button--link-${variant}`]}`]: href,
    }
  );

  const iconClass = classNames(
    `fas fa-${iconName}`,
    styles[`icon-${iconVariant}`]
  );

  const content = (
    <>
      {iconName && iconVariant === "before" && <span className={iconClass} />}
      {children}
      {iconName && iconVariant === "after" && <span className={iconClass} />}
    </>
  );

  if (isVisualOnly) {
    return (
      <p data-testid={"button-visualonly"} className={buttonClass} aria-hidden>
        {content}
      </p>
    );
  }

  // Links that follow same visual guidelines as buttons
  if (href) {
    const isExternal = isExternalLink ?? !/^[\/#]/.test(href);

    const linkProps = isExternal && { target: "_blank", rel: "noreferrer" };

    return (
      <a
        data-testid={"button-href"}
        href={href}
        className={buttonClass}
        {...linkProps}
      >
        {content}
      </a>
    );
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
      data-testid={"button"}
    >
      {content}
    </button>
  );
};
