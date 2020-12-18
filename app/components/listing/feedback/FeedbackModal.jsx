import React, { Fragment, useState } from 'react';

import {
  FeedbackTags, Review, SubmitMessage, tagList,
} from './FeedbackSteps';

import { images } from '../../../assets';
import './FeedbackModal.scss';
import { addFeedback } from '../../../utils/DataService';

const getUrl = ([path, id]) => (
  `/api/${path === 'organizations' ? 'resources' : path}/${id}/feedbacks`
);

const FeedbackModal = ({ closeModal }) => {
  const [upvote, setUpvote] = useState(false);
  const [downvote, setDownvote] = useState(false);
  const [tagOptions, setTags] = useState(tagList);
  const [review, setReview] = useState('');
  const [step, setStep] = useState(0);
  const [reviewRequired, setReviewRequired] = useState(false);
  const [isSubmitted, setSubmit] = useState(false);

  const handleUpvote = () => {
    // should we reset states if user changes between upvote and downvote?
    setStep(0);
    setDownvote(false);
    setReviewRequired(false);
    setReview('');
    setTags(tagList);
    setUpvote(prevState => !prevState);
  };

  const handleDownvote = () => {
    setStep(0);
    setUpvote(false);
    setReview('');
    setDownvote(prevState => !prevState);
  };

  const handleSelectTag = pos => {
    // pos = position of tag in array of tagOptions
    const updatedTags = tagOptions.map(t => ({ ...t }));
    updatedTags[pos].selected = !updatedTags[pos].selected;
    setTags(updatedTags);
    const { tag, selected } = updatedTags[pos];
    if (tag === 'Other') setReviewRequired(selected);
  };

  const handleReview = e => {
    e.preventDefault();
    setReview(e.target.value);
  };

  const handleBack = () => setStep(prev => (upvote ? prev - 2 : prev - 1));

  const handleNext = () => {
    if ((!upvote && !downvote) || step >= 2) return;
    if (upvote) {
      setStep(prev => prev + 2);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const path = window.location.pathname.slice(1).split('/');
    const rating = upvote ? 'true' : 'false';
    const tags = tagOptions.filter(({ selected }) => selected).map(({ tag }) => tag);

    const feedback = {
      rating,
      tags,
      review,
    };
    const url = getUrl(path);

    addFeedback(url, feedback)
      .then(({ msg }) => {
        if (msg === 'Success!') setSubmit(true);
      })
      .catch(err => console.log(err));
  };

  const steps = [
    null,
    <FeedbackTags tagOptions={tagOptions} onSelectTag={handleSelectTag} />,
    <Review
      reviewValue={review}
      reviewRequired={reviewRequired}
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
          <div className="vote-header">
            How was your experience on this site?
          </div>
          <div className="vote-icons">
            <div onClick={handleUpvote} role="button" tabIndex="-1">
              <img
                src={images.icon(`upvote${upvote ? '-active' : ''}`)}
                alt="upvote"
              />
            </div>
            <div onClick={handleDownvote} role="button" tabIndex="-2">
              <img
                src={images.icon(`downvote${downvote ? '-active' : ''}`)}
                alt="downvote"
              />
            </div>
          </div>
          <Fragment>{steps[step]}</Fragment>
          <div className="feedback-action-buttons">
            {step > 0 && (
              <button
                type="button"
                className="button back-button"
                onClick={handleBack}
              >
                Back
              </button>
            )}
            {step < 2 ? (
              <button type="button" className="button" onClick={handleNext}>
                Next
              </button>
            ) : (
              <button
                type="button"
                className="button"
                // need more details how to handle review validation
                disabled={reviewRequired && review.length < 5}
                onClick={handleSubmit}
              >
                Submit
              </button>
            )}
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default FeedbackModal;
