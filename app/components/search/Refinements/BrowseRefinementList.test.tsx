import React from "react";
import { InstantSearch } from "react-instantsearch-core";
import { render, screen, waitFor } from "@testing-library/react";
import BrowseRefinementList from "components/search/Refinements/BrowseRefinementList";
import { createSearchClient } from "../../../../test/helpers/createSearchClient";

describe("BrowseRefinementList", () => {
  test("renders the default limit of 10 refinements", async () => {
    const searchClient = createSearchClient({
      facets: {
        categories: {
          A: 54,
          B: 35,
          C: 28,
          D: 24,
          E: 18,
          F: 14,
          G: 14,
          H: 12,
          I: 45,
          J: 79,
          K: 1,
          L: 31,
        },
      },
    });

    const expected = 10;

    render(
      <InstantSearch
        searchClient={searchClient}
        indexName="fake_test_search_index"
      >
        <BrowseRefinementList attribute="categories" />
      </InstantSearch>
    );

    await waitFor(() => {
      expect(screen.getAllByTestId("browserefinementlist-item")).toHaveLength(
        expected
      );
    });
  });
});
