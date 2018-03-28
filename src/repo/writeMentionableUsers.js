import gql from "graphql-tag";
import { writeLocation, writeName } from "./../redis/writeUtils";
import {
  getJsonKeyFromFile,
  readJsonDataFromFilename
} from "./../util/fileutil";
import { getClient } from "./../util/apollo-util";
import { getInitialGithubData, getGithubData } from "./../util/github-util";
import { handlePromise } from "./../util/promise-util";

const repositoryMentionableUsers = gql`
  query MentionableUsers($owner: String!, $name: String!, $after: String) {
    repository(owner: $owner, name: $name) {
      name
      nameWithOwner
      mentionableUsers(first: 100, after: $after) {
        totalCount
        edges {
          cursor
          node {
            login
          }
        }
      }
    }
  }
`;

async function iterateOverCursor(client, cursor, repository) {
  const result = repository.split("/");
  const options = { owner: result[0], name: result[1], after: cursor };

  let myjson = await getGithubData(client, options, repositoryMentionableUsers);
  let myredis = await handlePromise(myjson);
  await getCursorFromData(client, myredis, repository);
}

async function getCursorFromData(client, value, repository) {
  let userCount = value.data.repository.mentionableUsers.totalCount;
  let edgeAry = value.data.repository.mentionableUsers.edges;

  processEdgeAry(edgeAry, repository);

  let edgeAryLength = edgeAry.length;
  let cursor = edgeAry[edgeAryLength - 1].cursor;
  console.log("userCount = ", userCount);
  console.log("edgeAry length = ", edgeAryLength);
  console.log("cursor = ", cursor);

  if (edgeAryLength < 100) {
    return 1;
  }

  iterateOverCursor(client, cursor, repository);
}

function processEdgeAry(edgeAry, repository) {
  edgeAry.forEach(function(item) {
    let login = item.node.login;
    // eventually we will rename this method
    // but for now it sadd's a member to a set
    writeLocation(login, repository);
  });
}

async function goGql(repository) {
  let githubApiKey = await getJsonKeyFromFile("./data/f1.js");
  let client = await getClient(githubApiKey);
  let myjson = await getInitialGithubData(
    client,
    repository,
    repositoryMentionableUsers
  );
  let myredis = await handlePromise(myjson);
  console.log(myredis);
  await getCursorFromData(client, myredis, repository);
}

const repositories = ["graphql/graphql-js"];

repositories.forEach(function(repository) {
  goGql(repository);
});
