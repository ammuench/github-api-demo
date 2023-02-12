import { faker } from "@faker-js/faker";

import fetchPRList, { PullRequestList } from "./fetchPRList";

import getOpenGithubPRs from "../api/get/getOpenGithubPR";
import getPRCommitCount from "../api/get/getPRCommitCount";
import { GithubApiSimplePullRequest } from "../types/github-api.types";

//Setup Mocks
jest.mock("../api/get/getOpenGithubPR", () => ({
  ...jest.requireActual("../api/get/getOpenGithubPR"),
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("../api/get/getPRCommitCount", () => ({
  ...jest.requireActual("../api/get/getPRCommitCount"),
  __esModule: true,
  default: jest.fn(),
}));

// Setup Mock Refs
const mockGetOpenGithubPRs = getOpenGithubPRs as jest.Mock;
const mockGetPRCommitCount = getPRCommitCount as jest.Mock;

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

const mapRawDataToPRList = (rawData: GithubApiSimplePullRequest, commitCount: number): PullRequestList => {
  return {
    id: rawData.id,
    number: rawData.number,
    title: rawData.title,
    author: rawData.user!.login,
    commit_count: commitCount,
  };
};

describe("# fetchPRList service", () => {
  it("should exist", () => {
    expect(fetchPRList).toBeTruthy();
  });
  it("should format raw PR and Commit data as an array of PullRequestList items", async () => {
    const MOCK_DATA = generateMockPRAPIData(5);
    const EXPECTED_RESULT = MOCK_DATA.map((rawMockItem) => {
      return mapRawDataToPRList(rawMockItem, parseInt(faker.random.numeric(1), 10));
    });

    mockGetOpenGithubPRs.mockResolvedValue(MOCK_DATA);
    mockGetPRCommitCount
      .mockResolvedValueOnce(EXPECTED_RESULT[0].commit_count)
      .mockResolvedValueOnce(EXPECTED_RESULT[1].commit_count)
      .mockResolvedValueOnce(EXPECTED_RESULT[2].commit_count)
      .mockResolvedValueOnce(EXPECTED_RESULT[3].commit_count)
      .mockResolvedValueOnce(EXPECTED_RESULT[4].commit_count);

    const TEST_RESULT = await fetchPRList("ASDF");
    expect(TEST_RESULT).toEqual(EXPECTED_RESULT);
  });
  it("should return the Github User as Author if it's provided", async () => {
    const MOCK_DATA = generateMockPRAPIData(1);
    const EXPECTED_RESULT = MOCK_DATA[0].user!.login;

    mockGetOpenGithubPRs.mockResolvedValue(MOCK_DATA);
    mockGetPRCommitCount.mockResolvedValueOnce(1);

    const TEST_RESULT = await fetchPRList("ASDF");
    expect(TEST_RESULT[0].author).toEqual(EXPECTED_RESULT);
  });
  it("should return 'Unknown Author' if Github doesn't have the author value", async () => {
    const MOCK_DATA = {
      ...generateMockPRAPIData(1)[0],
      user: undefined as any,
    } as GithubApiSimplePullRequest;
    const EXPECTED_RESULT = "Unknown Author";

    mockGetOpenGithubPRs.mockResolvedValue([MOCK_DATA]);
    mockGetPRCommitCount.mockResolvedValueOnce(1);

    const TEST_RESULT = await fetchPRList("ASDF");
    expect(TEST_RESULT[0].author).toEqual(EXPECTED_RESULT);
  });
});