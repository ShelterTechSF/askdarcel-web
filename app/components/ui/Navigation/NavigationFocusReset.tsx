import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Resets focus state for a11y, by focusing and unfocusing an off-screen element at the top of the page when page location changes

export const NavigationFocusReset = () => {
  const location = useLocation();
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
      hiddenInputRef.current.blur();
    }
  }, [location]);

  return (
    <input
      ref={hiddenInputRef}
      style={{ position: "absolute", left: "-9999px" }}
      aria-hidden="true"
      tabIndex={-1}
    />
  );
};

export default NavigationFocusReset;
