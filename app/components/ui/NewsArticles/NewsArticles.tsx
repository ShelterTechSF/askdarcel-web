import React, { useState, useEffect } from 'react';
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
  DotGroup
} from 'pure-react-carousel';


import * as dataService from "../../../utils/DataService";

import styles from './NewsArticles.module.scss';

interface NewsArticle {
  id: string;
  headline: string;
  effective_date: string;
  expiration_date: string;
  body: string;
  priority: number;
  url?: string;
}

const formatDate = (date: string): string => (
  new Date(date).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric' })
);

const ArticleItem = ({ article }: { article: NewsArticle }) => (
  <div className={styles.articleItem}>
    <div className={styles.newsContent}>
      <p className={styles.articleTitle}>
        {article.headline} <span className={styles.dateSeperator}>|</span>{" "}
        <span className={styles.articleDate}>
          {formatDate(article.effective_date)}
        </span>
      </p>
      <p className={styles.articleBody}>{article.body}</p>
    </div>
    {article.url && (
      <a href={article.url} className={styles.articleLink}>
        <span className={styles.linkText}>Read more →</span>
        <span className={styles.linkText_mobile}>More</span>
      </a>
    )}
  </div>
);

export const NewsArticles = () => {
    const [breakingNewsArticles, setBreakingNewsArticles] = useState<
      NewsArticle[]
    >([]);

    useEffect(() => {
      const fetchBreakingNewsArticles = async () => {
        const response = await dataService.get("/api/news_articles");
        const { news_articles }: { news_articles: NewsArticle[] } = response;
        setBreakingNewsArticles(news_articles);
      }

      fetchBreakingNewsArticles();
    }, []);

  const [showCarousel, setShowCarousel] = useState(true);
  if (breakingNewsArticles.length === 0) return null;

  return (
    <div
      className={`${styles.container} ${
        !showCarousel && styles.carouselHidden
      }`}
    >
      <div>
        <div className={styles.articlesHeader}>
          <p className={styles.title}>News</p>
          <button
            type="button"
            className={`${styles.toggleCarouselButton}`}
            onClick={() => setShowCarousel(!showCarousel)}
          >
            <i
              className={`material-icons ${
                showCarousel ? styles.hideCarouselChev : styles.showCarouselChev
              }`}
            >
              keyboard_arrow_down
            </i>
          </button>
        </div>
        {showCarousel && (
          <div className={styles.carouselContainer}>
            <CarouselProvider
              // naturalSlideWidth and Height are overwritten by our CSS but they need to
              // be included per the Carousel TS type
              naturalSlideWidth={300}
              naturalSlideHeight={400}
              isIntrinsicHeight
              totalSlides={breakingNewsArticles.length}
            >
              <div className={styles.sliderContainer}>
                <Slider
                  className={styles.slider}
                  classNameAnimation={styles.animation}
                >
                  {breakingNewsArticles.map((article, index) => (
                    <Slide key={article.id} index={index}>
                      <ArticleItem article={article} />
                    </Slide>
                  ))}
                </Slider>
                <ButtonBack
                  className={`${styles.carouselButton} ${styles.carouselButton_prev}`}
                >
                  <i className={`material-icons ${styles.chevronControls}`}>
                    keyboard_arrow_left
                  </i>
                </ButtonBack>
                <ButtonNext
                  className={`${styles.carouselButton}  ${styles.chevronControls} ${styles.carouselButton_next}`}
                >
                  <i className={`material-icons ${styles.chevronControls}`}>
                    keyboard_arrow_right
                  </i>
                </ButtonNext>
              </div>
              <DotGroup
                className={styles.dotGroup}
                showAsSelectedForCurrentSlideOnly
              />
            </CarouselProvider>
          </div>
        )}
      </div>
    </div>
  );
};
