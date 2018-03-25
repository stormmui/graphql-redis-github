var redis = require("redis");
const { promisify } = require("util");

export async function flushdb() {
  let client = redis.createClient();

  let flushdb = promisify(client.flushdb).bind(client);
  let result = await flushdb();

  // console.log(`${readResult} has been saved.`);
  client.quit();
  return result;
}
