import React from 'react';

const TriviaInputForm = ({ categoryInput, setCategoryInput, onSubmit }) => {
    return (
        <form onSubmit={onSubmit}>
            <label htmlFor="categoryInput">Category:</label>
            <input
                id="categoryInput"
                type="text"
                placeholder="Category"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
            />
            <br />
            <button type="submit">Generate 30 Questions</button>
        </form>
    );
};

export default TriviaInputForm;
