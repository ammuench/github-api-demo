import parseGithubPagination from "./parseGithubPagination";

describe("# parseGithubPagination util method", () => {
  it("should provide an empty object when a null/undefined value is provided", () => {
    const EXPECTED_RESULT = new Object();
    const TEST_RESULT = parseGithubPagination(undefined);

    expect(TEST_RESULT).toEqual(EXPECTED_RESULT);
  });

  it("should parse a header.links string and provide an object with the matched values", () => {
    const TEST_PARAM = "<https://api.github.com/repositories/1300192/issues?page=2>; rel=\"prev\", <https://api.github.com/repositories/1300192/issues?page=4>; rel=\"next\", <https://api.github.com/repositories/1300192/issues?page=515>; rel=\"last\", <https://api.github.com/repositories/1300192/issues?page=1>; rel=\"first\"";
    const EXPECTED_RESULT = {
      prev: "repositories/1300192/issues?page=2",
      next: "repositories/1300192/issues?page=4",
      first: "repositories/1300192/issues?page=1",
      last: "repositories/1300192/issues?page=515",
    };

    const TEST_RESULT = parseGithubPagination(TEST_PARAM);

    expect(TEST_RESULT).toEqual(EXPECTED_RESULT);
  });
});