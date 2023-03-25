import React, { useState, useEffect } from 'react';

const TriviaInputForm = ({ categoryInput, setCategoryInput, numQuestions, onSubmit }) => {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        setTimerActive(true);
        onSubmit(e);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="categoryInput">Category:</label>
            <input
                id="categoryInput"
                type="text"
                placeholder="Category"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
            />
            <br />
            <button type="submit">
                {`Generate ${numQuestions} Questions`}
            </button>
            {timerActive && <p>Elapsed time: {elapsedSeconds} seconds</p>}
        </form>
    );
};

export default TriviaInputForm;
