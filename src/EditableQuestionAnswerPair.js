import React, { useState } from 'react';
import {
    Button,
    ButtonGroup,
    Checkbox,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from '@mui/material';

const DIFFICULTY_LEVELS = [
    { value: 0, label: "Easy" },
    { value: 1, label: "Medium" },
    { value: 2, label: "Difficult" },
];

const EditableQuestionAnswerPair = ({
    question,
    answer,
    difficulty,
    index,
    onQuestionChange,
    onAnswerChange,
    setDifficulty,
    setDailyDouble,
    setQuestionType,
}) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
        setDailyDouble(index, !isChecked);
    }

    return (
        <div className="question-answer-pair">
            <TextField
                id={`question-${index}`}
                value={question}
                onChange={(event) => onQuestionChange(index, event.target.value)}
                label="Question"
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
            <Typography variant="body1">Q {index + 1}</Typography>
            <FormControl component="fieldset">
                <RadioGroup
                    row
                    aria-label="position"
                    name="position"
                    defaultValue="T"
                    onChange={(event) => setQuestionType(index, event.target.value)}
                >
                    <FormControlLabel value="T" control={<Radio color="primary" />} label="Text" />
                    <FormControlLabel value="P" control={<Radio color="primary" />} label="Image" />
                    <FormControlLabel value="S" control={<Radio color="primary" />} label="Audio" />
                </RadioGroup>
            </FormControl>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                {DIFFICULTY_LEVELS.map(({ value, label }) => (
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
            </ButtonGroup>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                    />
                }
                label="Daily Double?"
            />
        </div>
    );
};

export default EditableQuestionAnswerPair;
