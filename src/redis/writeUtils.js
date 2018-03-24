var redis = require("redis");
const { promisify } = require("util");

export async function writeLocation(login, location) {
  let client = redis.createClient();

  let sadd = promisify(client.sadd).bind(client);
  let writeResult = await sadd("bend", login);

  // console.log(`${writeResult} has been saved.`);
  client.quit();
}

export async function writeName(login, name) {
  let client = redis.createClient();

  let hset = promisify(client.hset).bind(client);
  let writeResult = await hset(login, "name", name);

  // console.log(`${writeResult} has been saved.`);
  client.quit();
}
