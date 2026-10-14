import { expect } from "chai";

import { distanceInMiles } from "../distance";
import { GeoCoordinates } from "../location";

// Landmarks within San Francisco.
const CIVIC_CENTER: GeoCoordinates = { lat: 37.7749, lng: -122.4194 };
const FERRY_BUILDING: GeoCoordinates = { lat: 37.7955, lng: -122.3937 };

describe("distanceInMiles", () => {
  it("should return 0 for identical coordinates", () => {
    expect(distanceInMiles(CIVIC_CENTER, CIVIC_CENTER)).to.equal(0);
  });

  it("should return the correct distance from civic center to ferry building", () => {
    expect(distanceInMiles(CIVIC_CENTER, FERRY_BUILDING)).to.be.closeTo(1.999, 0.001);
  });
});
