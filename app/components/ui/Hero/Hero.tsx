import React from "react";
import styles from "./Hero.module.scss";
import classNames from "classnames";

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
          {buttons.map((button, index) => (
            <a key={index} href={button.slug} className={styles.button}>
              {button.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
