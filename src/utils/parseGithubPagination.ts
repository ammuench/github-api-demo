interface GithubPaginationData {
  first?: string;
  prev?: string;
  next?: string;
  last?: string;
}

const parseGithubPagination = (paginationLinkVal: string = ""): GithubPaginationData => {
  const paginationItems = paginationLinkVal.split(",");

  const parsedPaginationData: GithubPaginationData = {
  };
  
  paginationItems.forEach((pageItem) => {
    const matchPaginationUrl = pageItem.match(/https:\/\/api.github.com\/(.+)\>;/);
    const matchPaginationDirection = pageItem.match(/rel="(first|prev|next|last)"/);
    const PAGINATION_URL_MATCH_IDX = 1;
    const PAGINATION_DIRECTION_MATCH_IDX = 1;

    if (matchPaginationDirection && matchPaginationUrl) {
      parsedPaginationData[matchPaginationDirection[PAGINATION_DIRECTION_MATCH_IDX] as keyof GithubPaginationData] = matchPaginationUrl[PAGINATION_URL_MATCH_IDX];
    }
  });

  return parsedPaginationData;
};

export default parseGithubPagination;