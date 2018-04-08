import { hgetall, smembers } from "./../redis/readUtils";
import { writeAvatars } from "./../user/writeAvatar";

/*
async function goGql2(users) {
  users.forEach(function(user) {
    let result = await hgetall(user);
    console.log(result);
  });
}
*/

async function goGql1(repository) {
  let result = await smembers(repository);
  // console.log(result);
  await writeAvatars(result);
  // await goGql2(result);
}

async function writeUsers(repositories) {
  repositories.forEach(function(repository) {
    goGql1(repository);
  });
}

const repositories = ["boundary/html5-node-diagram"];
writeUsers(repositories);
