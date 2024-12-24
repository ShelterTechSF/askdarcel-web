import { EventResponse, formatHomePageEventsData } from "hooks/StrapiAPI";

describe("formatHomePageEventsData", () => {
  it("correctly extracts top-level and nested attributes and flattens the data", () => {
    const expected = [
      {
        title: "In-Person Youth Crew Q&A Session",
        id: 1,
        calendar_event: {
          id: 1837535972032512,
          startdate: "inventore-eum-eligendi",
          enddate: null,
          starttime: null,
          endtime: null,
        },
      },
    ];
    const actual = formatHomePageEventsData({
      data: [
        {
          id: 1,
          attributes: {
            title: "In-Person Youth Crew Q&A Session",
            calendar_event: {
              id: 1837535972032512,
              startdate: "inventore-eum-eligendi",
              enddate: null,
              starttime: null,
              endtime: null,
            },
          } as EventResponse,
        },
      ],
    });
    expect(actual).toEqual(expected);
  });
});
