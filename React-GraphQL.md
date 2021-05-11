# GraphQL & React (LinkedIn Course)

[TOC]

[THIS](https://www.linkedin.com/learning/building-a-graphql-project-with-react-js/next-steps) LinkedIn course walks you through building a react app backed by GraphQL. Some helpful tools for this project are:

* React Developer Tools (Chrome extension)
* React Snippets (VS Code ES7 React/Redux/React-Native/JS snippets - VS Code)
* JS/JSX Snippets (VS Code)
* Course slides: https://raybo.org/slides_graphqlreact/#/

## Getting started

Using `npx` generate the skeleton of a new app with `npx create-react-app name_of_app`. Once the command has completed, you should be able to run `npm start` and see a simple React app in the browser. Some of the modules we get with this installation are:

* **Webpack**: Javascript bundler. It manages how our applications are assembled and the loading of the different modules into an application
* **Babel**: Javascript compiler that lets you write code with the latest Javascript features and allows you to convert it to older versions for browser compatibility.
* **ES Lint**: Javascript linter which analyzes code against best practices and syntax rules so that we can fix them. This works best with a VS Code extension (ESLint)
* **Jest**: lightweight testing framework
* **Web Vitals**: Group of performance monitoring tools for the site with accessibility, performance, and best practices in mind.

### Generated Files

In addition to the modules mentioned before, there are a few files that are important to the structure of an application:

* `package.json` : contains several pieces of configuration such as dependencies, lint configuration, target browser support, a `scripts` section to control the lifecycle of this application among other things.
* `robots.txt`: important for spiders and web crawlers parsing a website. This can be used to provide a sitemap and sections of your app that shouldn't be crawled.
* `manifest.json`: generally used for progressive web apps (PWA's); they allow projects to be installed in mobile platforms.
* `index.html`: main HTML template for the application. The most important piece is the `<div id="root"></div>` which is where the entire application will be loaded. We can add more elements to this file, but we shouldn't delete this root div.
* `index.js`: entry point of the entire application. It does global level things like importing the `index.css` stylesheet, react, the main `App` module, etc.

#### `App.js`

Out of the box, React is rendered in "strict mode", which complains and lets you know if you're writing potentially dangerous code. This only happens during development, and gets stripped out for production code:

```react
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
```

Another minor detail to note is how the `logo.svg` is being imported in `App.js`. Instead of placing it in the `public` directory, the `logo.svg` file lives with the rest of the source files, which makes it managed by Webpack, controlling how it gets inserted into documents, compressed, etcetera. With this way of importing, users can no longer navigate to a url in your server and access the content:

```react
import logo from './logo.svg'

function App() {
  return (
  	// ...
    <img src={logo} className="App-logo" alt="logo" />
  )
}
```

The code uses JSX which is a combination of Javascript and HTML that allows us to write components easily. Minor tweaks need to be done to some of the HTML syntax embedded in the JSX because it needs to remain as valid Javascript. For example, `class` is a valid keyword in Javascript, so when writing JSX we need to replace it with `className` instead. 

## Styling with Bootstrap/SASS

Because this course is not focused on CSS, we'll use Bootstrap with SASS to take care of styling our elements. We'll also include Bootstrap icons. In order to install Bootstrap styles, icons and SASS for our project, we need to run:

```bash
npm i bootstrap@next bootstrap-icons sass
```

After the command completes successfully, we will see the `package.json` file contains some updates to include the 3 new modules.

In order to tell the application to import the Bootstrap styles, we need to create a new source file: `src/custom.scss` :

```scss
@import "~bootstrap/scss/bootstrap.scss";
```

The `~` in the path is directing us to the node modules directory, where we'll be able to find all Bootstrap styles. This file contains imports of other files such as `_variables.scss` where lots of default variables are defined. We can override these definitions later if we don't like the default Boostrap values (e.g. colors like `$blue`). In order to override these definitions, we can do it in our `custom.scss` file:

```scss
$primary: #6f42c1;
```

Finally, to make it available to the entire application, we need to import it in the `index.js` file:

```react
import "./custom.scss";
```

## GraphQL

Open source query language for APIs. It only allows you to retrieve what you need, which makes it faster and reduces the amount of calls needed to fetch information. It was created by Facebook and has been running their mobile apps since 2012. It's been an open source project under its own foundation since 2018. It's also used by other big companies like Github.

GitHub's GraphQL is a great place to get started. It provides a simple UI to explore their GraphQL for your own GitHub account. This explorer has tons of helpful features to explore data and the GraphQL in general such as documentation, search query field autocomplete or suggestions, index of all available query fields, query history and more. It uses a GitHub-specific flavor of `GraphiQL` which is a separate application used for similar purposes. GitHub's version just allows you to easily sign into your account and play with your production data.

### Building Queries

The structure of all the data in your queries is known as the **schema**. This just means that we need to understand the structure of our data when we're building our queries. Searches are done by looking through **fields** and subfields, which can be of different **types** both common or custom.

There are 2 types of requests:

* **Queries**: includes fields we want to fetch
* **Mutations**: contains data to mutate elements in your application

#### Examples

If we want to see which fields are available for querying, in the explorer we can hit `CTRL` + `Space` to bring up a list of suggestions. Anything underlined will display a way to fix it (most likely cause is that the requested field requires more elements). For example, the following query is requesting for a couple of fields about the currently logged user:

```
{
  viewer {
    name
    company
  }
}
```

Some more complex queries may need arguments passed to them:

```
{
  license(key: "MIT") {
    name
    description
    body
    url
  }
}
```

The following query is asking for the first 2 repositories in the current list in descending order by creation date. It is also fetching the total count of repositories. The `nodes` element is used to ask fields for items on a list.

```
{
  viewer {
    repositories(first: 2, orderBy: {field: CREATED_AT, direction: DESC}) {
      totalCount
      nodes {
        name
        description
        id
      }
    }
  }
}
```

To add pagination GraphQL uses **edges** and **cursors**. A cursor is a unique ID that can be used to fetch elements before or after the provided cursor. For example, here we're asking for the first 5 repositories in the list after the provided cursor:

```
{
  viewer {
    repositories(first: 5, after: "Y3Vyc29yOnYyOpHOBtZz4A==") {
      totalCount
      edges {
        node {
          name
          description
          id
        }
        cursor
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
}
```

Here we're also asking for `pageInfo` which can help us with pagination and knowing where we are within the list in general.

## GitHub Auth Token

In order to be able to hit the GitHub GraphQL API, we need to generate an authentication token. In Settings > Developer Settings > Personal Access Tokens > Generate Token we need to pick a list of desired permissions. With a new token, we can now create a file that contains all the information needed to authenticate requests to the API (this file is being ignored by git, so it won't be commited to the repository):

```javascript
const github = {
    baseURL: "https://api.github.com/graphql",
    username: "username",
    headers: {
        "Content-Type": "application/json",
        Authorization: "bearer your_access_token"
    }
}

export default github;
```

After this file is created, we simply need to import it into our `App.js` file:

```react
import github from "./db.js";
```

## Retrieving data

We'll be adding the following import statement `import {useEffect} from "react";` This is a React hook. This is a feature that lets you perform "side effects" in function components (older versions of react use "lifecycle methods" like `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`, so this import is like a combination of all of those methods into a single hook).

Inside the `App()` function, we can define the GraphQL query via `useEffect`:

```react
  useEffect(() => {
    const githubQuery = {
      query: `
      {
        viewer {
          name
        }
      }
      `
      ,
    };
```

This query example is only fetching the name of the currently logged in user. Once we've created the query, we need use it in `fetch` to make the request. This only shows the app logging the response to the console after a successful fetch:

```react
    fetch(github.baseURL, {
      method: "POST",
      headers: github.headers,
      body: JSON.stringify(githubQuery)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
```

### Creating a Query Component

Because we know that our query can potentially grow to be very complex, we may want to clean up the code and improve the maintainability by moving it to a separate component (e.g. `Query.js`):

```react
const githubQuery = {
    query: `
    {
      viewer {
        name
      }
    }
    `
    ,
};

export default githubQuery;  
```

Which can now be imported via `import query from "./Query";` and used simply as `query`. Now the query can grow in its own file without reducing the readability of the `App.js` file.

## Generating State

In order to create and manage state, we can also use another React hook: `useState`, which is imported in the same way `import { useState } from "react";`

Adding this import will allow us to define a property and a setter inside the `App()` function:

```react
let [userName, setUserName] = useState("");
```

Here we've created the `userName` property and its setter `setUserName`. We can now use these in the `fetch` method to set our state as well as in the JSX returned by the function:

```react
.then(data => {
        setUserName(data.data.viewer.name);
      })
```

The object properties `data.viewer.name` just reflect the shape of the JSON response returned by the GitHub API. The JSX can use the property like this:

```react
<p>Hey there {userName}</p>
```

## Using the Callback Hook

As it is now, the application may be fetching the same data twice while rendering the same screen. This is because the `useEffect` hook may be called multiple times. As the application grows, this can be a problem, so we need to switch to a different hook: `useCallback` to optimize how and when items are rendered in our application by using _memoization_.

This hook receives a list of dependencies that it will use to trigger a new fetch:

```react
  const fetchData = useCallback(() => {
    fetch(github.baseURL, {
      method: "POST",
      headers: github.headers,
      body: JSON.stringify(query)
    })
      .then(response => response.json())
      .then(data => {
        setUserName(data.data.viewer.name);
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
```

