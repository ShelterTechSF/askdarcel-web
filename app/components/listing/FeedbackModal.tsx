import React from 'react';
import Modal from 'react-modal';
import { Organization, Service } from '../../models';
import { FeedbackForm } from './feedback/FeedbackForm';

export function FeedbackModal({
  organization, service, isOpen, setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  organization: Organization;
  service?: Service;
}) {
  return (
    <Modal
      isOpen={isOpen}
      className="feedback__Modal"
      overlayClassName="feedback__Overlay"
    >
      <FeedbackForm
        closeModal={() => setIsOpen(!isOpen)}
        resource={organization}
        service={service}
      />
    </Modal>
  );
}
