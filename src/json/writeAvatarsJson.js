import { hget, smembers } from "./../redis/readUtils";
import { writeAvatar } from "./../user/writeAvatar";
import { writeJsonDataToFilename } from "../util/file-util";
import repositories from "./../../data/in/v100.json";

async function goGql2(login) {
  let location = await hget(login, "location");
  let name = await hget(login, "name");
  let avatar = await hget(login, "avatar");
  return new Promise((resolve, reject) => {
    let myobj = {};
    myobj.login = login;
    myobj.location = location;
    myobj.name = name;
    myobj.avatar = avatar;
    resolve(myobj);
    var reason = new Error("writeAvatarsJson goGql2 problem");
    reject(reason);
  });
}

async function goGql1(repository) {
  let logins = await smembers(repository);
  let myjson = [];
  for (const login of logins) {
    let myobj = await goGql2(login);
    myjson.push(myobj);
  }

  return new Promise((resolve, reject) => {
    resolve(myjson);
    var reason = new Error("writeAvatarsJson goGql1 problem");
    reject(reason);
  });
}

async function writeAvatars(repositories) {
  for (const repository of repositories) {
    const result = repository.split("/");
    const options = {
      repository: repository,
      owner: result[0],
      name: result[1]
    };

    let data = await goGql1(repository);
    let json = JSON.stringify(data);
    let filename = "./data/out/" + options.name + ".json";
    await writeJsonDataToFilename(filename, json);
  }
}

async function go() {
  await writeAvatars(repositories);
}

go();
