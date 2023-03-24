import React from 'react';

const EditableQuestionAnswerPair = ({ question, answer, index, onQuestionChange, onAnswerChange, setDifficulty }) => {
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
                onClick={() => setDifficulty(index, 'easy')}
            >
                Easy
            </button>
            <button
                id="save-med"
                onClick={() => setDifficulty(index, 'medium')}
            >
                Medium
            </button>
            <button
                id="save-difficult"
                onClick={() => setDifficulty(index, 'difficult')}
            >
                Difficult
            </button>
        </div>
    );
};

export default EditableQuestionAnswerPair;
