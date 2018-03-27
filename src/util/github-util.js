export async function getInitialGithubData(client, repository, query) {
  const result = repository.split("/");
  const options = { owner: result[0], name: result[1] };

  return new Promise((resolve, reject) => {
    client
      .query({
        query: query,
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

export async function getGithubData(client, options, query) {
  return new Promise((resolve, reject) => {
    client
      .query({
        query: query,
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
