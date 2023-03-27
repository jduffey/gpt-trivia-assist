import React, { useState } from 'react';
import axios from 'axios';

import { Button, Container } from '@mui/material';

import EditableQuestionAnswerPair from './EditableQuestionAnswerPair';
import TriviaInputForm from './TriviaInputForm';

const DEFAULT_NUM_QUESTIONS = 7;

const TriviaGenerator = () => {
    const [error, setError] = useState('');
    const [categoryInput, setCategoryInput] = useState('');
    const [questionsByCategory, setQuestionsByCategory] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [numQuestions, setNumQuestions] = useState(DEFAULT_NUM_QUESTIONS);

    const handleSubmit = async (e) => {
        setDataLoaded(false);
        e.preventDefault();
        setError('');
        setQuestionsByCategory([]);

        try {
            const response = await axios.post('/generate', { categoryInput, numQuestions: numQuestions });

            const newQuestionsByCategory = [{
                category: categoryInput,
                questions: response.data,
            }];

            setQuestionsByCategory(newQuestionsByCategory);
            setDataLoaded(true);
        } catch (err) {
            setError('Error generating trivia questions');
        }
    };

    const handleSave = async () => {
        const atLeastOneQuestionHasDifficulty = questionsByCategory.some((q) => {
            return q.questions.some((qaPair) => typeof qaPair.difficulty !== "undefined");
        });

        if (!atLeastOneQuestionHasDifficulty) {
            alert('Please assign difficulty to at least one question before saving.');
            return;
        }

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
            return prevState.map((categoryObj) => {
                if (categoryObj.category === category) {
                    return {
                        ...categoryObj,
                        questions: categoryObj.questions.map((question, index) => {
                            if (index === questionIndex) {
                                return {
                                    ...question,
                                    difficulty:
                                        question.difficulty === newDifficultyValue ? undefined : newDifficultyValue,
                                };
                            }
                            return question;
                        }),
                    };
                }
                return categoryObj;
            });
        });
    };


    return (
        <Container
            sx={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '20px',
                backgroundColor: '#f0f0f0',
                borderRadius: '10px',
                boxShadow: '4px 4px 5px rgba(0, 0, 0, 0.5)'
            }}
        >
            <h1 className="main-title">Trivia Generator</h1>
            <TriviaInputForm
                className="input-form"
                categoryInput={categoryInput}
                setCategoryInput={setCategoryInput}
                numQuestions={numQuestions}
                setNumQuestions={setNumQuestions}
                onSubmit={handleSubmit}
                dataLoaded={dataLoaded}
            />
            {error && <p className="error-message">{error}</p>}
            <div className="questions-container">
                {
                    questionsByCategory.map((categoryObj) => (
                        <div key={categoryObj.category} className="category">
                            <h2 className="category-title">{categoryObj.category}</h2>
                            {categoryObj.questions.map((questionObj, index) => (
                                <EditableQuestionAnswerPair
                                    key={index}
                                    index={index}
                                    className="editable-pair"
                                    question={questionObj.question}
                                    answer={questionObj.answer}
                                    difficulty={questionObj.difficulty}
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
            </div>
            <Button
                onClick={handleSave}
                sx={{
                    backgroundColor: '#27ae60',
                    color: '#ffffff',
                    padding: '10px 40px',
                    border: 'solid 8px #179e50',
                    borderRadius: '16px',
                    fontSize: '20px',
                    transition: 'background-color 0.1s',
                    '&:hover': {
                        backgroundColor: '#2ecc71',
                    }
                }}
            >
                Save TXT
            </Button>
        </Container>
    );
};

export default TriviaGenerator;
