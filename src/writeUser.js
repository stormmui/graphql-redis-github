import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import fetch from "node-fetch";
import gql from "graphql-tag";
import * as fs from "fs";

var redis = require("redis");
const { promisify } = require("util");

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

const locationQuery = gql`
  query LocationSearch {
    search(query: "location:corvallis", type: USER, first: 100) {
      userCount
      edges {
        cursor
        node {
          ... on User {
            name
            login
            location
            __typename
          }
          ... on Organization {
            name
            login
            location
            __typename
          }
        }
      }
    }
  }
`;

const locationQueryWithCursor = gql`
  query LocationSearchCursor($before: String) {
    search(
      query: "location:corvallis"
      type: USER
      first: 100
      before: $before
    ) {
      userCount
      edges {
        cursor
        node {
          ... on User {
            name
            login
            location
            __typename
          }
          ... on Organization {
            name
            login
            location
            __typename
          }
        }
      }
    }
  }
`;

// const options = { before: "Y3Vyc29yOjb" };

async function getInitialGithubData(client, options) {
  return new Promise((resolve, reject) => {
    client
      .query({
        query: locationQuery,
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

async function getNextCursor(value, cursor) {
  let userCount = value.data.search.userCount;
  let edgeAry = value.data.search.edges;
  let edgeAryLength = edgeAry.length;
  console.log("userCount = ", userCount);
  console.log("edgeAry length = ", edgeAryLength);
  if (edgeAryLength == 1) {
    process.exit();
  }
  processEdgeAry(edgeAry);
}

async function iterateOverCursor(client, cursor) {
  const options = { before: cursor };

  let myjson = await getGithubData(client, options);
  let myredis = await handleRedis(myjson);
  await getCursorFromData(client, myredis);
}

async function getCursorFromData(client, value) {
  let userCount = value.data.search.userCount;
  let edgeAry = value.data.search.edges;

  processEdgeAry(edgeAry);

  let edgeAryLength = edgeAry.length;
  let cursor = edgeAry[edgeAryLength - 1].cursor;
  console.log("userCount = ", userCount);
  console.log("edgeAry length = ", edgeAryLength);
  console.log("cursor = ", cursor);

  if (edgeAryLength == 1) {
    process.exit();
  }

  iterateOverCursor(client, cursor);
}

async function processRedis(value) {
  let userCount = value.data.search.userCount;
  let edgeAry = value.data.search.edges;
  console.log("userCount = ", userCount);
  console.log("edgeAry length = ", edgeAry.length);
  processEdgeAry(edgeAry);
}

function checkForOrganization(item) {
  if (item.node.location === undefined) {
    return false;
  }
  if (item.node.login === undefined) {
    return false;
  }
  if (item.node.name === undefined) {
    return false;
  }
  // console.log(item);
  return true;
}

function processEdgeAry(edgeAry) {
  edgeAry.forEach(function(item) {
    if (checkForOrganization(item) == false) {
      return;
    }
    let location = item.node.location;
    let login = item.node.login;
    let name = item.node.name;
    // console.log(login, name, location);
    processRedisLocation(login, location);
    processRedisName(login, name);
  });
}

async function processRedisLocation(login, location) {
  let client = redis.createClient();

  let sadd = promisify(client.sadd).bind(client);
  let writeResult = await sadd("bend", login);

  // console.log(`${writeResult} has been saved.`);
  client.quit();
}

async function processRedisName(login, name) {
  let client = redis.createClient();

  let hset = promisify(client.hset).bind(client);
  let writeResult = await hset(login, "name", name);

  // console.log(`${writeResult} has been saved.`);
  client.quit();
}

async function goGql() {
  let githubApiKey = await getJsonKeyFromFile("./data/f1.js");
  let client = await getClient(githubApiKey);
  let myjson = await getInitialGithubData(client, {});
  let myredis = await handleRedis(myjson);
  await getCursorFromData(client, myredis);
}

goGql();
