import { Router } from "express";
import githubApi from "../api/apiBase";

const router = Router();

router.get("/", async (req, res) => {
  // res.json("Index Route Get");
  const githubRes = await githubApi.get("/repos/ammuench/node-dota-api");
  const { data } = githubRes;
  res.json(data);
});

export default router;