import { hget, smembers } from "./../redis/readUtils";
import { writeAvatar } from "./../user/writeAvatar";

async function goGql2(login) {
    let location = await hget(login,"location");
    let name = await hget(login,"name");
    let avatar = await hget(login, "avatar");
    return new Promise((resolve, reject) => {
      let myobj = {};
      myobj.location = location;
      myobj.name = name;
      myobj.avatar = avatar;
      //console.log(myobj);
      resolve(myobj);
      var reason = new Error('goGql2 problem');
      reject(reason);
    });
}

async function goGql1(repository) {
  let logins = await smembers(repository);
  return new Promise((resolve, reject) => {
  let myjson = [];
  logins.forEach(function(login) {
    let myobj = goGql2(login);
    myjson.push(myobj);
  });
  resolve(myjson);
  var reason = new Error('goGql1 problem');
  reject(reason);
  });
}

async function writeAvatars(repositories) {
  repositories.forEach(function(repository) {
    let result = goGql1(repository);
    console.log(result);
  });
}

const repositories = ["boundary/html5-node-diagram"];
writeAvatars(repositories);
