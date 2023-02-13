interface GithubPaginationData {
  first?: string;
  prev?: string;
  next?: string;
  last?: string;
}

/**
 * Breaks the `last` value of a pagination object into a easy-to-read object
 *
 * @param {string} paginationLinkVal String value from header.link that contains all possible pagination links with corresponding rels
 * @return {GithubPaginationData} {GithubPaginationData} Returns object that contains any parseable header.link values
 */
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