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
            <label htmlFor={`question-${index}`} className="question-label">
                Q {index}:
            </label>
            <textarea
                id={`question-${index}`}
                value={question}
                onChange={(event) => onQuestionChange(index, event.target.value)}
                className="question-textarea"
            />
            <label htmlFor={`answer-${index}`} className="answer-label">
                A:
            </label>
            <textarea
                id={`answer-${index}`}
                value={answer}
                onChange={(event) => onAnswerChange(index, event.target.value)}
                className="answer-textarea"
            />
            <div className="difficulty-buttons">
                <button
                    className={`difficulty-btn ${difficulty === 0 ? 'selected-difficulty' : ''}`}
                    id="save-easy"
                    onClick={() => setDifficulty(index, 0)}
                >
                    Easy
                </button>
                <button
                    className={`difficulty-btn ${difficulty === 1 ? 'selected-difficulty' : ''}`}
                    id="save-med"
                    onClick={() => setDifficulty(index, 1)}
                >
                    Medium
                </button>
                <button
                    className={`difficulty-btn ${difficulty === 2 ? 'selected-difficulty' : ''}`}
                    id="save-difficult"
                    onClick={() => setDifficulty(index, 2)}
                >
                    Difficult
                </button>
            </div>
        </div>
    );
};

export default EditableQuestionAnswerPair;
