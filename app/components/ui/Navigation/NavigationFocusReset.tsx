import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/* 
  Resets focus state for a11y by focusing and unfocusing an off-screen element 
  at the top of the page when the page location changes.
  The focus reset occurs on all page location changes except when only the query string changes.
*/
export const NavigationFocusReset: React.FC = () => {
  const location = useLocation();
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const previousPathRef = useRef<string>("");

  useEffect(() => {
    const currentPath = location.pathname + location.search;

    const pathChanged = currentPath !== previousPathRef.current;

    // Focus reset should occur if the path changed and it's not just a query string change
    if (pathChanged && !location.search && hiddenInputRef.current) {
      hiddenInputRef.current.focus();
      hiddenInputRef.current.blur();
    }

    previousPathRef.current = currentPath;
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
