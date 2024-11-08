import React from "react";
import { InstantSearch } from "react-instantsearch-core";
import { render, screen, waitFor } from "@testing-library/react";
import { SearchResultsPage } from "pages/SearchResultsPage/SearchResultsPage";
import { createSearchClient } from "../../../test/helpers/createSearchClient";

describe("SearchResultsPage", () => {
  test("renders the Clear Search button", async () => {
    const searchClient = createSearchClient();

    render(
      <InstantSearch
        searchClient={searchClient}
        indexName="fake_test_search_index"
        initialUiState={{
          fake_test_search_index: {
            query: "fake query",
          },
        }}
      >
        <SearchResultsPage />
      </InstantSearch>
    );

    await waitFor(() => {
      expect(screen.getByTestId("clear-search-button")).toBeInTheDocument();
    });
  });
});
