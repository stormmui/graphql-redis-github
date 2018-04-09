import { smembers } from "./../redis/readUtils";
import { writeAvatar } from "./../user/writeAvatar";

async function writeAvatars(repositories) {
  for (const repository of repositories) {
    let result = await smembers(repository);
    await writeAvatar(result);
  }
}

const repositories = [
  "adamsanderson/ivy",
  "augustl/nodejs-sandboxed-fs",
  "boundary/html5-node-diagram"
];

writeAvatars(repositories);
