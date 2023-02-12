import githubApi from "../apiBase";
import { GithubApiSimplePullRequest } from "../../types/github-api.types";
import { GITHUB_API_ERROR_MESSAGES } from "../../enums/github-api-error-messages.enums";
import parseGithubPagination from "../../utils/parseGithubPagination";
import getPaginationCall from "./getPaginationCall";

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

  const res = await githubApi.get<GithubApiSimplePullRequest[]>(`/repos/${repoPath}/pulls?per_page=100`);
  const { headers, data } = res;
  const prData = [...data];
  const paginationInfo = parseGithubPagination(headers.link);
  if(paginationInfo.next && paginationInfo.last) {
    const regexMatch = paginationInfo.last.match(/^(.+&page=)(\d+)$/);

    if (regexMatch) {
      const URL_STUB_IDX = 1;
      const TOTAL_PAGES_IDX = 2;
      const paginationUrlStub = regexMatch[URL_STUB_IDX];
      const totalPages = parseInt(regexMatch[TOTAL_PAGES_IDX], 10);

      const paginatedAPICalls: Promise<GithubApiSimplePullRequest[]>[] = [];
      
      for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
        paginatedAPICalls.push(
          getPaginationCall<GithubApiSimplePullRequest[]>(`${paginationUrlStub}${currentPage}`)
        );
      }

      const paginatedData = await Promise.all(paginatedAPICalls);
      paginatedData.forEach((dataPage) => {
        prData.push(...dataPage);
      });
    }

  }

  return prData;
};

export default getOpenGithubPRs;