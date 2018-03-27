import gql from "graphql-tag";
import { writeLocation, writeName } from "./../redis/writeUtils";
import {
  getJsonKeyFromFile,
  readJsonDataFromFilename
} from "./../util/file-util";
import { getClient } from "./../util/apollo-util"

const locationQuery = gql`
  query LocationSearch($location: String!, $before: String) {
    search(query: $location, type: USER, first: 100, before: $before) {
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

async function getInitialGithubData(client, city) {
  const options = { location: `location:${city}` };
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

async function getCursorFromData(client, value, city) {
  let userCount = value.data.search.userCount;
  let edgeAry = value.data.search.edges;

  processEdgeAry(edgeAry, city);

  let edgeAryLength = edgeAry.length;
  let cursor = edgeAry[edgeAryLength - 1].cursor;
  console.log("userCount = ", userCount);
  console.log("edgeAry length = ", edgeAryLength);
  console.log("cursor = ", cursor);

  if (edgeAryLength == 1) {
    return 1;
  }

  iterateOverCursor(client, cursor, city);
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

async function goGql(city) {
  let githubApiKey = await getJsonKeyFromFile("./data/f1.js");
  let client = await getClient(githubApiKey);
  let myjson = await getInitialGithubData(client, city);
  let myredis = await handleRedis(myjson);
  await getCursorFromData(client, myredis, city);
}

const cities = ["corvallis", "bend", "eugene"];
// const cities = ["corvallis"];

cities.forEach(function(city) {
  goGql(city);
});
