import React, { useState, useEffect } from 'react';

const TriviaInputForm = ({
    categoryInput,
    setCategoryInput,
    numQuestions,
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
            <label htmlFor="categoryInput" className="category-label">Category:</label>
            <input
                id="categoryInput"
                type="text"
                placeholder="Category"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                className="category-input"
            />
            <button type="submit" className="generate-btn">{`Generate ${numQuestions} Questions`}</button>
            {timerActive && !dataLoaded && <p className="elapsed-time">Elapsed time: {elapsedSeconds} seconds</p>}
        </form>
    );
};

export default TriviaInputForm;
