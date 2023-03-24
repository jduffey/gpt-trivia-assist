const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

const generateTriviaQuestions = async (category) => {
    const prompt = `Generate 30 trivia questions and answers in the category "${category}" using the following format: \nQ: [Question]\nA: [Answer]\n`;

    const data = {
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 1000,
    };

    try {
        const response = await openai.createCompletion(data);
        const text = response.data.choices[0].text.trim();

        // Process the returned text to extract questions and answers
        const rawQuestions = text.split('\n').filter(line => line.length > 0);
        const questions = [];

        for (let i = 0; i < rawQuestions.length; i += 2) {
            if (rawQuestions[i + 1]) {
                questions.push({
                    question: rawQuestions[i].substring(3),
                    answer: rawQuestions[i + 1].substring(3)
                });
            }
        }

        return questions;
    } catch (error) {
        console.error(`Error querying ChatGPT API: ${error}`);
    }
};

module.exports = {
    generateTriviaQuestions
};
