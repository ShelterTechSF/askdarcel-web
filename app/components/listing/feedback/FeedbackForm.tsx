import React, { useState } from "react";
import { cloneDeep } from "lodash";
import { icon } from "assets";
import { TAG_LIST } from "./constants";
import type { StepState, SubmittedState, TagType, VoteType } from "./constants";
import { Organization, Service } from "../../../models";
import { addFeedback } from "../../../utils/DataService";
import {
  VoteButtons,
  FeedbackTags,
  Review,
  SubmitMessage,
  NavigationButtons,
} from "./FeedbackSteps";
import styles from "./FeedbackForm.module.scss";

export const FeedbackForm = ({
  service,
  resource,
  closeModal,
}: {
  service?: Service;
  resource: Organization;
  closeModal: () => void;
}) => {
  const [vote, setVote] = useState<VoteType>("neither");
  const [tagOptions, setTags] = useState<readonly TagType[]>(TAG_LIST);
  const [review, setReview] = useState("");
  const [step, setStep] = useState<StepState>("start");
  const [isSubmitted, setIsSubmitted] = useState<SubmittedState>(null);
  const handleVoteChange = (voteType: VoteType) => {
    setStep("start");
    setVote(voteType);
  };

  /**
   * Toggle selected tags state with given position
   *
   * @param {int} pos - position of tag in array of tagOptions.
   */
  const toggleSelectedTag = (pos: number) => {
    const updatedTags = cloneDeep(tagOptions);
    updatedTags[pos].selected = !updatedTags[pos].selected;
    setTags(updatedTags);
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setReview(e.target.value);
  };

  const handleNextStep = () =>
    vote === "downvote" && step === "start"
      ? setStep("tags")
      : setStep("review");

  const handlePrevStep = () =>
    vote === "downvote" && step === "review"
      ? setStep("tags")
      : setStep("start");

  const handleSubmit = () => {
    setIsSubmitted("submitting");
    const tags = tagOptions
      .filter(({ selected }) => selected)
      .map(({ tag }) => tag);

    const feedback = {
      rating: vote,
      tags,
      review,
    };

    const [source, sourceId] = !service
      ? (["resources", resource.id] as const)
      : (["services", service.id] as const);

    addFeedback(source, sourceId, feedback)
      .then(() => {
        setIsSubmitted("submitted");
      })
      .catch((err) => console.log(err)); // eslint-disable-line no-console
  };

  const isReviewRequired =
    tagOptions.some(({ tag, selected }) => tag === "Other" && selected) &&
    vote === "downvote";

  const STEPS = {
    start: null,
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
        tabIndex={0}
        onClick={closeModal}
      >
        <img src={icon("close")} alt="close" />
      </div>
      <div className={styles.feedbackHeader}>
        <img src={icon("feedback-blue-header")} alt="feedback" />
        <span>Share your Feedback</span>
      </div>
      <div className={styles.feedbackSubheader}>
        The team usually replies within a day.
      </div>
      {isSubmitted === "submitted" ? (
        <SubmitMessage closeModal={closeModal} />
      ) : (
        <div className={styles.stepsContainer}>
          <VoteButtons vote={vote} onVoteChange={handleVoteChange} />
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
