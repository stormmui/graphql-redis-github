var redis = require("redis");
const { promisify } = require("util");

export async function sismember(key, member) {
  let client = redis.createClient();
  let sismember = promisify(client.sismember).bind(client);
  let result = await sismember(key, member);
  client.quit();
  return result;
}

export async function readLocation(location) {
  let client = redis.createClient();

  let sadd = promisify(client.smembers).bind(client);
  let readResult = await smembers(location);

  // console.log(`${readResult} has been saved.`);
  client.quit();
  return readResult;
}

export async function readName(login) {
  let client = redis.createClient();

  let hget = promisify(client.hget).bind(client);
  let readResult = await hget(login, "name");

  // console.log(`${writeResult} has been saved.`);
  client.quit();
  return readResult;
}
