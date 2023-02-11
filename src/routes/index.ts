import { Router } from "express";
import { GITHUB_API_ERROR_MESSAGES } from "../enums/github-api-error-messages.enums";
import fetchPRList from "../services/fetchPRList";

const router = Router();

router.get("/:author/:repo", async (req, res) => {
  try {
    const { author, repo } = req.params;
    const githubRes = await fetchPRList(`${author}/${repo}`);
    res.json(githubRes);
  } catch (e: any) {
    console.error(e);
    if (e.message === GITHUB_API_ERROR_MESSAGES.INVALID_REPO_NAME) {
      res.status(400).json({
        message: GITHUB_API_ERROR_MESSAGES.INVALID_REPO_NAME,
      });
    } else if (e.response.data) { // Github Errors will send a data blob
      res.status(e.response.status).json({
        ...e.response.data,
      });
    } else {
      res.status(500).json({
        message: e?.message || "Internal Server Error",
      });
    }
  }
});

export default router;