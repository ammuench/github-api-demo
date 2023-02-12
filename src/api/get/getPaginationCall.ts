import githubApi from "../apiBase";

/**
 * Helper method to get data from direct pagination URL call
 *
 * @param {string} paginationURL URL with pagination value supplied
 * @return {*}  {Promise<T>}
 */
const getPaginationCall = async <T>(paginationURL: string): Promise<T> => {
  const paginationDataCall = await githubApi.get<T>(`/${paginationURL}`);
  return paginationDataCall.data;
};


export default getPaginationCall;
