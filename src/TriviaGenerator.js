import React, { useState } from 'react';
import { useCollapse } from 'react-collapsed';
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
    const [collapsed, setCollapsed] = useState({});

    const handleSubmit = async (e) => {
        setDataLoaded(false);
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('/generate', { categoryInput, numQuestions: numQuestions });

            setQuestionsByCategory((prevState) => {
                [...prevState].map((categoryObj) => {
                    categoryObj.questions = categoryObj.questions.filter(
                        (question) => typeof question.difficulty !== "undefined"
                    );
                    return categoryObj;
                });

                return [
                    ...prevState,
                    {
                        category: categoryInput,
                        questions: response.data,
                    },
                ];
            });

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

    const updateDifficulty = (category, questionIndex, requestedNewDifficultyValue) => {
        setQuestionsByCategory(
            (prevState) => {
                return prevState.map((categoryObj) => {
                    if (categoryObj.category === category) {
                        console.log(categoryObj);
                        const numEasy = categoryObj.questions.filter(
                            (question) => question.difficulty === 0
                        ).length;
                        const numMedium = categoryObj.questions.filter(
                            (question) => question.difficulty === 1
                        ).length;
                        const numDifficult = categoryObj.questions.filter(
                            (question) => question.difficulty === 2
                        ).length;

                        return {
                            ...categoryObj,
                            questions: categoryObj.questions.map((question, index) => {
                                if (index === questionIndex) {
                                    let actualNewDifficultyValue = requestedNewDifficultyValue;

                                    if (question.difficulty === requestedNewDifficultyValue) {
                                        actualNewDifficultyValue = undefined;
                                    } else if (
                                        (requestedNewDifficultyValue === 0 && numEasy >= 2) ||
                                        (requestedNewDifficultyValue === 1 && numMedium >= 2) ||
                                        (requestedNewDifficultyValue === 2 && numDifficult >= 1)
                                    ) {
                                        alert('You have reached the maximum number of allowed difficulty values for this level.');
                                        actualNewDifficultyValue = question.difficulty;
                                    }

                                    return {
                                        ...question,
                                        difficulty: actualNewDifficultyValue,
                                    };
                                }
                                return question;
                            }),
                        };

                    }
                    return categoryObj;
                });
            }
        );
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
            {questionsByCategory.map((categoryObj, i) => (
                <div class="categoryTitle" key={i}>
                    <h3 onClick={() => setCollapsed({ ...collapsed, [categoryObj.category]: !collapsed[categoryObj.category] })}>
                        {categoryObj.category} {collapsed[categoryObj.category] ? "+" : "-"}
                    </h3>
                    <div class="finishedCat">
                    {!collapsed[categoryObj.category] && categoryObj.questions.map((qaPair, j) => (
                        <EditableQuestionAnswerPair
                            key={j}
                            category={categoryObj.category}
                            index={j}
                            question={qaPair.question}
                            answer={qaPair.answer}
                            difficulty={qaPair.difficulty}
                            onQuestionChange={(index, value) => updateQuestion(categoryObj.category, index, value)}
                            onAnswerChange={(index, value) => updateAnswer(categoryObj.category, index, value)}
                            setDifficulty={(index, diffiRank) => updateDifficulty(categoryObj.category, index, diffiRank)}
                        />
                    ))}
                    </div>
                </div>
            ))}
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
