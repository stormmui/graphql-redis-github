import gql from "graphql-tag";
import { hset } from "./../redis/writeUtils";
import {
  getJsonKeyFromFile,
  readJsonDataFromFilename
} from "./../util/file-util";
import { getClient } from "./../util/apollo-util";
import { getGithubData } from "./../util/github-util";
import { handlePromise } from "./../util/promise-util";

const query = gql`
  query User($login: String!) {
    user(login: $login) {
      avatarUrl(size: 400)
      location
      name
    }
  }
`;

/*
async function iterateOverCursor(client, cursor, options_in) {
  const options = {
    repository: options_in.repository,
    login: options_in.login,
    name: options_in.name,
    after: cursor
  };

  let json = await getGithubData(client, options, query);
  let data = await handlePromise(json);
  await getCursorFromData(client, options, data);
}
*/

async function getUserFromData(client, options, value) {
  let login = options.login;
  let avatar = value.data.user.avatarUrl;
  let location = value.data.user.location;
  let name = value.data.user.name;

  //console.log("avatar ", avatar);
  //console.log("location ", location);
  //console.log("name ", name);
  console.log(login);

  hset(login, "avatar", avatar);
  hset(login, "location", location);
  hset(login, "name", name);
  /*
  processEdgeAry(edgeAry, options.repository);

  let edgeAryLength = edgeAry.length;
  let cursor = edgeAry[edgeAryLength - 1].cursor;
  console.log("userCount = ", userCount);
  console.log("edgeAry length = ", edgeAryLength);
  console.log("cursor = ", cursor);

  if (edgeAryLength < 100) {
    return 1;
  }

  iterateOverCursor(client, cursor, options);
*/
}

/*
async function getCursorFromData(client, options, value) {
  let userCount = value.data.repository.stargazers.totalCount;
  let edgeAry = value.data.repository.stargazers.edges;

  processEdgeAry(edgeAry, options.repository);

  let edgeAryLength = edgeAry.length;
  let cursor = edgeAry[edgeAryLength - 1].cursor;
  console.log("userCount = ", userCount);
  console.log("edgeAry length = ", edgeAryLength);
  console.log("cursor = ", cursor);

  if (edgeAryLength < 100) {
    return 1;
  }

  iterateOverCursor(client, cursor, options);
}

function processEdgeAry(edgeAry, repository) {
  edgeAry.forEach(function(item) {
    let login = item.node.login;
    // eventually we will rename this method
    // but for now it sadd's a member to a set
    sadd(repository, login);
  });
}
*/

async function goGql(options) {
  let githubApiKey = await getJsonKeyFromFile("./data/f1.js");
  let client = await getClient(githubApiKey);
  let json = await getGithubData(client, options, query);
  let data = await handlePromise(json);
  await getUserFromData(client, options, data);
  //await getCursorFromData(client, options, data);
}

async function writeAvatars(logins) {
  logins.forEach(function(user) {
    const options = { login: user };
    goGql(options);
  });
}

const logins = ["oliviertassinari", "stormasm", "antirez"];
writeAvatars(logins);
