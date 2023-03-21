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
                <input
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Number of questions"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(e.target.value)}
                />
                <button type="submit">Generate</button>
            </form>
            {error && <p>{error}</p>}
            <ul>
                {questions.map((q, index) => (
                    <li key={index}>
                        <p>
                            <strong>Question: </strong>
                            {q.question}
                        </p>
                        <p>
                            <strong>Answer: </strong>
                            {q.answer}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TriviaGenerator;
