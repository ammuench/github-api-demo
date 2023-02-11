import { Router } from "express";
import githubApi from "../api/apiBase";

const router = Router();

router.get("/", async (req, res) => {
  const githubRes = await githubApi.get("/repos/jezen/is-thirteen/pulls/748/commits");
  const { data } = githubRes;
  res.json(data);
});

export default router;