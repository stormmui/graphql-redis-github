import { hget, smembers } from "./../redis/readUtils";
import { writeAvatar } from "./../user/writeAvatar";

async function goGql2(login) {
    let location = await hget(login,"location");
    let name = await hget(login,"name");
    let avatar = await hget(login, "avatar");




    return new Promise((resolve, reject) => {

      //console.log(login, name, location, avatar);
      let myobj = {};
      myobj.location = location;
      myobj.name = name;
      myobj.avatar = avatar;
      console.log(myobj);
      resolve(myobj);

      var reason = new Error('mom is not happy');
      reject(reason);







    });








}

async function goGql1(repository) {
  let logins = await smembers(repository);
  let myjson = [];
  logins.forEach(function(login) {
    let myobj = goGql2(login);
    myjson.push(myobj);
  });
}

async function writeAvatars(repositories) {
  repositories.forEach(function(repository) {
    goGql1(repository);
  });
}

const repositories = ["boundary/html5-node-diagram"];
writeAvatars(repositories);
