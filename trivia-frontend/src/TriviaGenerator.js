import React, { useState } from 'react';
import axios from 'axios';

import EditableQuestionAnswerPair from './EditableQuestionAnswerPair';
import TriviaInputForm from './TriviaInputForm';

const NUM_QUESTIONS = 1;

const TriviaGenerator = () => {
    const [error, setError] = useState('');
    const [categoryInput, setCategoryInput] = useState('');
    const [questionsByCategory, setQuestionsByCategory] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setQuestionsByCategory([]);

        try {
            const response = await axios.post('/generate', { categoryInput, NUM_QUESTIONS });

            const newQuestionsByCategory = [{
                category: categoryInput,
                questions: response.data,
            }];

            setQuestionsByCategory(newQuestionsByCategory);
        } catch (err) {
            setError('Error generating trivia questions');
        }
    };

    const handleSave = async () => {
        console.log('Saving trivia questions...');
        try {
            console.log(`React state of questionsByCategory:`)
            console.log(questionsByCategory);
            const categoryNames = questionsByCategory.map((q) => q.category);
            const filteredQuestionsByCategory =
                questionsByCategory.map((q) => {
                    return {
                        category: q.category,
                        questions: q.questions
                            .filter((qaPair) => typeof qaPair.difficulty !== "undefined")
                            .sort((a, b) => a.difficulty - b.difficulty)
                    };
                });
            console.log('Questions filtered and sorted by difficulty:');
            console.log(filteredQuestionsByCategory);
            await axios.post('/save', {
                categoryNames,
                questionsByCategory: filteredQuestionsByCategory
            });
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

    const updateDifficulty = (category, questionIndex, newDifficultyValue) => {
        setQuestionsByCategory((prevState) => {
            const updatedQuestionsByCategory = [...prevState];
            const categoryIndex = updatedQuestionsByCategory.findIndex(
                (item) => item.category === category
            );
            updatedQuestionsByCategory[categoryIndex].questions[
                questionIndex
            ].difficulty = newDifficultyValue;
            return updatedQuestionsByCategory;
        });
    }

    return (
        <div>
            <h1>Trivia Generator</h1>
            <TriviaInputForm
                categoryInput={categoryInput}
                setCategoryInput={setCategoryInput}
                numQuestions={NUM_QUESTIONS}
                onSubmit={handleSubmit}
            />
            {error && <p>{error}</p>}
            <div className="questions-container">
                Q&A's START
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
                                    onQuestionChange={
                                        (index, value) =>
                                            updateQuestion(categoryObj.category, index, value)
                                    }
                                    onAnswerChange={
                                        (index, value) =>
                                            updateAnswer(categoryObj.category, index, value)
                                    }
                                    setDifficulty={
                                        (index, diffiRank) =>
                                            updateDifficulty(categoryObj.category, index, diffiRank)
                                    }
                                />
                            ))}
                        </div>
                    ))
                }
                <br />
                Q&A's END
            </div>
            <div>
                <button onClick={handleSave}>Save TXT</button>
            </div>
        </div>
    );
};

export default TriviaGenerator;
