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
      res.status(400).send({
        message: GITHUB_API_ERROR_MESSAGES.INVALID_REPO_NAME,
      });
      res.end();
      return;
    }

    if (e.response.data) { // Github Errors will send a data blob
      res.status(e.response.status).send(
        e.response.data
      );
      res.end();
      return;
    }

    console.log({
      label: "ERROR",
      e,
    });

    res.status(500).send({
      message: e?.message || "Internal Server Error",
    });
    res.end();
    return;
  }
});

export default router;