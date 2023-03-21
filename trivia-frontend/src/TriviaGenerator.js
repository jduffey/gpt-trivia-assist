import React, { useState } from 'react';
import axios from 'axios';

const TriviaGenerator = () => {
    const [category, setCategory] = useState('');
    const [numQuestions, setNumQuestions] = useState('');
    const [questions, setQuestions] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedQuestion, setEditedQuestion] = useState('');
    const [editedAnswer, setEditedAnswer] = useState('');
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    const [error, setError] = useState('');

    const [categoriesInput, setCategoriesInput] = useState('');
    // const [numQuestions, setNumQuestions] = useState('');
    const [questionsByCategory, setQuestionsByCategory] = useState([]);
    // const [error, setError] = useState('');

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

    const handleEdit = (index) => {
        setEditingIndex(index);
        setEditedQuestion(questions[index].question);
        setEditedAnswer(questions[index].answer);
    };

    const handleSave = (index) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = { question: editedQuestion, answer: editedAnswer };
        setQuestions(updatedQuestions);
        setEditingIndex(null);
    };

    const handleDelete = (index) => {
        const updatedQuestions = questions.filter((_, i) => i !== index);
        setQuestions(updatedQuestions);
    };

    const handleAdd = () => {
        setQuestions([...questions, { question: newQuestion, answer: newAnswer }]);
        setNewQuestion('');
        setNewAnswer('');
    };

    const handleExport = async () => {
        try {
            const categoryNames = questionsByCategory.map((q) => q.category);
            await axios.post('/save', { categoryNames, questionsByCategory });
            alert('Trivia questions saved successfully on the server.');
        } catch (err) {
            setError('Error saving trivia questions on the server');
        }
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
                {questionsByCategory.map((categoryQuestions, catIndex) => (
                    <div key={catIndex}>
                        <h2>{categoryQuestions.category}</h2>
                        {categoryQuestions.questions.map((q, index) => (
                            <div key={index} className="question">
                                {editingIndex === index ? (
                                    <>
                                        <p>
                                            <strong>Question: </strong>
                                            <input
                                                type="text"
                                                value={editedQuestion}
                                                onChange={(e) => setEditedQuestion(e.target.value)}
                                            />
                                        </p>
                                        <p>
                                            <strong>Answer: </strong>
                                            <input
                                                type="text"
                                                value={editedAnswer}
                                                onChange={(e) => setEditedAnswer(e.target.value)}
                                            />
                                        </p>
                                        <button onClick={() => handleSave(index)}>Save</button>
                                    </>
                                ) : (
                                    <>
                                        <p>
                                            <strong>Question: </strong>
                                            {q.question}
                                        </p>
                                        <p>
                                            <strong>Answer: </strong>
                                            {q.answer}
                                        </p>
                                        <button onClick={() => handleEdit(index)}>Edit</button>
                                    </>
                                )}
                                <button onClick={() => handleDelete(index)}>Delete</button>
                            </div>
                        ))}
                    </div>
                ))}
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
                <button onClick={handleExport}>Export JSON</button>
            </div>
        </div>
    );
};

export default TriviaGenerator;
