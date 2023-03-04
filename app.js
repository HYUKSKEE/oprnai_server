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
app.get("/ping", (req, res, next) => {
  res.json({ message: "pong" });
});
const server = http.createServer(app);
const PORT = process.env.PORT;

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  organization: process.env.ORG_ID,
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);
const openAI = async () => {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: "너는 누구야" }],
  });
  console.log("이게 찍힌거임?", completion.data.choices[0].message);
};

const start = async () => {
  try {
    server.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
  } catch (err) {
    console.error(err);
  }
};

start();
