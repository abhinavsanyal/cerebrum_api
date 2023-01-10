const express = require("express");
const openai = require("../middlewares/openai");

let app = express.Router();

app.post("/logomaker", async (req, res, next) => {
  try {
    let { content } = req.body;

    // let prompt = `Create a logo using the following guide:\n###\n` +

    // ``

    let prompt = "";

    let inputRaw = `${content}`;
    prompt += inputRaw;
    console.log("image prompt", prompt);
    const gptResponse = await openai.createImage({
      prompt,
      n: 1,
      size: "1024x1024",
    });
    const image_url = gptResponse.data.data[0].url;
    console.log("gptResponse", image_url);

    // const gptResponse = await openai.createCompletion({
    // 	engine: 'curie',
    // 	prompt,
    // 	maxTokens: 150,
    // 	temperature: 0.2,
    // 	topP: 1,
    // 	frequencyPenalty: 1,
    // 	presencePenalty: 0,
    // 	bestOf: 1,
    // 	n: 1,
    // 	user: req.user._id,
    // 	stream: false,
    // 	stop: ["###", "<|endoftext|>", ],
    // });

    let output = image_url;

    // remove the first character from output
    // output = output.substring(1, output.length)

    // If the output string ends with one or more hashtags, remove all of them
    // if (output.endsWith('"')) {
    // 	output = output.substring(0, output.length - 1)
    // }

    // If the output string ends with one or more hashtags, remove all of them
    // if (output.endsWith('"')) {
    // 	output = output.substring(0, output.length - 1)
    // }

    // remove a single new line at the end of output if there is one
    // if (output.endsWith('\n')) {
    // 	output = output.substring(0, output.length - 1)
    // }

    req.locals.input = prompt;
    req.locals.inputRaw = inputRaw;
    req.locals.output = output;
    req.locals.outputType = "image";

    next();
  } catch (err) {
    console.log(err.response);
    console.log(err.data);
    console.log(err.message);
  }
});

module.exports = app;
