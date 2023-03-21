import React, { useState } from 'react';
import axios from 'axios';

const TriviaGenerator = () => {
    const [category, setCategory] = useState('');
    const [numQuestions, setNumQuestions] = useState('');
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setQuestions([]);

        try {
            const response = await axios.post('/generate', { category, numQuestions });
            setQuestions(response.data);
        } catch (err) {
            setError('Error generating trivia questions');
        }
    };

    return (
        <div>
            <h1>Trivia Generator</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="category">Category:</label>
                <input
                    id="category"
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                <br />
                <label htmlFor="numQuestions">Number of questions:</label>
                <input
                    id="numQuestions"
                    type="number"
                    placeholder="Number of questions"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(e.target.value)}
                />
                <br />
                <button type="submit">Generate</button>
            </form>
            {error && <p>{error}</p>}
            <div className="questions-container">
                {questions.map((q, index) => (
                    <div key={index} className="question">
                        <p>
                            <strong>Question: </strong>
                            {q.question}
                        </p>
                        <p>
                            <strong>Answer: </strong>
                            {q.answer}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TriviaGenerator;
