import { smembers } from "./../redis/readUtils";
import { writeAvatar } from "./../user/writeAvatar";
import repositories from "./../../data/in/v100.json";

async function writeAvatars(repositories) {
  for (const repository of repositories) {
    let result = await smembers(repository);
    await writeAvatar(result);
  }
}

writeAvatars(repositories);
