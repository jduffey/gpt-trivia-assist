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
    const difficultyLevels = [
        { value: 0, label: "Easy" },
        { value: 1, label: "Medium" },
        { value: 2, label: "Difficult" },
    ];

    return (
        <div className="question-answer-pair">
            <textarea
                id={`question-${index}`}
                value={question}
                onChange={(event) => onQuestionChange(index, event.target.value)}
                className="question-textarea"
                placeholder={`# ${index}`}
            />
            <textarea
                id={`answer-${index}`}
                value={answer}
                onChange={(event) => onAnswerChange(index, event.target.value)}
                className="answer-textarea"
                placeholder="Answer"
            />
            <div className="difficulty-and-index">
                <span className="question-index">Q {index}</span>
                <div className="difficulty-buttons">
                    {difficultyLevels.map(({ value, label }) => (
                        <button
                            key={value}
                            className={`difficulty-btn ${difficulty === value ? 'selected-difficulty' : ''}`}
                            onClick={() => setDifficulty(index, value)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EditableQuestionAnswerPair;
