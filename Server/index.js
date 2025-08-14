import "dotenv/config";
import express from "express";
import cors from "cors";
import chatRouter from "./routes/chat.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Gemini backend is running ✅"));
app.use("/chat", chatRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
