const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

const buildPrompt = (category, numQuestions) => {
    return `Generate ${numQuestions} trivia questions and answers in the category "${category}" using the following format: \nQ: [Question]\nA: [Answer]\n`;
};

const formatApiResponse = response => {
    return response.data.choices[0].text.trim();
};

const parseQaPairs = rawQuestions => {
    return rawQuestions
        .filter((_, index) => index % 2 === 0)
        .map((question, index) => ({
            question: question.substring(3),
            answer: rawQuestions[index * 2 + 1].substring(3)
        }));
};

const getApiCall = async (data, numQuestions) => {
    if (process.argv.includes('--mockApi')) {
        console.log(`\
👷‍♂️👷‍♂️------------------👷‍♂️👷‍♂️------------------👷‍♂️👷‍♂️
             You are in DEV mode!
          API calls will be mocked.
👷‍♂️👷‍♂️------------------👷‍♂️👷‍♂️------------------👷‍♂️👷‍♂️`);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: {
                        choices: [
                            {
                                text: 'Q: Am I running in dev mode using mocked API calls?\nA: Yes, I am.\n'.repeat(numQuestions)
                            }
                        ]
                    }
                });
            }, 1000);
        });
    } else {
        return await openai.createCompletion(data);
    }
};

const generateTriviaQuestions = async (category, numQuestions) => {
    try {
        const prompt = buildPrompt(category, numQuestions);
        const data = {
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 1000,
        };

        console.log('🟢 Querying ChatGPT API with the following params: 🟢');
        console.log(data);

        const response = await getApiCall(data, numQuestions);
        console.log('🟢 Response (response.data) from ChatGPT API: 🟢');
        console.log(response.data);
        const text = formatApiResponse(response);

        const rawQuestions = text.split('\n').filter(line => line.length > 0);
        const qaPairs = parseQaPairs(rawQuestions);

        console.log('🟢 Parsed questions and answers: 🟢');
        console.log(qaPairs);
        return qaPairs;
    } catch (error) {
        console.error(`🔴 Error querying ChatGPT API: ${error} 🔴`);
        throw error;
    }
};

module.exports = {
    generateTriviaQuestions
};
