import React from "react";

type Props = {
  label: React.ReactNode;
  placeholder: string;
  setValue: (x: string) => void;
  textareaClassName?: string;
  value: string;
};
const FormTextArea = ({
  label,
  placeholder,
  value,
  setValue,
  textareaClassName = "",
}: Props) => (
  <>
    <label htmlFor="textarea">{label}</label>
    <textarea
      className={textareaClassName}
      placeholder={placeholder}
      value={value}
      onChange={(evt) => setValue(evt.target.value)}
    />
  </>
);

export default FormTextArea;
