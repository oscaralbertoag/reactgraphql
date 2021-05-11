const githubQuery = (pageCount, queryString) => {
    return {
        query: `
        {
            viewer {
              name
            }
            search(query: "${queryString} user:oscaralbertoag sort:updated-desc", type: REPOSITORY, first: ${pageCount}) {
              repositoryCount
              nodes {
                ... on Repository {
                  name
                  description
                  id
                  url
                  viewerSubscription
                }
              }
            }
          }      
        `
        ,
    };
}

export default githubQuery;