export interface TagType {
  tag: string;
  selected: boolean;
}

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
] as const;

export type VoteType = 'upvote' | 'downvote' | 'neither';
export type StepState = 'start' | 'tags' | 'review';
export type SubmittedState = 'submitting' | 'submitted' | null;
