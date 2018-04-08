import { hget, smembers } from "./../redis/readUtils";
import { writeAvatar } from "./../user/writeAvatar";

async function goGql2(login,myjson) {
    let location = await hget(login,"location");
    let name = await hget(login,"name");
    let avatar = await hget(login, "avatar");
    console.log(login, name, location, avatar);
    let myobj = {};
    myobj.location = location;
    myobj.name = name;
    myobj.avatar = avatar;
    myjson.push(myobj);
    return myjson;
}

async function goGql1(repository) {
  let logins = await smembers(repository);
  let myjson = [];
  logins.forEach(function(login) {
    let myjson = goGql2(login,myjson);
  });
}

async function writeAvatars(repositories) {
  repositories.forEach(function(repository) {
    goGql1(repository);
  });
}

const repositories = ["boundary/html5-node-diagram"];
writeAvatars(repositories);
