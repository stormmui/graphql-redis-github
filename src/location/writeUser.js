import gql from "graphql-tag";
import { writeLocation, writeName } from "./../redis/writeUtils";
import {
  getJsonKeyFromFile,
  readJsonDataFromFilename
} from "./../util/file-util";
import { getClient } from "./../util/apollo-util";
import { getGithubData } from "./../util/github-util";
import { handlePromise } from "./../util/promise-util";

const query = gql`
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

async function iterateOverCursor(client, cursor, options_in) {
  const options = {
    location: options_in.location,
    city: options_in.city,
    before: cursor
  };

  let json = await getGithubData(client, options, query);
  let data = await handlePromise(json);
  await getCursorFromData(client, options, data);
}

async function getCursorFromData(client, options, value) {
  let userCount = value.data.search.userCount;
  let edgeAry = value.data.search.edges;

  processEdgeAry(edgeAry, options.city);

  let edgeAryLength = edgeAry.length;
  let cursor = edgeAry[edgeAryLength - 1].cursor;
  console.log("userCount = ", userCount);
  console.log("edgeAry length = ", edgeAryLength);
  console.log("cursor = ", cursor);

  if (edgeAryLength == 1) {
    return 1;
  }

  iterateOverCursor(client, cursor, options);
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

async function goGql(options) {
  let githubApiKey = await getJsonKeyFromFile("./data/f1.js");
  let client = await getClient(githubApiKey);
  let json = await getGithubData(client, options, query);
  let data = await handlePromise(json);
  await getCursorFromData(client, options, data);
}

const cities = ["corvallis", "bend", "eugene"];
// const cities = ["corvallis"];

cities.forEach(function(city) {
  const options = { location: `location:${city}`, city: city };
  goGql(options);
});
