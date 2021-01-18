import React from 'react';
import './FeedbackSteps.module.scss';

export const FeedbackTags = ({ tagOptions, onSelectTag }) => (
  <div className="feedback-tags">
    <div className="steps-prompt">
      What can be improved?
    </div>
    <div className="feedback-tags-container">
      {tagOptions.map(({ tag, selected }, pos) => (
        <div
          key={tag}
          role="button"
          tabIndex="0"
          className={`feedback-tag ${selected ? 'selected' : ''}`}
          onClick={() => onSelectTag(pos)}
        >
          {tag}
        </div>
      ))}
    </div>
  </div>
);

export const Review = ({ reviewValue, onReviewChange, isReviewRequired }) => (
  <div className="feedback-review">
    <div className="steps-prompt">
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
    <div className="feedback-submit-header">Thank you for your feedback!</div>
    <div className="feedback-submit-subheader">
      Your feedback will help us continue to improve this guide.
    </div>
    <div className="feedback-action-buttons">
      <button type="button" className="nav-button" onClick={closeModal}>
        Close
      </button>
    </div>
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
  <div className="feedback-action-buttons">
    {step > -1 && (
      <button type="button" className="nav-button back-button" onClick={onPrevStep}>
        Back
      </button>
    )}
    {step < 1 ? (
      <button
        type="button"
        className="nav-button"
        onClick={onNextStep}
        disabled={!vote.length}
      >
        Next
      </button>
    ) : (
      <button
        type="button"
        className="nav-button"
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
