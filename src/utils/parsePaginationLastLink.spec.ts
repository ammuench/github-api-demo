import parsePaginationLastLink from "./parsePaginationLastLink";

describe("# parsePaginationLastLink util method", () => {
  it("returns null if it cannot parse the link", () => {
    const EXPECTED_RESULT = null;

    const TEST_RESULT = parsePaginationLastLink("asdf");

    expect(TEST_RESULT).toBe(EXPECTED_RESULT);
  });
  it("properly parses a valid link and returns a LastPageData object", () => {
    const EXPECTED_RESULT = {
      paginationUrlStub: "repositories/1300192/issues?page_limit=100&page=",
      totalPages: 515,
    };

    const TEST_PARAM = "repositories/1300192/issues?page_limit=100&page=515";
    const TEST_RESULT = parsePaginationLastLink(TEST_PARAM);

    expect(TEST_RESULT).toEqual(EXPECTED_RESULT);
  });
});