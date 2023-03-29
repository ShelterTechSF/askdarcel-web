import React, { useState } from "react";
import Heading from "./Heading";
import Privacy from "./Privacy";
import Buttons from "./Buttons";
import styles from "./Form.module.scss";
import type { APITexting, TextingService } from "../../Texting";

const initialState = {
  recipientName: "",
  phoneNumber: "",
  agreed: false,
} as const;

export const FormView = ({
  service,
  handleSubmit,
  closeModal,
}: {
  service: TextingService;
  handleSubmit: (data: APITexting) => void;
  closeModal: () => void;
}) => {
  const [state, setState] = useState(initialState);
  const { recipientName, phoneNumber, agreed } = state;
  const { serviceName, serviceId } = service;
  const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { type, name, value, checked } = evt.target;
    const newValue = type === "checkbox" ? checked : value;
    setState((prevState) => ({ ...prevState, [name]: newValue }));
  };

  const onSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    const data = {
      recipient_name: recipientName,
      phone_number: phoneNumber,
      service_id: serviceId,
    };
    handleSubmit(data);
  };

  return (
    <div>
      <Heading serviceName={serviceName} />
      <div className={styles.inputField}>
        <label className={styles.label}>
          First name (optional)
          <input
            type="text"
            name="recipientName"
            className={styles.input}
            value={recipientName}
            onChange={onChange}
          />
        </label>
        <label className={styles.label}>
          Phone number (required)
          <div className={styles.dataRates}>
            *Standard text and data rates may apply.
          </div>
          <input
            type="text"
            name="phoneNumber"
            className={styles.input}
            value={phoneNumber}
            onChange={onChange}
          />
        </label>
        <label className={styles.checkBox}>
          <input
            type="checkbox"
            name="agreed"
            checked={agreed}
            className={styles.checkBox}
            onChange={onChange}
          />
          I agree to receive text messages from SF Service Guide.
        </label>
      </div>
      <Buttons disabled={!agreed} closeModal={closeModal} onSubmit={onSubmit} />
      <Privacy />
    </div>
  );
};
