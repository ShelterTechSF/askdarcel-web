import React from 'react';

const InputField = (
  {
    label,
    labelClassName,
    inputClassName,
    subLabel,
    subLabelClassName,
    ...props
  },
) => (
  <label className={labelClassName}>
    {label}
    {subLabel ? (
      <div className={subLabelClassName}>
        {subLabel}
      </div>
    )
      : null}
    <input className={inputClassName} {...props} />
  </label>
);

export default InputField;
