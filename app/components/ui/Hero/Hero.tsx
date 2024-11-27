import React from "react";
import classNames from "classnames";
import styles from "./Hero.module.scss";
import { Button } from "../inline/Button/Button";
import { Link } from "models/Strapi";

/**
 * Displays a hero section on the homepage
 */
const Hero = ({
  backgroundImage,
  title,
  description,
  buttons,
}: {
  backgroundImage: string;
  title: string;
  description: string;
  buttons: Link[];
}) => {
  const cardStyles = classNames(styles.contentCard);
  return (
    <div data-testid={"hero"}>
      <div
        className={styles.hero}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className={cardStyles}>
          <div className={styles.content}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>{description}</p>
            <div className={styles.buttons}>
              {buttons.map((button, i) => (
                <Button
                  key={button.text}
                  variant={i === 0 ? "primary" : "secondary"}
                  size="lg"
                  arrowVariant="after"
                  href={button.url}
                >
                  {button.text}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
