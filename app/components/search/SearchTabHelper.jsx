import React from 'react';

const SearchTabHelper = ({ children, active, onChange }) => (
  <div>
    {React.Children.map(children, child => {
      const altClassName = (child.key === active) ? 'service-entry-tabs-active' : 'service-entry-tabs';
      return (
        <div
          className={altClassName}
          onClick={() => {
            onChange(child.key);
          }}
          role="button"
          tabIndex="0"
        >
          {child}
        </div>
      );
    })}
  </div>
);

export default SearchTabHelper;
