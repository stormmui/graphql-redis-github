import { hget, smembers } from "./../redis/readUtils";
import { writeAvatar } from "./../user/writeAvatar";

async function goGql2(login) {
  let location = await hget(login, "location");
  let name = await hget(login, "name");
  let avatar = await hget(login, "avatar");
  return new Promise((resolve, reject) => {
    let myobj = {};
    myobj.location = location;
    myobj.name = name;
    myobj.avatar = avatar;
    //console.log(myobj);
    resolve(myobj);
    var reason = new Error("goGql2 problem");
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
    var reason = new Error("goGql1 problem");
    reject(reason);
  });
}

async function writeAvatars(repositories) {
  return new Promise((resolve, reject) => {
    let result = null;
    repositories.forEach(function(repository) {
      result = goGql1(repository);
      console.log(result);
    });
    resolve(result);
    var reason = new Error("goGql1 problem");
    reject(reason);
  });
}

async function go() {
  const repositories = ["boundary/html5-node-diagram"];
  let result = await writeAvatars(repositories);
  console.log(result);
}

go();
