import React from "react";
import classNames from "classnames";
import styles from "./Hero.module.scss";
import { Button } from "../inline/Button/Button";
import { Link } from "models/Strapi";

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
  return (
    <>
      <div
        className={styles.hero}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <HeroCard
          title={title}
          description={description}
          buttons={buttons}
          desktop
        />
      </div>
      <HeroCard title={title} description={description} buttons={buttons} />
    </>
  );
};

export default Hero;

const HeroCard = ({
  title,
  description,
  buttons,
  desktop = false,
}: {
  title: string;
  description: string;
  buttons: Link[];
  desktop?: boolean;
}) => {
  const cardStyles = classNames(
    styles.contentCard,
    desktop ? styles.desktop : styles.mobile
  );

  return (
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
  );
};
