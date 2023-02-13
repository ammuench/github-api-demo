import githubApi from "../apiBase";

import { GithubAPICommit } from "../../types/github-api.types";
import parseGithubPagination from "../../utils/parseGithubPagination";
import parsePaginationLastLink from "../../utils/parsePaginationLastLink";
import { GITHUB_API_ERROR_MESSAGES } from "../../enums/github-api-error-messages.enums";

/**
 * Gets count of commits in a PR
 *
 * @param {string} prCommitURL URL from PR to fetch it's commits
 * @return {Promise<T>}  {Promise<T>}
 */
const getPRCommitCount = async (prCommitURL: string): Promise<number | string> => {
  const prCommitUrlStubRegex = prCommitURL.match(/^https:\/\/api.github.com(.+)$/);

  if (!prCommitUrlStubRegex) {
    throw new Error(GITHUB_API_ERROR_MESSAGES.INVALID_COMMIT_URL);
  }

  const URL_STUB_IDX = 1;
  const stubUrlForApiCall = prCommitUrlStubRegex[URL_STUB_IDX];

  try {
    const { headers } = await githubApi.get<GithubAPICommit[]>(`${stubUrlForApiCall}?per_page=1`);

    const paginationInfo = parseGithubPagination(headers.link);
    const lastPageInfo = parsePaginationLastLink(paginationInfo.last ?? "");

    if (!lastPageInfo) {
      return 1;
    }

    return lastPageInfo.totalPages;

  } catch (e: any) {
    /* 
     * Github's API limit can be hit on repos with large amounts of PRs open
     * when we have to call additional calls on each PR for commit length (like reactjs/reactjs.org for example).
     * So here we wait out their retry-after header plus 1 ms and process the call again until we hit it again.
     * 
     * If we hit multiple errors after waiting throw an error b/c the API has probably locked us out for an amount of
     * time that will grow the more we hit it
     */
    if (e?.response?.headers && e.response.headers["retry-after"]) {
      await new Promise(r => setTimeout(r, ((e.response.headers["retry-after"] * 1000) + 1)));
      return await getPRCommitCount(prCommitURL);
    }

    console.error(e);
    throw new Error(e);
  }
};


export default getPRCommitCount; 