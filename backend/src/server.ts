import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.ts";
import config  from "dotenv"

config.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/", authRoutes);


console.log(process.env);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export default app; 

