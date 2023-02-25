import React from "react";

type Props = {
  label: string;
  placeholder: string;
  value: string;
  setValue: (x: string) => void;
};
const FormTextArea = ({ label, placeholder, value, setValue }: Props) => (
  <>
    <label htmlFor="textarea">{label}</label>
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={(evt) => setValue(evt.target.value)}
    />
  </>
);

export default FormTextArea;
