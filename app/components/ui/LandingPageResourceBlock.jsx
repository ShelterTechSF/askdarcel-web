import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { LandingPageCard, LandingPageTextCard } from './LandingPageCards';
import Carousel from './Carousel';

const HOST_QUERY = '/search?query=';

class LandingPageResourceBlock extends Component {
  render() {
    const { children, config } = this.props;
    const cards = config.CARDS.map(category => {
      const key = category.query || category.resource;
      const query = category.query ? HOST_QUERY + category.query : null;
      if (category.imgClass) {
        return (
          <LandingPageCard
            title={category.title}
            content={category.content}
            query={query}
            imgClass={category.imgClass}
            key={key}
            resource={category.resource}
          />
        );
      }
      return (
        <LandingPageTextCard
          key={key}
          title={category.title}
          query={category.query}
          resource={category.resource}
        />
      );
    });

    return (
      <div className="landing-page-resource-block">
        <div className="landing-page-resource-block__resources">
          {children}
          <div className="landing-page-resource-block__resources-title-container">
            <div className="landing-page-resource-block__resources-title">
              <h1>
                {config.TITLE.BEFORE_BLUE_WORD
                  && `${config.TITLE.BEFORE_BLUE_WORD} `}
                <span className="blue-word">
                  {config.TITLE.BLUE_WORD}
                </span>
                {config.TITLE.AFTER_BLUE_WORD
                  && ` ${config.TITLE.AFTER_BLUE_WORD}`}
              </h1>
            </div>
            {
              config.LINKS
                && (
                  <div className="landing-page-resource-block__resources-links">
                  {
                    config.LINKS.map(link => (
                      <div key={`link_${link.QUERY_CATEGORY || link.URL}`} className="landing-page-resource-block__resources-link">
                        {
                          link.QUERY_CATEGORY
                            && (
                              <Link to={`/search?refinementList[categories][0]=${encodeURIComponent(link.QUERY_CATEGORY)}`}>
                                <span>{link.TEXT}</span>
                              </Link>
                            )
                        }
                        {
                          link.URL
                            && (
                              <a href={link.URL}>{link.TEXT}</a>
                            )
                        }
                      </div>
                    ))
                  }
                  </div>
                )
            }
          </div>
          {
            config.TITLE.DESCRIPTION
              && (
                <div className="landing-page-resource-block__resources-description">
                  {config.TITLE.DESCRIPTION}
                </div>
              )
          }
          {
            (config.CAROUSEL
              && (
                <div className="landing-page-resource-block__carousel">
                  <Carousel numSlots={config.CAROUSEL.NUM_SLOTS || 4}>
                    {cards}
                  </Carousel>
                </div>
              ))
              || (
                <div className="landing-page-resource-block__cards">
                  {cards}
                </div>
              )
          }
        </div>
      </div>
    );
  }
}

LandingPageResourceBlock.props = {
  config: PropTypes.shape({
    TITLE: PropTypes.shape({
      BEFORE_BLUE_WORD: PropTypes.string,
      BLUE_WORD: PropTypes.string,
      AFTER_BLUE_WORD: PropTypes.string,
      DESCRIPTION: PropTypes.string,
    }),
    LINKS: PropTypes.arrayOf(
      PropTypes.shape({
        URL: PropTypes.string,
        PATH: PropTypes.string,
        QUERY_ELIGIBILITY: PropTypes.string,
        TEXT: PropTypes.string,
      })
    ),
    CARDS: PropTypes.array,
    CAROUSEL: PropTypes.shape({
      NUM_SLOTS: PropTypes.number,
    }),
  }),
};

export default LandingPageResourceBlock;
