import React from 'react';
import { Button, ButtonGroup, TextField } from '@mui/material';

const EditableQuestionAnswerPair = ({
    question,
    answer,
    difficulty,
    index,
    onQuestionChange,
    onAnswerChange,
    setDifficulty,
    setDailyDouble,
}) => {
    const difficultyLevels = [
        { value: 0, label: "Easy" },
        { value: 1, label: "Medium" },
        { value: 2, label: "Difficult" },
    ];

    return (
        <div className="question-answer-pair">
            <TextField
                id={`question-${index}`}
                value={question}
                onChange={(event) => onQuestionChange(index, event.target.value)}
                label={`# ${index}`}
                className="question-textarea"
                variant="outlined"
                multiline
            />
            <TextField
                id={`answer-${index}`}
                value={answer}
                onChange={(event) => onAnswerChange(index, event.target.value)}
                label="Answer"
                className="answer-textarea"
                variant="outlined"
                multiline
            />
            <span className="question-index">Q {index}</span>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                {difficultyLevels.map(({ value, label }) => (
                    <Button
                        sx={{
                            backgroundColor: difficulty === value ? '#3f51b5' : '#fff',
                            color: difficulty === value ? '#fff' : '#3f51b5',
                            '&:hover': {
                                backgroundColor: difficulty === value ? 'lightblue' : 'pink',
                                transition: '0s',
                            },
                        }}
                        key={value}
                        onClick={() => setDifficulty(index, value)}
                    >
                        {label}
                    </Button>
                ))}
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={false}
                            onChange={() => setDailyDouble(index, true)}
                        />
                        Daily Double?
                    </label>
                </div>
            </ButtonGroup>
        </div>
    );
};

export default EditableQuestionAnswerPair;
