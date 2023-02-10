import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const githubApi = axios.create({
  baseURL: "https://api.github.com/",
  headers: {
    "Authorization": `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
    "X-GitHub-Api-Version": "2022-11-28",
  },
});

export default githubApi;