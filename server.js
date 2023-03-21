const express = require('express');
const fs = require('fs');
const path = require('path');
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

app.post('/save', (req, res) => {
    const questions = req.body;
    const data = JSON.stringify(questions);
    const filePath = path.join(__dirname, 'trivia_questions.json');

    fs.writeFile(filePath, data, (err) => {
        if (err) {
            console.error(`Error saving trivia questions: ${err}`);
            res.status(500).json({ message: 'Server error' });
        } else {
            res.status(200).json({ message: 'Trivia questions saved successfully' });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
