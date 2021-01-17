import React, { Fragment, useState } from 'react';
import { cloneDeep } from 'lodash';
import {
  FeedbackTags,
  Review,
  SubmitMessage,
  TAG_LIST,
  NavigationButtons,
} from './FeedbackSteps';
import './FeedbackModal.scss';
import { images } from '../../../assets';
import { addFeedback } from '../../../utils/DataService';

const UPVOTE = 'upvote';
const DOWNVOTE = 'downvote';

const FeedbackModal = ({ service, resource, closeModal }) => {
  const [vote, setVote] = useState('');
  const [tagOptions, setTags] = useState(TAG_LIST);
  const [review, setReview] = useState('');
  const [step, setStep] = useState(-1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleVote = voteType => {
    setStep(-1);
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

  const handleReview = e => {
    e.preventDefault();
    setReview(e.target.value);
  };

  const handleBack = () => (
    setStep(prev => (vote === UPVOTE ? prev - 2 : prev - 1))
  );

  const handleNext = () => {
    if (!vote.length || step >= 1) return;
    if (vote === UPVOTE) {
      setStep(prev => prev + 2);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const tags = tagOptions
      .filter(({ selected }) => selected)
      .map(({ tag }) => tag);

    const feedback = {
      rating: vote,
      tags,
      review,
    };

    const url = !service
      ? `/api/resources/${resource.id}/feedbacks`
      : `/api/services/${service.id}/feedbacks`;

    addFeedback(url, feedback)
      .then(({ msg }) => {
        if (msg === 'Success!') setIsSubmitted(true);
      })
      .catch(err => console.log(err));
  };

  const isReviewRequired = (
    tagOptions.some(({ tag, selected }) => tag === 'Other' && selected)
    && vote === DOWNVOTE
  );

  const steps = [
    <FeedbackTags tagOptions={tagOptions} onSelectTag={toggleSelectedTag} />,
    <Review
      reviewValue={review}
      isReviewRequired={isReviewRequired}
      onReviewChange={handleReview}
    />,
  ];

  return (
    <div className="feedback-modal-body">
      <div
        className="close-modal"
        role="button"
        tabIndex="0"
        onClick={closeModal}
      >
        <img src={images.icon('close')} alt="close" />
      </div>
      <div className="feedback-header">
        <img src={images.icon('feedback-blue')} alt="feedback" />
        <span>Share your Feedback</span>
      </div>
      <div className="feedback-subheader">
        The team usually replies within a day.
      </div>
      {isSubmitted ? (
        <SubmitMessage closeModal={closeModal} />
      ) : (
        <Fragment>
          <div className="steps-prompt">
            How was your experience on this site?
          </div>
          <div className="vote-icons">
            <div onClick={() => handleVote(UPVOTE)} role="button" tabIndex="-1">
              <img
                src={images.icon(`upvote${vote === UPVOTE ? '-active' : ''}`)}
                alt="upvote"
              />
            </div>
            <div
              onClick={() => handleVote(DOWNVOTE)}
              role="button"
              tabIndex="-2"
            >
              <img
                src={images.icon(`downvote${vote === DOWNVOTE ? '-active' : ''}`)}
                alt="downvote"
              />
            </div>
          </div>
          {steps[step]}
          <NavigationButtons
            step={step}
            vote={vote}
            handleBack={handleBack}
            handleNext={handleNext}
            handleSubmit={handleSubmit}
            isReviewRequired={isReviewRequired}
          />
        </Fragment>
      )}
    </div>
  );
};

export default FeedbackModal;
