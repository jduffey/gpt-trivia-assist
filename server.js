const express = require('express');
const { generateTriviaQuestions } = require('./generateTriviaQuestions');

const app = express();
app.use(express.json());

app.post('/generate', async (req, res) => {
    const { category, numQuestions } = req.body;
    try {
        const questions = await generateTriviaQuestions(category, numQuestions);
        res.status(200).json(questions);
    } catch (error) {
        console.error(`Error generating trivia questions: ${error}`);
        res.status(500).json({ message: 'Server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
