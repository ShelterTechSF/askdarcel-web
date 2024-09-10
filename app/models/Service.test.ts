import {
  fetchServiceFailureHandler,
  fetchServiceSuccessHandler,
  Service,
} from "models/Service";

// TODO: Intentionally using partial data here during MVP phase of testing. Let's replace with complete fixtures once
// we are live.
describe("#fetchServiceSuccessHandler", () => {
  it("will return a Service that inherits the schedule from its organization", () => {
    const serviceFixture = {
      schedule: {
        id: 912,
        schedule_days: [
          {
            id: 5147,
            day: "Friday",
            opens_at: 900,
            closes_at: 1700,
            open_time: null,
            open_day: null,
            close_time: null,
            close_day: null,
          },
        ],
      },
    };

    const actual = fetchServiceSuccessHandler({
      service: serviceFixture,
    }) as Service;

    expect(actual.recurringSchedule).toBeDefined();
  });
  it("will return a Service with its schedule", () => {
    const serviceFixture = {
      resource: {
        schedule: {
          id: 912,
          schedule_days: [
            {
              id: 5147,
              day: "Friday",
              opens_at: 900,
              closes_at: 1700,
              open_time: null,
              open_day: null,
              close_time: null,
              close_day: null,
            },
          ],
        },
      },
    };
    const actual = fetchServiceSuccessHandler({
      service: serviceFixture,
    }) as Service;

    expect(actual.recurringSchedule).toBeDefined();
  });

  it("will return a an unknown error message if the Service data is malformed", () => {
    const serviceFixture = {
      id: 992,
    };
    const actual = fetchServiceSuccessHandler({
      service: serviceFixture,
    }) as Service;

    expect(actual).toStrictEqual({
      error: null,
      message:
        "We were unable to process the request. Please contact your site administrator.",
    });
  });
});

describe("#fetchServiceFailureHandler", () => {
  it("will return a an unkown error message if there is unprocessable error from the api", () => {
    const errorFixture = new SyntaxError(
      "JSON.parse: unexpected end of data at line 1 column 1 of the JSON data"
    );
    const actual = fetchServiceFailureHandler(errorFixture);

    expect(actual).toStrictEqual({
      error: new SyntaxError(
        "JSON.parse: unexpected end of data at line 1 column 1 of the JSON data"
      ),
      message: "There was a problem with the api response.",
    });
  });
});
