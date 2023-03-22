const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

const server = http.createServer(app);
const PORT = process.env.PORT;

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  organization: process.env.ORG_ID,
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

const openAI = async (req) => {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    prompt: [{ content: req }],
    temperature: 0.9,
    max_tokens: 521,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0.6,
    stop: [" Human:", " AI:"],
  });

  console.log("message : ", completion.data.choices[0].message.content);
  return completion.data.choices[0].message.content;
};

app.post("/", async (req, res) => {
  const response = await openAI(req.body.message);

  res.json({ message: response });
});

const start = async () => {
  try {
    server.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
  } catch (err) {
    console.error(err);
  }
};

start();
