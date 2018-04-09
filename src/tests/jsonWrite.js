import { expect } from "chai";
import { describe, it } from "mocha";
import { writeJsonDataToFilename } from "../util/file-util";

describe("Writing Json Data to Disk", () => {
/*
  describe("Write Json Array to Disk", () => {
    beforeEach(function() {
      flushdb();
    });
*/
    it("Array 1 to disk", async () => {
      let obj1 = {"name":"sam"};
      let obj2 = {"name":"rick"};
      let obj3 = {"name":"bill"};
      let ary1 = [obj1,obj2,obj3];
      let json1 = JSON.stringify(ary1);
      writeJsonDataToFilename("./data/json1.js",json1);
/*
      const result1 = await sismember("corvallis", "stormasm");
      expect(result1).to.deep.equal(1);
      const result2 = await hget("stormasm", "name");
      expect(result2).to.deep.equal("michael angerman");
*/
//    });
  });
});
