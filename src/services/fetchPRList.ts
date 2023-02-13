import getOpenGithubPRs from "../api/get/getOpenGithubPR";
import getPRCommitCount from "../api/get/getPRCommitCount";

export interface PullRequestList {
  id: number;
  number: number;
  title: string;
  author: string;
  commit_count: number | string;
}


/**
 * Breaks the `last` value of a pagination object into a easy-to-read object
 *
 * @param {string} repoPath Link for `last` page URL
 * @return {Promise<PullRequestList[]>} Returns parsed object or null is string cannot be parsed
 */
const fetchPRList = async (repoPath: string): Promise<PullRequestList[]> => {
  const rawPRData = await getOpenGithubPRs(repoPath);
  const formattedPRData = rawPRData.map(async (rawPR) => {
    const commitCount = await getPRCommitCount(rawPR.commits_url);
    return {
      id: rawPR.id,
      number: rawPR.number,
      title: rawPR.title,
      author: rawPR.user?.login ?? "Unknown Author",
      commit_count: commitCount,
    } as PullRequestList;
  });

  const resolvedData = await Promise.all(formattedPRData);
  return resolvedData;
};

export default fetchPRList;