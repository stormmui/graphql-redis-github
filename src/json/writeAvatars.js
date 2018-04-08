import { smembers } from "./../redis/readUtils";
import { writeAvatars } from "./../user/writeAvatar";

async function goGql(repository) {
  let result = await smembers(repository);
  console.log(result);
  await writeAvatars(result);
}

async function writeUsers(repositories) {
  repositories.forEach(function(repository) {
    goGql(repository);
  });
}

const repositories = ["boundary/html5-node-diagram"];
writeUsers(repositories);
