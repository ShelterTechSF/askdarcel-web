import React from 'react';
import { Link } from 'react-router-dom';

import { CovidHeader } from '../CovidHeader';
import { GoogleDocEmbed } from '../GoogleDocEmbed';
import styles from './FoodList.module.scss';

export const FoodList = () => (
  <article>
    <CovidHeader headerText="Food resources for Individuals-In-Need" />
    <div className={styles.foodBannerContainer}>
      <Link to="/covid/foodmap">
        View the San Francisco Food Resource Map
      </Link>
    </div>
    <GoogleDocEmbed
      title="Covid-19 food resource guide"
      embedURL="https://docs.google.com/document/d/e/2PACX-1vSHQD1ro1zVMn8M7i0VB58G4GG47YJqbP5a4le9ycDHeoSDVL6anaUj0ZOkRxfRX4nW4N_O2R8k8i7n/pub?embedded=false"
    />
  </article>
);
