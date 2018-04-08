import { smembers } from "./../redis/readUtils";


async function goGql(repository) {
  let result = await smembers(repository);
  console.log(result);
}

async function writeUsers(repositories) {
  repositories.forEach(function(repository) {
    goGql(repository)
});
}

const repositories = ["boundary/html5-node-diagram"];
writeUsers(repositories);
