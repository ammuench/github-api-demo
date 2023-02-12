import { faker } from "@faker-js/faker";

import getPRCommitCount from "./getPRCommitCount";

import githubApi from "../apiBase";

import { GITHUB_API_ERROR_MESSAGES } from "../../enums/github-api-error-messages.enums";

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

describe("# getPRCommitCount api/get method", () => {
  afterEach(() => {
    // Clear counts on api mock
    jest.clearAllMocks();
  });

  it("should exist", () => {
    expect(getPRCommitCount).toBeTruthy();
  });
  it("should immediately throw an error and not make any API calls if the URL is not valid", async () => {
    const EXPECTED_ERROR = GITHUB_API_ERROR_MESSAGES.INVALID_COMMIT_URL;

    try {
      await getPRCommitCount(faker.internet.url());
    } catch (e: any) {
      expect(githubApi.get).not.toHaveBeenCalled();
      expect(e.message).toBe(EXPECTED_ERROR);
    }
  });
  it("should call the API using the given URL but with a page-size of 1", async () => {
    const TEST_URL = `https://api.github.com/repos/${faker.internet.userName()}/${faker.random.word()}/pulls/${faker.random.numeric(2)}/commits`;
    const EXPECTED_URL = `${TEST_URL.match(/^https:\/\/api.github.com(.+)$/)![1]}?per_page=1`;

    mockGithubApi.get.mockResolvedValue({
      data: {
      },
      headers: {
        link: undefined,
      },
    });

    await getPRCommitCount(TEST_URL);
    expect(githubApi.get).toHaveBeenCalledWith(EXPECTED_URL);
  });
  it("should return 1 when the API returns no header.link information", async () => {
    const EXPECTED_VALUE = 1;
    const TEST_URL = `https://api.github.com/repos/${faker.internet.userName()}/${faker.random.word()}/pulls/${faker.random.numeric(2)}/commits`;


    mockGithubApi.get.mockResolvedValue({
      data: {
      },
      headers: {
        link: undefined,
      },
    });

    const TEST_RESULT = await getPRCommitCount(TEST_URL);
    expect(githubApi.get).toHaveBeenCalled();
    expect(TEST_RESULT).toBe(EXPECTED_VALUE);
  });
  it("should return the 'totalPages' value as count when there is header.link information", async () => {
    const EXPECTED_VALUE = parseInt(faker.random.numeric(2), 10);
    const TEST_HEADER_LINKVAL = `<https://api.github.com/repositories/${faker.random.numeric(5)}/pulls?per_page=1&state=open&page=${EXPECTED_VALUE}>; rel="last"`;
    const TEST_URL = `https://api.github.com/repos/${faker.internet.userName()}/${faker.random.word()}/pulls/${faker.random.numeric(2)}/commits`;


    mockGithubApi.get.mockResolvedValue({
      data: {
      },
      headers: {
        link: TEST_HEADER_LINKVAL,
      },
    });

    const TEST_RESULT = await getPRCommitCount(TEST_URL);
    expect(githubApi.get).toHaveBeenCalled();
    expect(TEST_RESULT).toBe(EXPECTED_VALUE);
  });
  it("should retry the API call once if it hits a rate limit", async () => {
    const EXPECTED_VALUE = 1;
    const TEST_URL = `https://api.github.com/repos/${faker.internet.userName()}/${faker.random.word()}/pulls/${faker.random.numeric(2)}/commits`;
    const EXPECTED_URL = `${TEST_URL.match(/^https:\/\/api.github.com(.+)$/)![1]}?per_page=1`;


    mockGithubApi.get
      .mockRejectedValueOnce({
        response: {
          headers: {
            "retry-after": 0.1,
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
        },
        headers: {
          link: undefined,
        },
      });

    const TEST_RESULT = await getPRCommitCount(TEST_URL);
    expect(githubApi.get).toHaveBeenCalledTimes(2);
    expect(githubApi.get).toHaveBeenNthCalledWith(1, EXPECTED_URL);
    expect(githubApi.get).toHaveBeenNthCalledWith(2, EXPECTED_URL);
    expect(TEST_RESULT).toBe(EXPECTED_VALUE);
  });
  it("should not retry if a non-retry error is thrown", async () => {
    const consoleError = console.error;
    console.error = jest.fn(); // Suppress console.error logs from output
    const EXPECTED_ERR = faker.random.words();
    const TEST_URL = `https://api.github.com/repos/${faker.internet.userName()}/${faker.random.word()}/pulls/${faker.random.numeric(2)}/commits`;


    mockGithubApi.get.mockRejectedValueOnce(EXPECTED_ERR);

    try {
      await getPRCommitCount(TEST_URL);
    } catch (e: any) {
      console.error = consoleError;
      expect(githubApi.get).toHaveBeenCalledTimes(1);
      expect(e.message).toEqual(EXPECTED_ERR);
    }
  });
});