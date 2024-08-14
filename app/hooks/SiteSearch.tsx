import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

interface SiteSearchContextType {
  query: string;
  setQuery: (query: string) => void;
}
export const SiteSearchContext = createContext<
  SiteSearchContextType | undefined
>(undefined);

export const SiteSearchProvider = ({ children }: { children: ReactNode }) => {
  const [query, setQuery] = useState<string>("");
  const value = useMemo(() => ({ query, setQuery }), [query, setQuery]);

  return (
    <SiteSearchContext.Provider value={value}>
      {children}
    </SiteSearchContext.Provider>
  );
};

export const useSiteSearch = () => {
  const context = useContext(SiteSearchContext);
  if (!context) {
    throw new Error("useSiteSearch must be used within a SiteSearchProvider");
  }
  const { query, setQuery } = context;

  return { query, setQuery };
};
