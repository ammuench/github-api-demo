# github-api-demo

A standalone API that opens a GET endpoint at `http://localhost:3000/pull/request/:user/:reponame` that returns all data about PRs for a given repository in the following format

```js
[
  {
    id: 1,
    number: 100,
    title: "Tile of Pull Request 1",
    author: "Author of Pull Request 1",
    commit_count: 8,
  },
  {
    id: 2,
    number: 101,
    title: "Tile of Pull Request 2",
    author: "Author of Pull Request 2",
    commit_count: 4,
  },
  {
    id: 3,
    number: 102,
    title: "Tile of Pull Request 3",
    author: "Author of Pull Request 3",
    commit_count: 12,
  },
];
```

## Installation

Clone the repository and then run

```bash
yarn
```

from the root of the cloned folder to install dependencies

## Package Scripts

### `yarn start`

Runs the latest production build of the application from `/dist/server.js`

### `yarn build`

Builds all non-test files in `/src` and outputs them into `/dist`

### `yarn watch`

Runs a `nodemon` instance of the application that will update and rebuild every time there is a change within the `/src` directory

### `yarn test`

Runs all `jest` tests within `/src`

### `yarn test:coverage`

Runs all tests with a coverage report at the end

### `yarn test:unit`

Runs ONLY unit tests

### `yarn test:e2e`

Runs ONLY e2e tests

### `yarn lint`

Runs `ESLint` with current configs from `.eslintrc.json` on all files in the project

### `yarn lint:fix`

Runs `ESLint` with current configs from `.eslintrc.json` on all files in the project and fixes what is auto-fixable

### `yarn lint:staged`

Runs `ESLint` on all files staged for commit and fixes what is auto-fixable
