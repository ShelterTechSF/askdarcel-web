import React from "react";
import classNames from "classnames";
import styles from "./Hero.module.scss";
import { Button } from "../inline/Button/Button";

interface ButtonType {
  label: string;
  slug: string;
}

const Hero = ({
  backgroundImage,
  title,
  description,
  buttons,
}: {
  backgroundImage: string;
  title: string;
  description: string;
  buttons: ButtonType[];
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
  buttons: ButtonType[];
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
              key={button.label}
              variant={i === 0 ? "primary" : "secondary"}
              arrowVariant="after"
              href={button.slug}
            >
              {button.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
