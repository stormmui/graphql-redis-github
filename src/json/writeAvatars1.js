import { hget, smembers } from "./../redis/readUtils";
import { writeAvatar } from "./../user/writeAvatar";

async function goGql2(login) {
    let result = await hget(login,"location");
    console.log(login, result);
}

async function goGql1(repository) {
  let logins = await smembers(repository);
  logins.forEach(function(login) {
    goGql2(login);
  });
}

async function writeAvatars(repositories) {
  repositories.forEach(function(repository) {
    goGql1(repository);
  });
}

const repositories = ["boundary/html5-node-diagram"];
writeAvatars(repositories);
