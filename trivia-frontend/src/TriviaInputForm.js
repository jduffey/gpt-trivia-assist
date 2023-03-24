import React from 'react';

const TriviaInputForm = ({ categoriesInput, setCategoriesInput, onSubmit }) => {
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
            <button type="submit">Generate 30 Questions</button>
        </form>
    );
};

export default TriviaInputForm;
