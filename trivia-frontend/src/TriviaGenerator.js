import React, { useState } from 'react';
import axios from 'axios';

import EditableQuestionAnswerPair from './EditableQuestionAnswerPair';
import TriviaInputForm from './TriviaInputForm';

const TriviaGenerator = () => {
    const [numQuestions, setNumQuestions] = useState('');
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
            <TriviaInputForm
                categoriesInput={categoriesInput}
                setCategoriesInput={setCategoriesInput}
                numQuestions={numQuestions}
                setNumQuestions={setNumQuestions}
                onSubmit={handleSubmit}
            />
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
                <button onClick={handleSave}>Save TXT</button>
            </div>
        </div>
    );
};

export default TriviaGenerator;
