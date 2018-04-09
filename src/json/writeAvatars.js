import { hgetall, smembers } from "./../redis/readUtils";
import { writeAvatar } from "./../user/writeAvatar";

async function goGql1(repository) {
  let result = await smembers(repository);
  await writeAvatar(result);
}

async function writeAvatars(repositories) {
  repositories.forEach(function(repository) {
    goGql1(repository);
  });
}

const repositories = [
  "adamsanderson/ivy",
  "augustl/nodejs-sandboxed-fs",
  "boundary/html5-node-diagram"
];

writeAvatars(repositories);
