import getOpenGithubPRs from "../api/get/getOpenGithubPR";
import getPRCommitCount from "../api/get/getPRCommitCount";

interface PullRequestList {
  id: number;
  number: number;
  title: string;
  author: string;
  commit_count: number | string;
}

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