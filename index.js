import express from "express";
import cors from "cors";
import titleRoute from "./routes/title.js";
import transcribeRoute from "./routes/transcribe.js";
import transcribeMp4Route from "./routes/transcribemp4.js";

const app = express();
app.use("/get", titleRoute);
app.use("/transcribe", transcribeRoute);
app.use("/mp4", transcribeMp4Route);

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
