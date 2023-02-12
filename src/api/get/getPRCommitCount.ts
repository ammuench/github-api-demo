import githubApi from "../apiBase";

/**
 * Gets count of commits in a PR
 *
 * @param {string} paginationURL URL with pagination value supplied
 * @return {*}  {Promise<T>}
 */
const getPRCommitCount = async (paginationURL: string): Promise<number> => {
  const paginationDataCall = await githubApi.get(`/${paginationURL}`);
  return paginationDataCall.data;
};

  
export default getPRCommitCount; 