var redis = require("redis");
const { promisify } = require("util");

export async function sismember(key, member) {
  let client = redis.createClient();
  let sismember = promisify(client.sismember).bind(client);
  let result = await sismember(key, member);
  client.quit();
  return result;
}

export async function smembers(key) {
  let client = redis.createClient();
  let smembers = promisify(client.smembers).bind(client);
  let result = await smembers(key);
  client.quit();
  return result;
}

export async function hget(key, field) {
  let client = redis.createClient();
  let hget = promisify(client.hget).bind(client);
  let result = await hget(key, field);
  client.quit();
  return result;
}
