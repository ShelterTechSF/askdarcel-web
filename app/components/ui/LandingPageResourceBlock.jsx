import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { LandingPageCard, LandingPageTextCard } from './LandingPageCards';
import Carousel from './Carousel';

const HOST_QUERY = '/search?query=';

class LandingPageResourceBlock extends Component {
  render() {
    const cards = this.props.config.CARDS.map(category => {
      const key = category.query || category.resource;
      const query = category.query ? HOST_QUERY + category.query : null;
      if (category.imgClass) {
        return <LandingPageCard
          title={category.title}
          content={category.content}
          query={query}
          imgClass={category.imgClass}
          key={key}
          resource={category.resource}
        />
      } else {
        return <LandingPageTextCard
          key={ key }
          title={ category.title }
          query={ category.query }
          resource={ category.resource }
        />
      }
    });

    return (
      <div className="landing-page-resource-block">
        <div className="landing-page-resource-block__resources">
          {this.props.children}
          <div className="landing-page-resource-block__resources-title-container">
            <div className="landing-page-resource-block__resources-title">
              <h1>
                {this.props.config.TITLE.BEFORE_BLUE_WORD
                  && this.props.config.TITLE.BEFORE_BLUE_WORD + ' '}
                <span className="blue-word">
                  {this.props.config.TITLE.BLUE_WORD}
                </span>
                {this.props.config.TITLE.AFTER_BLUE_WORD
                  && ' ' + this.props.config.TITLE.AFTER_BLUE_WORD}
              </h1>
            </div>
            {
              this.props.config.LINK &&
                <div className="landing-page-resource-block__resources-link">
                  {
                    this.props.config.LINK.QUERY_CATEGORY && (
                      <Link to={`/search?refinementList[categories][0]=${encodeURIComponent(this.props.config.LINK.QUERY_CATEGORY)}`}>
                        <span>{this.props.config.LINK.TEXT}</span>
                      </Link>)
                  }
                  {
                    this.props.config.LINK.URL && (
                      <a href={this.props.config.LINK.URL}>{this.props.config.LINK.TEXT}</a>)
                  }
                </div>
            }
          </div>
          {
            this.props.config.TITLE.DESCRIPTION &&
              <div className="landing-page-resource-block__resources-description">
                { this.props.config.TITLE.DESCRIPTION }
              </div>
          }
          <div className="landing-page-resource-block__cards">
          {
            this.props.config.CAROUSEL &&
              (<Carousel numSlots={ this.props.config.CAROUSEL.NUM_SLOTS || 4 }>
                { cards }
              </Carousel>) ||
              cards
          }
          </div>
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
    LINK: PropTypes.shape({
      URL: PropTypes.string,
      QUERY_ELIGIBILITY: PropTypes.string,
      TEXT: PropTypes.string,
    }),
    CARDS: PropTypes.array,
    CAROUSEL: PropTypes.shape({
      NUM_SLOTS: PropTypes.number,
    }),
  }),
};

export default LandingPageResourceBlock;
