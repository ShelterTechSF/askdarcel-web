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
