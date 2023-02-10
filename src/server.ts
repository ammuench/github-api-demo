import express from "express";
import dotenv from "dotenv";

// Router Imports
import IndexRoutes from "./routes/index";

// Check for token
dotenv.config();
if (!process.env.GITHUB_ACCESS_TOKEN) {
  throw new Error("No Github Access Token Provided in process.env file");
}


const app = express();
const port = 3000;


app.use("/", IndexRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});