var redis = require("redis");
const { promisify } = require("util");

export async function sadd(key, member) {
  let client = redis.createClient();
  let sadd = promisify(client.sadd).bind(client);
  let writeResult = await sadd(key, member);
  client.quit();
}

export async function hset(key, field, value) {
  let client = redis.createClient();
  let hset = promisify(client.hset).bind(client);
  let writeResult = await hset(key, field, value);
  client.quit();
}
