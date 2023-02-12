import { faker } from "@faker-js/faker";

import getPaginationCall from "./getPaginationCall";

import githubApi from "../apiBase";

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

describe("# getPaginationCall api/get method", () => {
  it("should exist", () => {
    expect(getPaginationCall).toBeTruthy();
  });
  it("returns data prop from given URL", async () => {
    const EXPECTED_RESULT = {
      [faker.random.word()]: faker.random.words(),
      [faker.random.word()]: faker.random.words(),
      [faker.random.word()]: faker.random.words(),
      [faker.random.word()]: faker.random.words(),
    };
    const TEST_URL = `${faker.random.word()}/${faker.random.word()}/${faker.random.word()}`;
    const EXPECTED_URL = `/${TEST_URL}`;

    mockGithubApi.get.mockResolvedValue({
      data: EXPECTED_RESULT,
      headers: {
        link: undefined,
      },
    });

    const TEST_RESULT = await getPaginationCall(TEST_URL);

    expect(githubApi.get).toHaveBeenLastCalledWith(EXPECTED_URL);
    expect(TEST_RESULT).toEqual(EXPECTED_RESULT);
  });
});