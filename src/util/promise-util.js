export async function handlePromise(githubData) {
  return Promise.resolve(githubData)
    .then(function(result) {
      return result;
    })
    .catch(error => {
      console.log(error);
    });
}
