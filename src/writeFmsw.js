import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import fetch from "node-fetch";
import gql from "graphql-tag";
import * as fs from "fs";

import { writeLocation, writeName } from "./redis/writeUtils";

async function getJsonKeyFromFile(filename) {
  var r1 = await readJsonDataFromFilename(filename, "utf8");
  var r2 = r1.trim();
  var r3 = JSON.parse(r2);
  var r4 = r3.key;
  return r4;
}

async function readJsonDataFromFilename(fileName, type) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, type, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

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

const repositoryMentionableUsers = gql`
  query MentionableUsers($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
       name
       nameWithOwner
       mentionableUsers(first: 100) {
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

const repositoryMentionableUsersWithCursor = gql`
  query MentionableUsers($owner: String!, $name: String!, $before: String) {
    repository(owner: $owner, name: $name) {
       name
       nameWithOwner
       mentionableUsers(first: 100, before: $before) {
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

async function getInitialGithubData(client, nameWithOwner) {

  const test1 = "graphql/graphql-js"
  const result = nameWithOwner.split("/");
  // console.log(result);

  const options = { owner: result[0], name: result[1] };
  return new Promise((resolve, reject) => {
    client
      .query({
        query: repositoryMentionableUsers,
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
        query: locationQueryWithCursor,
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

async function iterateOverCursor(client, cursor, city) {
  const options = { location: `location:${city}`, before: cursor };

  let myjson = await getGithubData(client, options);
  let myredis = await handleRedis(myjson);
  await getCursorFromData(client, myredis, city);
}

async function getCursorFromData(client, value, repository) {
  let userCount = value.data.repository.mentionableUsers.totalCount;
  let edgeAry = value.data.repository.mentionableUsers.edges;


  // processEdgeAry(edgeAry, city);

  let edgeAryLength = edgeAry.length;
  let cursor = edgeAry[edgeAryLength - 1].cursor;
  console.log("userCount = ", userCount);
  console.log("edgeAry length = ", edgeAryLength);
  console.log("cursor = ", cursor);
/*
  if (edgeAryLength == 1) {
    return 1;
  }

  iterateOverCursor(client, cursor, city);
*/
}

function processEdgeAry(edgeAry, location) {
  edgeAry.forEach(function(item) {
    //
    //  Leave this here for later when you want to do some filtering
    //  based on regex matching to filter out for example
    //  South Bend, Indiana from Bend, Oregon
    //  For now South Bend, Indiana is getting in there
    //  When I just put in Bend
    //
    //  let location = item.node.location;
    //
    let login = item.node.login;
    let name = item.node.name;
    writeLocation(login, location);
    writeName(login, name);
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
