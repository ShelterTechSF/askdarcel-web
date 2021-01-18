import React from 'react';
import styles from './FeedbackSteps.module.scss';

export const FeedbackTags = ({ tagOptions, onSelectTag }) => (
  <div className={styles.feedbackTags}>
    <div className={styles.prompts}>What can be improved?</div>
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
    <div className={styles.prompts}>
      Please provide your feedback below:
    </div>
    <textarea
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
}) => (
  <div>
    {step > -1 && (
      <button type="button" className={styles.backButton} onClick={onPrevStep}>
        Back
      </button>
    )}
    {step < 1 ? (
      <button
        type="button"
        className={styles.navButtons}
        onClick={onNextStep}
        disabled={!vote.length}
      >
        Next
      </button>
    ) : (
      <button
        type="button"
        className={styles.navButtons}
        disabled={isReviewRequired}
        onClick={onSubmit}
      >
        Submit
      </button>
    )}
  </div>
);

export const TAG_LIST = [
  {
    tag: 'Contact Information',
    selected: false,
  },
  {
    tag: 'Hours',
    selected: false,
  },
  {
    tag: 'Address',
    selected: false,
  },
  {
    tag: 'Website Link',
    selected: false,
  },
  {
    tag: 'Information missing',
    selected: false,
  },
  {
    tag: 'Other',
    selected: false,
  },
].map(tag => Object.freeze(tag));
