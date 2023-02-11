import getOpenGithubPRs from "../api/get/getOpenGithubPR";

interface PullRequestList {
  id: number;
  number: number; 
  title: string;
  author: string;
  commit_count: number; 
}

const fetchPRList = async (repoPath: string): Promise<PullRequestList[]> => {
  const rawPRData = await getOpenGithubPRs(repoPath);
  const formattedPRData: PullRequestList[] = rawPRData.map((rawPR) => {
    return {
      id: rawPR.id,
      number: rawPR.number,
      title: rawPR.title,
      author: rawPR.user?.login ?? "Unknown Author",
      commit_count: -1,
    };
  });

  return formattedPRData;
};

export default fetchPRList;