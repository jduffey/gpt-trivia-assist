import React from 'react';

const EditableQuestionAnswerPair = ({ question, answer, index, onQuestionChange, onAnswerChange }) => {
    return (
        <div className="question-answer-pair">
            <label htmlFor={`question-${index}`}>Question {index + 1}:</label>
            <textarea
                id={`question-${index}`}
                value={question}
                onChange={(event) => onQuestionChange(index, event.target.value)}
            />
            <label htmlFor={`answer-${index}`}>Answer:</label>
            <textarea
                id={`answer-${index}`}
                value={answer}
                onChange={(event) => onAnswerChange(index, event.target.value)}
            />
            <button
                id="save-easy"
                onClick={() => console.log("You clicked the easy button")}
            >
                Easy
            </button>
            <button
                id="save-med"
                onClick={() => console.log("You clicked the medium button")}
            >
                Medium
            </button>
            <button
                id="save-difficult"
                onClick={() => console.log("You clicked the difficult button")}
            >
                Difficult
            </button>
        </div>
    );
};

export default EditableQuestionAnswerPair;
