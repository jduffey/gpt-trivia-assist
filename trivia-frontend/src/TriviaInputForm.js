import React from 'react';

const TriviaInputForm = ({ categoriesInput, setCategoriesInput, numQuestions, setNumQuestions, onSubmit }) => {
    return (
        <form onSubmit={onSubmit}>
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
    );
};

export default TriviaInputForm;
