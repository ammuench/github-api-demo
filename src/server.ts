import express from "express";
import dotenv from "dotenv";

// Router Imports
import pullRequestRoutes from "./routes/pullRequestsRoutes";

// Check for token
dotenv.config();
if (!process.env.GITHUB_ACCESS_TOKEN) {
  throw new Error("No Github Access Token Provided in process.env file");
}


const app = express();
const port = 3000;

app.all("/", (req, res) => {
  res.json({
    message: "Hey!  The API you probably want is at /pull-requests/:author/:repo-name",
  });
});

app.use("/pull-requests", pullRequestRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});