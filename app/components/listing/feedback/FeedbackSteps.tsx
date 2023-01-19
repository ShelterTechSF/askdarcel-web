import React from 'react';

import { icon } from 'assets';
import type { SubmittedState, StepState, TagType, VoteType } from './constants';
import styles from './FeedbackSteps.module.scss';

export const VoteButtons = ({
  vote,
  onVoteChange,
}: {
  vote: VoteType;
  onVoteChange: (v: VoteType) => void;
}) => (
  <>
    <div className={`${styles.stepsPrompt} ${styles.votePrompt}`}>
      How was your experience on this site?
    </div>
    <div className={styles.voteIcons}>
      <div onClick={() => onVoteChange('upvote')} role="button" tabIndex={-1}>
        <img
          src={icon(`upvote${vote === 'upvote' ? '-active' : ''}`)}
          alt="upvote"
        />
      </div>
      <div onClick={() => onVoteChange('downvote')} role="button" tabIndex={-2}>
        <img
          src={icon(`downvote${vote === 'downvote' ? '-active' : ''}`)}
          alt="downvote"
        />
      </div>
    </div>
  </>
);

export const FeedbackTags = ({
  tagOptions,
  onSelectTag,
}: {
  tagOptions: readonly TagType[];
  onSelectTag: (i: number) => void;
}) => (
  <div className={styles.feedbackTags}>
    <div className={styles.stepsPrompt}>What can be improved?</div>
    <div className={styles.feedbackTagsContainer}>
      {tagOptions.map(({ tag, selected }, pos) => {
        const selectedStyle = selected ? styles.selectedTag : '';
        return (
          <div
            key={tag}
            role="button"
            tabIndex={0}
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

export const Review = ({
  reviewValue,
  onReviewChange,
  isReviewRequired,
}: {
  reviewValue: string;
  onReviewChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isReviewRequired: boolean;
}) => (
  <div className={styles.feedbackReview}>
    <div className={styles.stepsPrompt}>
      Please provide your feedback below:
    </div>
    <textarea
      className={styles.feedbackTextarea}
      placeholder={`Type your feedback here ${
        !isReviewRequired ? '(optional)' : ''
      }`}
      value={reviewValue}
      onChange={onReviewChange}
    />
  </div>
);

export const SubmitMessage = ({ closeModal }: { closeModal: () => void }) => (
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
}: {
  step: StepState;
  vote: VoteType;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSubmit: () => void;
  isReviewRequired: boolean;
  isSubmitted: SubmittedState;
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
