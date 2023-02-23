import React from 'react';
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from 'pure-react-carousel';

import styles from './BreakingNews.module.scss';

const BreakingNews = () => (
  <div className={styles.container}>
    <div className={styles.title}>
      <h1>News</h1>
      <CarouselProvider
        naturalSlideWidth={300}
        naturalSlideHeight={400}
        isIntrinsicHeight
        totalSlides={3}
      >
        <Slider>
          <Slide index={0}>
            <h3>headline 1 | 2022-12-01T00:00:00.000Z</h3>
            Lorem Ipsum etc etc etc 1
          </Slide>
          <Slide index={1}>
            <h3>headline 2 | 2022-12-01T00:00:00.000Z</h3>
            Lorem Ipsum etc etc etc 2
          </Slide>
          <Slide index={2}>
            <h3>headline 3 | 2022-12-01T00:00:00.000Z</h3>
            Lorem Ipsum etc etc etc 3
          </Slide>
        </Slider>
        <ButtonBack>Back</ButtonBack>
        <ButtonNext>Next</ButtonNext>
      </CarouselProvider>
    </div>
  </div>
);

export default BreakingNews;
