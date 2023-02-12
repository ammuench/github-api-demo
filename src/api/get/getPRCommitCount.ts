import githubApi from "../apiBase";

import { MAX_API_PAGE_SIZE } from "../../enums/github-api.enums";
import { GithubAPICommit } from "../../types/github-api.types";
import parseGithubPagination from "../../utils/parseGithubPagination";
import parsePaginationLastLink from "../../utils/parsePaginationLastLink";
import { GITHUB_API_ERROR_MESSAGES } from "../../enums/github-api-error-messages.enums";

/**
 * Gets count of commits in a PR
 *
 * @param {string} prCommitURL URL from PR to fetch it's commits
 * @return {*}  {Promise<T>}
 */
const getPRCommitCount = async (prCommitURL: string): Promise<number | string> => {
  const prCommitUrlStubRegex = prCommitURL.match(/^https:\/\/api.github.com(.+)$/);

  if (!prCommitUrlStubRegex) {
    throw new Error(GITHUB_API_ERROR_MESSAGES.INVALID_COMMIT_URL);
  }

  const URL_STUB_IDX = 1;
  const stubUrlForApiCall = prCommitUrlStubRegex[URL_STUB_IDX];

  const { headers, data } = await githubApi.get<GithubAPICommit[]>(`${stubUrlForApiCall}?per_page=${MAX_API_PAGE_SIZE}`);

  if (data.length <= MAX_API_PAGE_SIZE) {
    return data.length;
  }

  const paginationInfo = parseGithubPagination(headers.link);
  const lastPageInfo = parsePaginationLastLink(paginationInfo.last ?? "");

  if (lastPageInfo) {
    const lastPageCommitsCall = await githubApi.get<GithubAPICommit[]>(`/${lastPageInfo.paginationUrlStub}${lastPageInfo.totalPages}`);
    const lastPageLength = lastPageCommitsCall.data.length;
    const totalCommits = (lastPageInfo.totalPages - 1 * MAX_API_PAGE_SIZE) + lastPageLength;
    return totalCommits;
  }

  return "Unknown";
};


export default getPRCommitCount; 