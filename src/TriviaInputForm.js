import React, { useState, useEffect } from 'react';
import {
    Button,
    FormControl,
    FormControlLabel,
    LinearProgress,
    Radio,
    RadioGroup,
    TextField
} from '@mui/material';

const TriviaInputForm = ({
    categoryType,
    setCategoryType,
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
        if (categoryInput === '') {
            alert('Please enter a category');
            return;
        };
        e.preventDefault();
        setElapsedSeconds(0);
        if (categoryType === 'T') {
            setTimerActive(true)
        };
        onSubmit(e);
    };

    return (
        <form onSubmit={handleSubmit} className="trivia-form">
            <FormControl component="fieldset">
                <RadioGroup
                    row
                    aria-label="position"
                    name="position"
                    value={categoryType}
                    onChange={(event) => setCategoryType(event.target.value)}
                >
                    <FormControlLabel value="T" control={<Radio color="primary" />} label="Text" />
                    <FormControlLabel value="P" control={<Radio color="primary" />} label="Image" />
                    <FormControlLabel value="S" control={<Radio color="primary" />} label="Audio" />
                </RadioGroup>
            </FormControl>
            <TextField
                id="categoryInput"
                label="Category"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
            />
            <TextField
                id="numQuestions-input"
                disabled={categoryType !== 'T'}
                label="# Q's"
                type="number"
                inputProps={{ min: "1" }}
                value={categoryType === 'T' ? numQuestions : 5}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="num-questions-input"
            />
            <Button
                variant="contained"
                type="submit"
            >
                {categoryType === 'T' ?
                    `Generate ${numQuestions} Questions`
                    : 'Create 5 Blank Pairs'}
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
