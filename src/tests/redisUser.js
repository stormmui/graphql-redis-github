import { expect } from "chai";
import { describe, it } from "mocha";
import { sismember, readLocation, readName } from "../redis/readUtils";
import { sadd, writeName } from "../redis/writeUtils";
import { flushdb } from "../redis/flushdb";

describe("Github Redis User", () => {
  describe("Name and Location", () => {
    beforeEach(function() {
      flushdb();
    });

    it("Write location to redis", async () => {
      sadd("corvallis", "stormasm");
      writeName("stormasm", "michael angerman");
      const result1 = await sismember("corvallis", "stormasm");
      expect(result1).to.deep.equal(1);
      const result2 = await readName("stormasm");
      expect(result2).to.deep.equal("michael angerman");
    });
  });
});
