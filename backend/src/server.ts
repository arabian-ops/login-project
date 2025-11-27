import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";


dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/", authRoutes);
app.use("/", taskRoutes);

console.log(process.env);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export default app;
