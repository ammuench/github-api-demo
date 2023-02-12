import { faker } from "@faker-js/faker";

import getOpenGithubPRs from "./getOpenGithubPR";

import githubApi from "../apiBase";

import { GITHUB_API_ERROR_MESSAGES } from "../../enums/github-api-error-messages.enums";
import { GithubApiSimplePullRequest } from "../../types/github-api.types";
import parseGithubPagination from "../../utils/parseGithubPagination";
import parsePaginationLastLink from "../../utils/parsePaginationLastLink";

//Setup Mocks
jest.mock("../apiBase", () => ({
  ...jest.requireActual("../apiBase"),
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

// Setup Mock Refs
const mockGithubApi = githubApi as jest.Mocked<typeof githubApi>;

const generateMockPRAPIData = (amt: number): GithubApiSimplePullRequest[] => {
  const mockPRAPIData: GithubApiSimplePullRequest[] = [];
  [...Array(amt)].forEach(() => {
    mockPRAPIData.push({
      id: parseInt(faker.random.numeric(), 10),
      number: parseInt(faker.random.numeric(2), 10),
      title: faker.random.words(),
      user: {
        login: faker.internet.userName(),
      },
      commits_url: faker.internet.url(),
    } as any);
  });
  return mockPRAPIData as [];
};

describe("# getOpenGithubPRs api/get method", () => {
  it("should exist", () => {
    expect(getOpenGithubPRs).toBeTruthy();
  });
  it("should return an 'invalid repo name' error immediately if an invalid repo name is provided", async () => {
    const EXPECTED_RESULT = GITHUB_API_ERROR_MESSAGES.INVALID_REPO_NAME;

    try {
      await getOpenGithubPRs("badreponame");
    } catch (e: any) {
      expect(e.message).toBe(EXPECTED_RESULT);
      expect(githubApi.get).not.toHaveBeenCalled();
    }
  });
  it("should return the data of the first API call if there is no pagination data in the headers for next/last page", async () => {
    const EXPECTED_RESULT = generateMockPRAPIData(3);

    const TEST_REPO_NAME = `${faker.random.word()}/${faker.random.word()}`;
    const EXPECTED_API_URL = `/repos/${TEST_REPO_NAME}/pulls?per_page=100&state=open`;

    mockGithubApi.get.mockResolvedValue({
      data: EXPECTED_RESULT,
      headers: {
        link: undefined,
      },
    });

    const TEST_RESULT = await getOpenGithubPRs(TEST_REPO_NAME);

    expect(githubApi.get).toHaveBeenCalledWith(EXPECTED_API_URL);
    expect(TEST_RESULT).toEqual(EXPECTED_RESULT);
  });

  it("should return the all pages of API data if pagination data exists", async () => {
    const TEST_PAGE1_DATA = generateMockPRAPIData(3);
    const TEST_PAGE2_DATA = generateMockPRAPIData(2);
    const TEST_REPO_ID = faker.random.numeric(7);
    const TEST_PAGE1_HEADERLINK = `<https://api.github.com/repositories/${TEST_REPO_ID}/pulls?per_page=100&state=open&page=2>; rel="next", <https://api.github.com/repositories/${TEST_REPO_ID}/pulls?per_page=100&state=open&page=2>; rel="last"`;
    const TEST_REPO_NAME = `${faker.random.word()}/${faker.random.word()}`;

    const parsedTestPaginationData = parseGithubPagination(TEST_PAGE1_HEADERLINK);
    const lastPageInfo = parsePaginationLastLink(parsedTestPaginationData.last as string);

    const EXPECTED_API_URL = `/repos/${TEST_REPO_NAME}/pulls?per_page=100&state=open`;
    const EXPECTED_PAGE2_URL = `/${lastPageInfo?.paginationUrlStub}2`;
    const EXPECTED_RESULT = [...TEST_PAGE1_DATA, ...TEST_PAGE2_DATA];

    mockGithubApi.get.mockImplementation((url) => {
      if (url === EXPECTED_API_URL) {
        return Promise.resolve({
          data: TEST_PAGE1_DATA,
          headers: {
            link: TEST_PAGE1_HEADERLINK,
          },
        });
      }
      if (url === EXPECTED_PAGE2_URL) {
        return Promise.resolve({
          data: TEST_PAGE2_DATA,
          headers: {
            link: undefined,
          },
        });
      }
      return Promise.resolve({
        data: [],
        headers: {
        },
      });
    });

    const TEST_RESULT = await getOpenGithubPRs(TEST_REPO_NAME);

    expect(TEST_RESULT).toEqual(EXPECTED_RESULT);
  });
});