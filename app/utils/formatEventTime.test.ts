import formatEventTime from "./formatEventTime";

describe("formatEventTime", () => {
  it("from iso date to human readable localized date", () => {
    const isoTime = "2025-01-29 06:00:00";
    const actual = formatEventTime(isoTime);
    const expected = "6:00 AM";

    expect(actual).toBe(expected);
  });
});
