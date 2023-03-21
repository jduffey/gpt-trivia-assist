import React, { useState } from 'react';
import axios from 'axios';

import EditableQuestionAnswerPair from './EditableQuestionAnswerPair';

const TriviaGenerator = () => {
    const [numQuestions, setNumQuestions] = useState('');
    const [questions, setQuestions] = useState([]);
    const [editedQuestion, setEditedQuestion] = useState('');
    const [editedAnswer, setEditedAnswer] = useState('');
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    const [error, setError] = useState('');
    const [categoriesInput, setCategoriesInput] = useState('');
    const [questionsByCategory, setQuestionsByCategory] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setQuestionsByCategory([]);

        const categories = categoriesInput.split(',').map((cat) => cat.trim());

        try {
            const questionsPromises = categories.map((category) =>
                axios.post('/generate', { category, numQuestions }),
            );

            const responseList = await Promise.all(questionsPromises);

            const newQuestionsByCategory = responseList.map((response, index) => ({
                category: categories[index],
                questions: response.data,
            }));

            setQuestionsByCategory(newQuestionsByCategory);
        } catch (err) {
            setError('Error generating trivia questions');
        }
    };

    const handleAdd = () => {
        setQuestions([...questions, { question: newQuestion, answer: newAnswer }]);
        setNewQuestion('');
        setNewAnswer('');
    };

    const handleSave = async () => {
        try {
            const categoryNames = questionsByCategory.map((q) => q.category);
            await axios.post('/save', { categoryNames, questionsByCategory });
            alert('Trivia questions saved successfully on the server.');
        } catch (err) {
            setError('Error saving trivia questions on the server');
        }
    };

    const updateQuestion = (category, questionIndex, newQuestionValue) => {
        setQuestionsByCategory((prevState) => {
            const updatedQuestionsByCategory = [...prevState];
            const categoryIndex = updatedQuestionsByCategory.findIndex(
                (item) => item.category === category
            );
            updatedQuestionsByCategory[categoryIndex].questions[
                questionIndex
            ].question = newQuestionValue;
            return updatedQuestionsByCategory;
        });
    };

    const updateAnswer = (category, questionIndex, newAnswerValue) => {
        setQuestionsByCategory((prevState) => {
            const updatedQuestionsByCategory = [...prevState];
            const categoryIndex = updatedQuestionsByCategory.findIndex(
                (item) => item.category === category
            );
            updatedQuestionsByCategory[categoryIndex].questions[
                questionIndex
            ].answer = newAnswerValue;
            return updatedQuestionsByCategory;
        });
    };

    return (
        <div>
            <h1>Trivia Generator</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="categoriesInput">Categories (comma-separated):</label>
                <input
                    id="categoriesInput"
                    type="text"
                    placeholder="Categories"
                    value={categoriesInput}
                    onChange={(e) => setCategoriesInput(e.target.value)}
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
                {
                    questionsByCategory.map((categoryObj) => (
                        <div key={categoryObj.category}>
                            <h2>{categoryObj.category}</h2>
                            {categoryObj.questions.map((questionObj, index) => (
                                <EditableQuestionAnswerPair
                                    key={index}
                                    index={index}
                                    question={questionObj.question}
                                    answer={questionObj.answer}
                                    onQuestionChange={(index, value) =>
                                        updateQuestion(categoryObj.category, index, value)
                                    }
                                    onAnswerChange={(index, value) =>
                                        updateAnswer(categoryObj.category, index, value)
                                    }
                                />
                            ))}
                        </div>
                    ))
                }
            </div>
            <div>
                <h2>Add New Question</h2>
                <p>
                    <strong>Question: </strong>
                    <input
                        type="text"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                    />
                </p>
                <p>
                    <strong>Answer: </strong>
                    <input
                        type="text"
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                    />
                </p>
                <button onClick={handleAdd}>Add</button>
            </div>
            <div>
                <button onClick={handleSave}>Save TXT</button>
            </div>
        </div>
    );
};

export default TriviaGenerator;
