import { expect } from "chai";
import { describe, it } from "mocha";
import { sismember, hget } from "../redis/readUtils";
import { sadd, hset } from "../redis/writeUtils";
import { flushdb } from "../redis/flushdb";

describe("Github Redis User", () => {
  describe("Name and Location", () => {
    beforeEach(function() {
      flushdb();
    });

    it("Write location to redis", async () => {
      await sadd("corvallis", "stormasm");
      await hset("stormasm", "name", "michael angerman");
      const result1 = await sismember("corvallis", "stormasm");
      expect(result1).to.deep.equal(1);
      const result2 = await hget("stormasm", "name");
      expect(result2).to.deep.equal("michael angerman");
    });
  });
});
