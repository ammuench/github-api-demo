import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json("Index Route Get");
});

export default router;