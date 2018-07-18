
/*

Given this data structure returned from Github

tonicospinelli
[ { node: { name: 'php-documents', __typename: 'Repository' },
    __typename: 'RepositoryEdge' },
  { node: { name: 'Validation', __typename: 'Repository' },
    __typename: 'RepositoryEdge' },
  { node: { name: 'Structural', __typename: 'Repository' },
    __typename: 'RepositoryEdge' },
  { node: { name: 'developing-for-business', __typename: 'Repository' },
    __typename: 'RepositoryEdge' } ]

Return a JSON string representing an array of repository names
*/

export function getPinnedRepoNames(nodeAry) {
  let dataAry = [];
  nodeAry.forEach(function (aryItem) {
    dataAry.push(aryItem.node.name);
  });
  return JSON.stringify(dataAry);
}
