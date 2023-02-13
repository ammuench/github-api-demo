interface LastPageData {
  paginationUrlStub: string;
  totalPages: number;
}

/**
 * Breaks the `last` value of a pagination object into a easy-to-read object
 *
 * @param {string} paginationLink Link for `last` page URL
 * @return {LastPageData | null}  {LastPageData | null} Returns parsed object or null is string cannot be parsed
 */
const parsePaginationLastLink = (paginationLink: string): LastPageData | null => {
  const regexMatch = paginationLink.match(/^(.+&page=)(\d+)$/);

  if (!regexMatch) {
    return null;
  }

  const URL_STUB_IDX = 1;
  const TOTAL_PAGES_IDX = 2;
  const paginationUrlStub = regexMatch[URL_STUB_IDX];
  const totalPages = parseInt(regexMatch[TOTAL_PAGES_IDX], 10);

  return {
    paginationUrlStub,
    totalPages,
  };
};

export default parsePaginationLastLink;