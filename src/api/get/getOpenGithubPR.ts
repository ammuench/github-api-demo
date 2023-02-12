import getPaginationCall from "./getPaginationCall";

import githubApi from "../apiBase";

import { MAX_API_PAGE_SIZE } from "../../enums/github-api.enums";
import { GITHUB_API_ERROR_MESSAGES } from "../../enums/github-api-error-messages.enums";
import { GithubApiSimplePullRequest } from "../../types/github-api.types";
import parseGithubPagination from "../../utils/parseGithubPagination";
import parsePaginationLastLink from "../../utils/parsePaginationLastLink";

/**
 * Fetches open PRs in given github repo
 *
 * @param {string} repoPath Repository name in format `<AUTHOR>/<REPONAME>`
 * @return {*}  {Promise<AxiosResponse<GithubApiSimplePullRequest>>}
 */
const getOpenGithubPRs = async (repoPath: string): Promise<GithubApiSimplePullRequest[]> => {
  const repoMatch = repoPath.match(/^[\w|\d|-]+\/[\w|\d|\-|\.|_]+$/);

  if (!repoMatch) {
    throw new Error(GITHUB_API_ERROR_MESSAGES.INVALID_REPO_NAME);
  }

  try {
    const res = await githubApi.get<GithubApiSimplePullRequest[]>(`/repos/${repoPath}/pulls?per_page=${MAX_API_PAGE_SIZE}`);
    const { headers, data } = res;
    const prData = [...data];
    const paginationInfo = parseGithubPagination(headers.link);

    if (paginationInfo.next && paginationInfo.last) {
      const lastPageInfo = parsePaginationLastLink(paginationInfo.last);

      if (lastPageInfo) {
        const paginatedAPICalls: Promise<GithubApiSimplePullRequest[]>[] = [];

        for (let currentPage = 2; currentPage <= lastPageInfo.totalPages; currentPage++) {
          paginatedAPICalls.push(
            getPaginationCall<GithubApiSimplePullRequest[]>(`${lastPageInfo.paginationUrlStub}${currentPage}`)
          );
        }

        const paginatedData = await Promise.all(paginatedAPICalls);
        paginatedData.forEach((dataPage) => {
          prData.push(...dataPage);
        });
      }

    }

    return prData;
  } catch (e: any) {
    console.error(e);
    throw new Error(e.response.message);
  }
};

export default getOpenGithubPRs;