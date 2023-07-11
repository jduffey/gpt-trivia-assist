# Trivia Harvest

A React- and Express-based app that uses the OpenAI API to generate trivia questions and answers from a given category, lets the user edit or modify them, then saves the file in a custom format.

## Setup

Create an environment variable for your OpenAI API key:

- `OPENAI_API_KEY=<OpenAI API key>`

Then:

- `npm install` to install dependencies
- `npm start` to start both Express server and React front-end

## Usage

- Select category type (i.e. Text, Image, or Audio)
- Input trivia category and number of questions to generate
- For Text category type:
   - Call is made to OpenAI API to generate questions and answers
   - Edit the question and/or answer
- For Image or Audio category type:
   - Five blank pairs are returned
   - Input file path (or use file manager to select file)
- For all question/answer pairs, select 2 Easy, 2 Medium, and 1 Difficult before generating the next category
- When finished, click "Save" to save the file in a custom format to the `output` folder

## Other / Notes
- To run the app in development mode, use `npm run dev`. The response from the OpenAI API will be mocked.