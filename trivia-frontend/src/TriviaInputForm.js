import React, { useState, useEffect } from 'react';
import { Button, LinearProgress, TextField } from '@mui/material';

const TriviaInputForm = ({
    categoryInput,
    setCategoryInput,
    numQuestions,
    setNumQuestions,
    onSubmit,
    dataLoaded,
}) => {
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [timerActive, setTimerActive] = useState(false);

    useEffect(() => {
        if (timerActive) {
            const timer = setInterval(() => {
                setElapsedSeconds((prevElapsedSeconds) => prevElapsedSeconds + 1);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [timerActive]);

    useEffect(() => {
        if (dataLoaded) {
            setTimerActive(false);
        }
    }, [dataLoaded]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setElapsedSeconds(0);
        setTimerActive(true);
        onSubmit(e);
    };

    return (
        <form onSubmit={handleSubmit} className="trivia-form">
            <TextField
                id="categoryInput"
                label="Category"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                className="category-input"
            />
            <TextField
                id="numQuestions-input"
                label="# Q's"
                type="number"
                inputProps={{ min: "1" }}
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="num-questions-input"
            />
            <Button
                variant="contained"
                type="submit"
            >
                {`Generate ${numQuestions} Questions`}
            </Button>
            {timerActive && !dataLoaded &&
                <p className="elapsed-time">
                    Elapsed time: {elapsedSeconds} seconds
                    <LinearProgress
                        variant='indeterminate'
                        sx={{
                            width: '25%',
                            position: 'absolute',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            margin: '2px 0 0 0',
                        }}
                    />
                </p>
            }
        </form>
    );
};

export default TriviaInputForm;
