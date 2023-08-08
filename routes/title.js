import express from "express";
import * as path from "path";
import { Configuration, OpenAIApi } from "openai";
import cors from "cors";
import "dotenv/config";

const router = express.Router();
const configuration = new Configuration({
  apiKey: process.env.REACT_APP_API_URL,
});
const getTitle = async (data) => {
  let generatedTitle = "";
  await openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Write a youtube shorts title about ${data}. Make it only 5 words. Don't include other message as this is for a web app.`,
        },
      ],
    })
    .then((result) => {
      generatedTitle = result.data.choices[0].message.content;
    });
  return generatedTitle;
};

const getDescription = async (data) => {
  let generatedDescription = "";
  await openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Write a 1 sentence tiktok caption about ${data}. Write like a native english speaker. Then add relevant hashtags. Hashtags must be in lowercase. Add the hashtag #degreefree, #college, #collegetips, #jobs, #jobsearch, #jobhunt, #jobhunting.`,
        },
      ],
    })
    .then((result) => {
      generatedDescription = result.data.choices[0].message.content;
    });
  return generatedDescription;
};
const openai = new OpenAIApi(configuration);
router.use(cors());
router.get("/title/:data", async (req, res) => {
  res.json({ title: await getTitle(req.params.data) });
});

router.get("/description/:data", async (req, res) => {
  res.json({ description: await getDescription(req.params.data) });
});
export default router;
