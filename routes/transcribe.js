import express from "express";
import multer from "multer";
import { Configuration, OpenAIApi } from "openai";
import cors from "cors";
import { Readable } from "stream";
import "dotenv/config";

const router = express.Router();
router.use(cors());
const upload = multer();
const configuration = new Configuration({
  apiKey: process.env.REACT_APP_API_URL,
  baseOptions: {
    maxBodyLength: 25 * 1024 * 1024, // 25 MB
  },
});

async function transcribe(audio_file) {
  let generatedText = "";
  let generatedCaption = "";
  let generatedTitle = "";
  let result = [];
  const openai = new OpenAIApi(configuration);
  const audioBuffer = audio_file.buffer;
  const audioReadStream = Readable.from(audioBuffer);
  audioReadStream.path = `test.mp4`;
  await openai
    .createTranscription(audioReadStream, "whisper-1")
    .then((result) => {
      generatedText = result.data.text;
    });

  await openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Write a 1 sentence tiktok caption from a transcript. Write like a native english speaker. Then add relevant hashtags. Hashtags must be in lowercase. Add the hashtag #degreefree, #college, #collegetips, #jobs, #jobsearch, #jobhunt, #jobhunting. The transcript is: "${generatedText}". `,
        },
      ],
    })
    .then((result) => {
      generatedCaption = result.data.choices[0].message.content;
    });

  await openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `WWrite a youtube shorts title about ${generatedText}. Make it only 5 words. Don't include other message as this is for a web app.${generatedText}`,
        },
      ],
    })
    .then((result) => {
      generatedTitle = result.data.choices[0].message.content;
    });
  return (result = [generatedTitle, generatedCaption]);
}

router.get("/", (req, res) => {
  res.sendFile(path.join(___dirname, "../public", "index.html"));
});

router.post("/", upload.any("file"), async (req, res) => {
  const audio_file = req.files[0];
  const response = await transcribe(audio_file);
  res.json({ caption: response });
});

export default router;
