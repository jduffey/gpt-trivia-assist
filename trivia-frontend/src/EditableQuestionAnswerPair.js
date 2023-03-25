import React from 'react';

const EditableQuestionAnswerPair = ({
    question,
    answer,
    difficulty,
    index,
    onQuestionChange,
    onAnswerChange,
    setDifficulty,
}) => {
    return (
        <div className="question-answer-pair">
            <label htmlFor={`question-${index}`}>Question {index}:</label>
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
                className={difficulty === 0 ? 'selected-difficulty' : ''}
                id="save-easy"
                onClick={() => setDifficulty(index, 0)}
            >
                Easy
            </button>
            <button
                className={difficulty === 1 ? 'selected-difficulty' : ''}
                id="save-med"
                onClick={() => setDifficulty(index, 1)}
            >
                Medium
            </button>
            <button
                className={difficulty === 2 ? 'selected-difficulty' : ''}
                id="save-difficult"
                onClick={() => setDifficulty(index, 2)}
            >
                Difficult
            </button>
        </div>
    );
};

export default EditableQuestionAnswerPair;
