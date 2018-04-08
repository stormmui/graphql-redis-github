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

async function getUserFromData(client, options, value) {
  let login = options.login;
  let avatar = value.data.user.avatarUrl;
  let location = value.data.user.location;
  let name = value.data.user.name;

  //console.log("avatar ", avatar);
  //console.log("location ", location);
  //console.log("name ", name);
  //console.log(login);

  if (avatar != null) {
    hset(login, "avatar", avatar);
  }
  if (location != null) {
    hset(login, "location", location);
  }
  if (name != null) {
    hset(login, "name", name);
  }
}

async function goGql(options) {
  let githubApiKey = await getJsonKeyFromFile("./data/f1.js");
  let client = await getClient(githubApiKey);
  let json = await getGithubData(client, options, query);
  let data = await handlePromise(json);
  await getUserFromData(client, options, data);
}

export async function writeAvatars(logins) {
  logins.forEach(function(user) {
    const options = { login: user };
    goGql(options);
  });
}

// For testing only
// const logins = ["oliviertassinari", "stormasm", "antirez"];
// writeAvatars(logins);
