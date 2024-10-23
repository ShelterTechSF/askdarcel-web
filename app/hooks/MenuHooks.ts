import { useState, useRef, useEffect } from "react";

export function useMenuToggle() {
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleMenuToggle = (uniqueKey: string | null) => {
    setActiveSubMenu((prev) => (prev === uniqueKey ? null : uniqueKey));
  };

  //   If submenu is open and user clicks away from it, close the submenu
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setActiveSubMenu(null);
    }
  };

  //   If submenu is open and user tab navigates away from it, close the submenu
  const handleFocusOut = (event: FocusEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.relatedTarget as Node)
    ) {
      setActiveSubMenu(null);
    }
  };

  useEffect(() => {
    const currentRef = menuRef.current;

    document.addEventListener("mousedown", handleClickOutside);
    currentRef?.addEventListener("focusout", handleFocusOut);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      currentRef?.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  return {
    activeSubMenu,
    handleMenuToggle,
    menuRef,
  };
}

// For use in modals, dropdowns, etc.
function useClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T>,
  callback: (event: MouseEvent) => void, // i.e. setIsActive(false)
  isActive = true
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
        callback(event);
      }
    };

    if (isActive) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      if (isActive) {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, [ref, callback, isActive]);
}

export default useClickOutside;
