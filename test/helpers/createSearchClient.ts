interface Options {
  [key: string]: any;
}

/**
 * Generates search client fixture for testing components that rely on hooks
 * from the Algolia instantsearch library.
 *
 * Example usage:
 * ```
 * const searchClient = createSearchClient({
 *   facets: {
 *     categories: {
 *       "Arts, Culture & Identity": 54,
 *       Education: 28,
 *     },
 *   },
 * });
 *
 * render(
 *   <InstantSearch
 *     searchClient={searchClient}
 *     indexName="fake_test_search_index"
 *   >
 *     <BrowseRefinementList attribute="categories" />
 *   </InstantSearch>
 * );
 * ```
 *
 * @param options Additional customizations of the search response
 * @returns
 */
export function createSearchClient(options: Options) {
  return {
    search: (requests: any) =>
      Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          page: 0,
          nbHits: 0,
          nbPages: 0,
          hitsPerPage: 0,
          processingTimeMS: 1,
          params: "",
          query: "",
          ...options,
        })),
      }),
  };
}
