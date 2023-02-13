import request from "supertest";
import nock from "nock";

import githubApiSinglePageAPIResponse from "../cached_data/githubApiSinglePageAPIResponse.json";

import { GITHUB_API_ERROR_MESSAGES } from "../../enums/github-api-error-messages.enums";
import pullRequestRoutes from "../../routes/pullRequestsRoutes";


import Express from "express";
import { faker } from "@faker-js/faker";

const app = Express();

app.use("/pull-requests", pullRequestRoutes);

const originalError = console.error;

describe("# Pull Request Router", () => {
  beforeAll(() => {
    console.error = jest.fn(); // Suppress expected error messages on these routes 
  });
  afterAll(() => {
    console.error = originalError; // Restore console.error
  });
  describe("GET /pull-requests/:user/:name errors", () => {
    it("throws a 400 error if the repo name is invalid", async () => {
      const response = await request(app).get("/pull-requests/bad/repo+123");
      expect(response.status).toBe(400);
      expect(JSON.parse(response.text).message).toBe(GITHUB_API_ERROR_MESSAGES.INVALID_REPO_NAME);
    });
    it("throws a 404 error if the repo doesn't exist", async () => {
      const response = await request(app).get("/pull-requests/ammuench/12346987");
      expect(response.status).toBe(404);
    });
    it("throws a 500 if a generic/unhandled error occurs", async () => {
      const EXPECTED_RESULT_1 = `ERROR: ${faker.random.words(3)}`;

      nock("https://api.github.com")
        .get("/repos/error/trigger/pulls?per_page=100&state=open")
        .reply(500, EXPECTED_RESULT_1);


      const response = await request(app).get("/pull-requests/error/trigger");

      expect(response.status).toEqual(500);
      expect(response.text).toBe(EXPECTED_RESULT_1);
    });
  });
  describe("GET /pull-requests/:user/:name success responses", () => {
    it("returns formatted data from successful repos", async () => {
      nock("https://api.github.com")
        .get("/repos/test/repo/pulls?per_page=100&state=open")
        .reply(200, githubApiSinglePageAPIResponse);

      nock("https://api.github.com/repos/test/repo/pulls/")
        .get(uri => uri.includes("/commits"))
        .reply(200, [
          {
            foo: "bar",
          },
        ])
        .persist();

      const response = await request(app).get("/pull-requests/test/repo");

      const EXPECTED_RESULT = [
        {
          "id": 1228984079,
          "number": 70,
          "title": "Bump http-cache-semantics from 4.1.0 to 4.1.1",
          "author": "dependabot[bot]",
          "commit_count": 1,
        },
        {
          "id": 1189546863,
          "number": 69,
          "title": "Bump json5 from 1.0.1 to 1.0.2",
          "author": "dependabot[bot]",
          "commit_count": 1,
        },
        {
          "id": 1182413875,
          "number": 68,
          "title": "Bump json5 and @angular-devkit/build-angular",
          "author": "dependabot[bot]",
          "commit_count": 1,
        },
        {
          "id": 1167322285,
          "number": 67,
          "title": "Bump express from 4.17.2 to 4.18.2",
          "author": "dependabot[bot]",
          "commit_count": 1,
        },
        {
          "id": 1153810450,
          "number": 66,
          "title": "Bump decode-uri-component from 0.2.0 to 0.2.2",
          "author": "dependabot[bot]",
          "commit_count": 1,
        },
        {
          "id": 1150637514,
          "number": 65,
          "title": "Bump qs and express",
          "author": "dependabot[bot]",
          "commit_count": 1,
        },
        {
          "id": 1123540971,
          "number": 64,
          "title": "Bump loader-utils from 1.4.0 to 1.4.2",
          "author": "dependabot[bot]",
          "commit_count": 1,
        },
        {
          "id": 1045843359,
          "number": 62,
          "title": "Bump node-forge and @angular-devkit/build-angular",
          "author": "dependabot[bot]",
          "commit_count": 1,
        },
        {
          "id": 1045838363,
          "number": 61,
          "title": "Bump terser and @angular-devkit/build-angular",
          "author": "dependabot[bot]",
          "commit_count": 1,
        },
        {
          "id": 924225286,
          "number": 59,
          "title": "Bump async from 2.6.3 to 2.6.4",
          "author": "dependabot[bot]",
          "commit_count": 1,
        },
        {
          "id": 897682516,
          "number": 58,
          "title": "Bump minimist from 1.2.5 to 1.2.6",
          "author": "dependabot[bot]",
          "commit_count": 1,
        },
      ];

      expect(response.body).toEqual(EXPECTED_RESULT);
    });
  });

});