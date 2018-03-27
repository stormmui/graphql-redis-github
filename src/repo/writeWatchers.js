import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import fetch from "node-fetch";
import gql from "graphql-tag";
import * as fs from "fs";

import { writeLocation, writeName } from "./../redis/writeUtils";
import {
  getJsonKeyFromFile,
  readJsonDataFromFilename
} from "./../util/fileutil";

async function getClient(githubApiKey) {
  const client = new ApolloClient({
    link: new HttpLink({
      uri: "https://api.github.com/graphql",
      headers: {
        Authorization: `Bearer ${githubApiKey}`
      },
      fetch
    }),
    cache: new InMemoryCache()
  });
  return client;
}

const repositoryWatchers = gql`
  query Watchers($owner: String!, $name: String!, $after: String) {
    repository(owner: $owner, name: $name) {
      name
      nameWithOwner
      watchers(first: 100, after: $after) {
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

async function getInitialGithubData(client, repository) {
  const result = repository.split("/");
  const options = { owner: result[0], name: result[1] };

  return new Promise((resolve, reject) => {
    client
      .query({
        query: repositoryWatchers,
        variables: options
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

async function getGithubData(client, options) {
  return new Promise((resolve, reject) => {
    client
      .query({
        query: repositoryWatchers,
        variables: options
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

async function handleRedis(githubData) {
  return Promise.resolve(githubData)
    .then(function(mike) {
      return mike;
    })
    .catch(error => {
      console.log(error);
    });
}

async function iterateOverCursor(client, cursor, repository) {
  const result = repository.split("/");
  const options = { owner: result[0], name: result[1], after: cursor };

  let myjson = await getGithubData(client, options);
  let myredis = await handleRedis(myjson);
  await getCursorFromData(client, myredis, repository);
}

async function getCursorFromData(client, value, repository) {
  let userCount = value.data.repository.watchers.totalCount;
  let edgeAry = value.data.repository.watchers.edges;

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
  let myjson = await getInitialGithubData(client, repository);
  let myredis = await handleRedis(myjson);
  console.log(myredis);
  await getCursorFromData(client, myredis, repository);
}

const repositories = ["graphql/graphql-js"];

repositories.forEach(function(repository) {
  goGql(repository);
});
