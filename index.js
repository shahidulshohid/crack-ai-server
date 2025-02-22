require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { default: axios } = require("axios");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

app.get("/rumor-detector", async (req, res) => {
  const prompt = req.query?.prompt;
  if (!prompt) {
    res.send({ message: "please provide a prompt in query" });
    return;
  }
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [
          {
            text: "When i give any text. You have to tell me the rumor percentage of the text",
          },
        ],
      },
      {
        role: "model",
        parts: [{ text: "Ok, tell me" }],
      },
      {
        role: "user",
        parts: [
          {
            text: "Bangladesh is secretly building a floating city in the bay of bangla powered entirely by solar energy amd ai driven technology",
          },
        ],
      },
      {
        role: "model",
        parts: [{ text: "Rumor percentage is 99%" }],
      },
      {
        role: "user",
        parts: [{ text: "human can fly" }],
      },
      {
        role: "model",
        parts: [{ text: "Rumor percentage is 100%" }],
      },
      {
        role: "user",
        parts: [{ text: "human eat rock" }],
      },
      {
        role: "model",
        parts: [{ text: "Rumor percentage is 100%" }],
      },
    ],
  });
  let result = await chat.sendMessage(prompt);
  const answer = result.response.text();
  res.send({ rumorStatus: answer });
});

app.get("/test-ai", async (req, res) => {
  const prompt = req.query?.prompt;
  if (!prompt) {
    res.send({ message: "please provide a prompt in query" });
    return;
  }
  const result = await model.generateContent(prompt);
  console.log(result.response.text());
  res.send(result.response.text());
});

app.get("/generate-json", async (req, res) => {
  const prompt = req.query?.prompt;
  if (!prompt) {
    res.send({ message: "please provide a prompt in query" });
    return;
  }
  const finalPrompt = `generate some data from this prompt ${prompt}  using this JSON schema:
 data = {'datatype': output}
Return: Array<Recipe>`;
  const result = await model.generateContent(finalPrompt);
  const output = result.response.text().slice(7, -4);
  const jsonData = JSON.parse(output);
  res.send(jsonData);
});

app.get('/gen', async (req, res) => {
  const prompt = req.query?.prompt;
  if (!prompt) {
    res.send({ message: "please provide a prompt in query" });
    return;
  }
  const response = await axios.get(prompt, {responseType: 'arraybuffer'})
  console.log(response)
res.send({message: 'shahidulislamshohid'})
})



app.get("/", (req, res) => {
  res.send({ message: "crack the power of ai" });
});

app.listen(port, () => console.log("server is running on PORT", port));
