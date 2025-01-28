import formatEventDate from "./formatEventDate";

describe("formatEventDate", () => {
  it("from iso date to human readable localized date", () => {
    const isoDate = "2024-1-30";
    const actual = formatEventDate(isoDate);
    const expected = "January 30, 2024";

    expect(actual).toBe(expected);
  });
});
