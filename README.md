Create environment variable:
- `OPENAI_API_KEY=<OpenAI API key>`

Then:

- `npm install` to install dependencies
- `npm start` to start both server and React front-end
- Input trivia category and number of questions to generate
- When candidate question/answer pairs are returned:
  - (Optional) edit the question and/or answer
  - Mark difficulty on at least one question
  - Click 'Save TXT' button and questions will be sorted from easiest to most difficult and then exported to a custom file format in the `./output/` directory
