const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

const generateTriviaQuestions = async (category, numQuestions) => {
    const prompt = `Generate ${numQuestions} trivia questions and answers in the category "${category}" using the following format: \nQ: [Question]\nA: [Answer]\n`;

    const data = {
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 1000,
    };

    console.log('Querying ChatGPT API with the following params:');
    console.log(data);

    try {
        const response = await openai.createCompletion(data);
        const text = response.data.choices[0].text.trim();
        console.log('Parsed response from ChatGPT API:');
        console.log(text);

        // Process the returned text to extract questions and answers
        const rawQuestions = text.split('\n').filter(line => line.length > 0);
        const qaPairs = [];

        for (let i = 0; i < rawQuestions.length; i += 2) {
            if (rawQuestions[i + 1]) {
                qaPairs.push({
                    question: rawQuestions[i].substring(3),
                    answer: rawQuestions[i + 1].substring(3)
                });
            }
        }

        console.log('Parsed questions and answers:');
        console.log(qaPairs);
        return qaPairs;
    } catch (error) {
        console.error(`Error querying ChatGPT API: ${error}`);
    }
};

module.exports = {
    generateTriviaQuestions
};
