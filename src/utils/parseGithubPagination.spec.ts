import parseGithubPagination from "./parseGithubPagination";

describe("# parseGithubPagination util method", () => {
  it("should provide an empty object when a null/undefined value is provided", () => {
    const EXPECTED_RESULT = new Object();
    const TEST_RESULT = parseGithubPagination(undefined);

    expect(TEST_RESULT).toEqual(EXPECTED_RESULT);
  });
});