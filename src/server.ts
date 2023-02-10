import express from "express";

// Router Imports

import IndexRoutes from "./routes/index";

const app = express();
const port = 3000;


app.use("/", IndexRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});