import githubApi from "../apiBase";
import { GithubApiSimplePullRequest } from "../../types/github-api.types";
import { GITHUB_API_ERROR_MESSAGES } from "../../enums/github-api-error-messages.enums";
import parseGithubPagination from "../../utils/parseGithubPagination";

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
  let prData = [...data];
  const paginationInfo = parseGithubPagination(headers.link);
  if(paginationInfo.next) {
    prData = await getPaginatedPRs(paginationInfo.next, prData);
  }

  return prData;
};

const getPaginatedPRs = async (nextPageUrl: string, currentData: GithubApiSimplePullRequest[] ): Promise<GithubApiSimplePullRequest[]> => {
  const res = await githubApi.get<GithubApiSimplePullRequest[]>(`/${nextPageUrl}`);
  const { headers, data } = res;
  let updatedPRData = [...currentData, ...data];
  const paginationInfo = parseGithubPagination(headers.link);
  if (paginationInfo.next) {
    updatedPRData = await getPaginatedPRs(paginationInfo.next, updatedPRData);
  }

  return updatedPRData;
};

export default getOpenGithubPRs;