import { computeGridOffset } from "./map";

describe("computeGridOffset", () => {
  const epicenter = { lat: 0, lng: 0 };
  const total = 9;

  it("should return { offsetLat: -0.00004, offsetLng: -0.00004 } for index 0, making the first item visually render in the bottom left", () => {
    const { offsetLat, offsetLng } = computeGridOffset(0, total, epicenter);
    expect(offsetLat).toBeCloseTo(-0.00004);
    expect(offsetLng).toBeCloseTo(-0.00004);
  });

  it("should return { offsetLat: -0.00004, offsetLng: 0.00004 } for index 2, making the third item visually render in the bottom right corner", () => {
    const { offsetLat, offsetLng } = computeGridOffset(2, total, epicenter);
    expect(offsetLat).toBeCloseTo(-0.00004);
    expect(offsetLng).toBeCloseTo(0.00004);
  });
  it("should return { offsetLat: 0, 0 } for index 4, making the fifth item visually render in the middle and be equal to the epicenter's coordinates", () => {
    const { offsetLat, offsetLng } = computeGridOffset(2, total, epicenter);
    expect(offsetLat).toBeCloseTo(0);
    expect(offsetLng).toBeCloseTo(0);
    expect(offsetLat).toBeCloseTo(epicenter.lat);
    expect(offsetLng).toBeCloseTo(epicenter.lng);
  });

  it("should return { offsetLat: 0.00004, offsetLng: -0.00004 } for index 6, making the seventh item visually render in the top left corner", () => {
    const { offsetLat, offsetLng } = computeGridOffset(2, total, epicenter);
    expect(offsetLat).toBeCloseTo(0.00004);
    expect(offsetLng).toBeCloseTo(-0.00004);
  });

  it("should return { offsetLat: 0.00004, offsetLng: 0.00004 } for index 8, making the last item visually render in the top right corner", () => {
    const { offsetLat, offsetLng } = computeGridOffset(2, total, epicenter);
    expect(offsetLat).toBeCloseTo(0.00004);
    expect(offsetLng).toBeCloseTo(-0.00004);
  });
});
