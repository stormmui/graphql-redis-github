import { expect } from "chai";
import { describe, it } from "mocha";
import {
  readJsonDataFromFilename,
  writeJsonDataToFilename
} from "../util/file-util";

describe("Writing Json Data to Disk", () => {
  it("Array 1 to disk", async () => {
    let obj1 = { name: "sam" };
    let obj2 = { name: "rick" };
    let obj3 = { name: "bill" };
    let ary1 = [obj1, obj2, obj3];
    let json1 = JSON.stringify(ary1);
    await writeJsonDataToFilename("./data/json1.js", json1);
    let data = await readJsonDataFromFilename("./data/json1.js");
    let ary = JSON.parse(data);
    expect(ary[0].name).to.deep.equal("sam");
    expect(ary[2].name).to.deep.equal("bill");
  });
});
