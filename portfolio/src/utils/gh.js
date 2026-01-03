const username = "hkfuertes";
const token = import.meta.env.GITHUB_TOKEN;

const getPinnedProjects = async () => {


    if (!token) return [];

    const query = `
{
  user(login: "${username}") {
    pinnedItems(first: 6, types: REPOSITORY) {
      nodes {
        ... on Repository {
          name
          description
          url
          stargazerCount
          forkCount
          languages(first: 4, orderBy: {field: SIZE, direction: DESC}) {
            edges {
              node {
                name
                color
              }
            }
          }
        }
      }
    }
  }
}`;


    const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            "Authorization": `bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query })
    });

    const data = await response.json();
    return data.data.user.pinnedItems.nodes;
}

const getContributedProjects = async () => {
    if (!token) return [];
    const query = `
{
  search(
    query: "type:pr author:${username} -user:${username} is:merged is:public"
    type: ISSUE
    first: 100
  ) {
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      node {
        ... on PullRequest {
          title
          url
          repository {
            name
            owner {
              login
            }
          }
          createdAt
          state
          merged
          mergedAt
        }
      }
    }
  }
}`;

const response = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: {
    "Authorization": `bearer ${token}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ query })
});

const data = await response.json();
return data.data.search.edges.map(edge => edge.node);
}

export { getPinnedProjects, getContributedProjects };