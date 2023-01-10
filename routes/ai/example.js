
const express = require('express');
const openai = require('../middlewares/openai');

let app = express.Router()

app.post('/example', async (req, res, next) => {
	try {
		let { content } = req.body
  
	let prompt = `This is a Chatbot that Answer questions from a user:\n`

	let inputRaw = `${content}` // here is where people enter stuff
	prompt += inputRaw

	const gptResponse = await openai.createCompletion({
		model: "text-curie-003",
		prompt,
		max_tokens: 150,
		temperature: 0.2,
		top_p: 1,
		frequency_penalty: 1,
		presence_penalty: 0,
		best_of: 1,
		n: 1,
		user: req.user._id,
		stream: false,
		stop: ["###", "<|endoftext|>", ],
	});

	let output = `${gptResponse.data.choices[0].text}`

	// remove the first character from output
	output = output.substring(1, output.length)

	// If the output string ends with one or more hashtags, remove all of them
	if (output.endsWith('"')) {
		output = output.substring(0, output.length - 1)
	}

	// If the output string ends with one or more hashtags, remove all of them
	if (output.endsWith('"')) {
		output = output.substring(0, output.length - 1)
	}

	// remove a single new line at the end of output if there is one
	if (output.endsWith('\n')) {
		output = output.substring(0, output.length - 1)
	}

	req.locals.input = prompt
	req.locals.inputRaw = inputRaw
	req.locals.output = output

	next()

	} catch (err){
		console.log(err.response)
		console.log(err.data)
		console.log(err.message)
	}
	
  })

module.exports = app