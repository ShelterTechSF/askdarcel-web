import React from "react";
import classNames from "classnames";
import styles from "./Form.module.scss";

const Buttons = ({
  closeModal,
  onSubmit,
  disabled,
}: {
  onSubmit: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  closeModal: () => void;
  disabled: boolean;
}) => (
  <div className={styles.buttons}>
    <button
      type="button"
      className={classNames(styles.cancel, styles.button)}
      onClick={closeModal}
    >
      Cancel
    </button>
    <button
      type="submit"
      className={classNames(styles.button, { [styles.disabled]: disabled })}
      disabled={disabled}
      onClick={onSubmit}
    >
      Text me
    </button>
  </div>
);

export default Buttons;
