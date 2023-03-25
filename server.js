const express = require('express');
const fs = require('fs');
const path = require('path');
const { generateTriviaQuestions } = require('./generateTriviaQuestions');
const { convertAndSave } = require('./convertAndSave');

const app = express();
app.use(express.json());

app.post('/generate', async (req, res) => {
    console.log(req.body);
    const { categoryInput, numQuestions } = req.body;
    try {
        const questions = await generateTriviaQuestions(categoryInput, numQuestions);
        res.status(200).json(questions);
    } catch (error) {
        console.error(`Error generating trivia questions: ${error}`);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/save', async (req, res) => {
    const { categoryNames, questionsByCategory } = req.body;
    const fileName = categoryNames.join('_') + '.txt';

    try {
        await convertAndSave(questionsByCategory, fileName);
        res.status(200).json({ message: 'Trivia questions saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
