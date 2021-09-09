import React, { useState } from 'react';
import { cloneDeep } from 'lodash';
import {
  VoteButtons,
  FeedbackTags,
  Review,
  SubmitMessage,
  NavigationButtons,
} from './FeedbackSteps';
import { TAG_LIST, DOWNVOTE } from './constants';
import { addFeedback } from '../../../utils/DataService';

import { icon } from 'assets';
import styles from './FeedbackModal.module.scss';

const FeedbackModal = ({ service, resource, closeModal }) => {
  const [vote, setVote] = useState('neither');
  const [tagOptions, setTags] = useState(TAG_LIST);
  const [review, setReview] = useState('');
  const [step, setStep] = useState('start');
  const [isSubmitted, setIsSubmitted] = useState(null);
  const handleVoteChange = voteType => {
    setStep('start');
    setVote(voteType);
  };

  /**
   * Toggle selected tags state with given position
   *
   * @param {int} pos - position of tag in array of tagOptions.
  */
  const toggleSelectedTag = pos => {
    const updatedTags = cloneDeep(tagOptions);
    updatedTags[pos].selected = !updatedTags[pos].selected;
    setTags(updatedTags);
  };

  const handleReviewChange = e => {
    e.preventDefault();
    setReview(e.target.value);
  };

  const handleNextStep = () => (
    (vote === DOWNVOTE && step === 'start') ? setStep('tags') : setStep('review')
  );

  const handlePrevStep = () => (
    (vote === DOWNVOTE && step === 'review') ? setStep('tags') : setStep('start')
  );

  const handleSubmit = () => {
    setIsSubmitted('submitting');
    const tags = tagOptions
      .filter(({ selected }) => selected)
      .map(({ tag }) => tag);

    const feedback = {
      rating: vote,
      tags,
      review,
    };

    const [source, sourceId] = !service
      ? ['resources', resource.id]
      : ['services', service.id];

    addFeedback(source, sourceId, feedback)
      .then(() => {
        setIsSubmitted('submitted');
      })
      .catch(err => console.log(err));
  };

  const isReviewRequired = (
    tagOptions.some(({ tag, selected }) => tag === 'Other' && selected)
    && vote === DOWNVOTE
  );

  const STEPS = {
    tags: (
      <FeedbackTags tagOptions={tagOptions} onSelectTag={toggleSelectedTag} />
    ),
    review: (
      <Review
        reviewValue={review}
        isReviewRequired={isReviewRequired}
        onReviewChange={handleReviewChange}
      />
    ),
  };

  return (
    <div className={styles.feedbackModalBody}>
      <div
        className={styles.closeModal}
        role="button"
        tabIndex="0"
        onClick={closeModal}
      >
        <img src={icon('close')} alt="close" />
      </div>
      <div className={styles.feedbackHeader}>
        <img src={icon('feedback-blue-header')} alt="feedback" />
        <span>Share your Feedback</span>
      </div>
      <div className={styles.feedbackSubheader}>
        The team usually replies within a day.
      </div>
      {isSubmitted === 'submitted' ? (
        <SubmitMessage closeModal={closeModal} />
      ) : (
        <div className={styles.stepsContainer}>
          {<VoteButtons vote={vote} onVoteChange={handleVoteChange} />}
          {STEPS[step]}
          <NavigationButtons
            step={step}
            vote={vote}
            onPrevStep={handlePrevStep}
            onNextStep={handleNextStep}
            onSubmit={handleSubmit}
            isReviewRequired={isReviewRequired}
            isSubmitted={isSubmitted}
          />
        </div>
      )}
    </div>
  );
};

export default FeedbackModal;
