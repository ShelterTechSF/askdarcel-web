import React from 'react';
import { UPVOTE, DOWNVOTE } from './constants';

import { images } from '../../../assets';
import styles from './FeedbackSteps.module.scss';

export const VoteButtons = ({ vote, onVoteChange }) => (
  <>
    <div className={`${styles.stepsPrompt} ${styles.votePrompt}`}>
      How was your experience on this site?
    </div>
    <div className={styles.voteIcons}>
      <div onClick={() => onVoteChange(UPVOTE)} role="button" tabIndex="-1">
        <img
          src={images.icon(`upvote${vote === UPVOTE ? '-active' : ''}`)}
          alt="upvote"
        />
      </div>
      <div
        onClick={() => onVoteChange(DOWNVOTE)}
        role="button"
        tabIndex="-2"
      >
        <img
          src={images.icon(`downvote${vote === DOWNVOTE ? '-active' : ''}`)}
          alt="downvote"
        />
      </div>
    </div>
  </>
);

export const FeedbackTags = ({ tagOptions, onSelectTag }) => (
  <div className={styles.feedbackTags}>
    <div className={styles.stepsPrompt}>What can be improved?</div>
    <div className={styles.feedbackTagsContainer}>
      {tagOptions.map(({ tag, selected }, pos) => {
        const selectedStyle = selected ? styles.selectedTag : '';
        return (
          <div
            key={tag}
            role="button"
            tabIndex="0"
            className={`${styles.feedbackTag} ${selectedStyle}`}
            onClick={() => onSelectTag(pos)}
          >
            {tag}
          </div>
        );
      })}
    </div>
  </div>
);

export const Review = ({ reviewValue, onReviewChange, isReviewRequired }) => (
  <div className={styles.feedbackReview}>
    <div className={styles.stepsPrompt}>
      Please provide your feedback below:
    </div>
    <textarea
      className={styles.feedbackTextarea}
      type="text"
      placeholder={`Type your feedback here ${
        !isReviewRequired ? '(optional)' : ''
      }`}
      value={reviewValue}
      onChange={onReviewChange}
    />
  </div>
);

export const SubmitMessage = ({ closeModal }) => (
  <>
    <div className={styles.feedbackSubmitHeader}>
      Thank you for your feedback!
    </div>
    <div className={styles.feedbackSubmitSubheader}>
      Your feedback will help us continue to improve this guide.
    </div>
    <button type="button" className={styles.navButtons} onClick={closeModal}>
      Close
    </button>
  </>
);

export const NavigationButtons = ({
  step,
  vote,
  onPrevStep,
  onNextStep,
  onSubmit,
  isReviewRequired,
  isSubmitted,
}) => (
  <div className={styles.navButtonsContainer}>
    {step !== 'start' && (
      <button type="button" className={styles.backButton} onClick={onPrevStep}>
        Back
      </button>
    )}
    {step === 'review' ? (
      <button
        type="button"
        className={styles.navButtons}
        disabled={isReviewRequired || isSubmitted === 'submitting'}
        onClick={onSubmit}
      >
        {isSubmitted === 'submitting' ? 'Submitting...' : 'Submit'}
      </button>
    ) : (
      <button
        type="button"
        className={styles.navButtons}
        onClick={onNextStep}
        disabled={vote === 'neither'}
      >
        Next
      </button>
    )}
  </div>
);
