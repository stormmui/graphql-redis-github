var redis = require("redis");
const { promisify } = require("util");

export async function flushdb() {
  let client = redis.createClient();
  let flushdb = promisify(client.flushdb).bind(client);
  let result = await flushdb();
  client.quit();
  return result;
}
