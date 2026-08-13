import { expect } from "chai";

import { getResourceCount } from "./DataService";

describe("DataService", () => {
  const originalFetch = (global as any).fetch;

  afterEach(() => {
    (global as any).fetch = originalFetch;
  });

  describe("getResourceCount", () => {
    it("requests the Go resource count endpoint", async () => {
      let requestedUrl: RequestInfo | URL | undefined;

      (global as any).fetch = (url: RequestInfo | URL): Promise<any> => {
        requestedUrl = url;
        return Promise.resolve({
          ok: true,
          headers: {
            get: () => null,
          },
          json: () => Promise.resolve(42),
        });
      };

      const count = await getResourceCount();

      expect(requestedUrl).to.equal("/api/v2/resources/count");
      expect(count).to.equal(42);
    });
  });
});
