import { mapSFSGApiEligibilitiesToOur415ByConfig } from "./refinementMappings";
import { RefinementListItem } from "instantsearch.js/es/connectors/refinement-list/connectRefinementList";

const mockMapping = {
  "Pacific Islander": ["API (Asian/Pacific Islander)", "Pacific Islander"],
  Toddler: ["Toddler Age", "Toddler"],
  "Transgender and Gender Non-Conforming": [
    "Transgender and Gender Non-Conforming",
  ],
  Uninsured: ["Uninsured"],
  "Multiple Values": ["First", "Second", "Third"],
};

describe("mapSFSGApiEligibilitiesToOur415ByConfig", () => {
  it("should filter out items not in the mapping, normalize labels to map key name, and remove duplicates", () => {
    const items: RefinementListItem[] = [
      {
        label: "API (Asian/Pacific Islander)",
        value: "1",
        count: 10,
        isRefined: false,
      },
      {
        label: "Pacific Islander",
        value: "2",
        count: 5,
        isRefined: false,
      },
      {
        label: "Toddler Age",
        value: "3",
        count: 7,
        isRefined: false,
      },
      {
        label: "Uninsured",
        value: "4",
        count: 3,
        isRefined: false,
      },
      {
        label: "First",
        value: "5",
        count: 4,
        isRefined: false,
      },
      {
        label: "Second",
        value: "6",
        count: 4,
        isRefined: false,
      },
      {
        label: "Third",
        value: "7",
        count: 4,
        isRefined: false,
      },
      {
        label: "Transgender and Gender Non-Conforming",
        value: "8",
        count: 2,
        isRefined: false,
      },
      {
        label: "A value that doesn't exist anywhere in the mapping",
        value: "9",
        count: 8,
        isRefined: false,
      },
      {
        label: "API (Asian/Pacific Islander)",
        value: "10",
        count: 2,
        isRefined: false,
      },
    ];

    const result = mapSFSGApiEligibilitiesToOur415ByConfig(
      items,
      mockMapping
    ).sort((a, b) => a.label.localeCompare(b.label));
    const expected = [
      { count: 4, isRefined: false, label: "Multiple Values", value: "5" },
      { count: 10, isRefined: false, label: "Pacific Islander", value: "1" },
      { count: 7, isRefined: false, label: "Toddler", value: "3" },
      {
        count: 2,
        isRefined: false,
        label: "Transgender and Gender Non-Conforming",
        value: "8",
      },
      { count: 3, isRefined: false, label: "Uninsured", value: "4" },
    ];
    expect(result).toStrictEqual(expected);
  });
});
