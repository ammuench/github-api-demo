interface LastPageData {
  paginationUrlStub: string;
  totalPages: number;
}

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