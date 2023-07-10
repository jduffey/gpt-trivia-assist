import React, { useState } from 'react';
import {
    Avatar,
    Button,
    ButtonGroup,
    Checkbox,
    Dialog,
    DialogContent,
    FormControl,
    FormControlLabel,
    Grid,
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
    folderNameInput,
    categoryName,
    categoryType,
    question,
    answer,
    difficulty,
    isDD,
    index,
    onQuestionChange,
    onAnswerChange,
    setDifficulty,
    setDailyDouble,
    setQuestionType,
}) => {
    const [isChecked, setIsChecked] = useState(false);
    const [imageAvatar, setImageAvatar] = useState(null);
    const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
        setDailyDouble(index, !isChecked);
    }

    const sendImageToServer = (file) => {
        const formData = new FormData();
        formData.append('imageFile', file);
        const fileType = 'image';
        fetch(`/copy-image?fileType=${fileType}&categoryName=${categoryName}`, {
            method: 'POST',
            body: formData,
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        }).catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    };

    const sendAudioToServer = (file) => {
        const formData = new FormData();
        formData.append('audioFile', file);
        const fileType = 'audio';
        fetch(`/copy-audio?fileType=${fileType}&categoryName=${categoryName}`, {
            method: 'POST',
            body: formData,
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        }).catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    };

    const handleImageUploadClick = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = (event) => {
            const file = event.target.files[0];
            const fileName = file.name;
            const questionFieldText = `J:\\${folderNameInput}\\${categoryName}\\${fileName}`;
            onQuestionChange(index, questionFieldText);

            const fileNameWithoutExtension = fileName.split('.')[0];
            onAnswerChange(index, fileNameWithoutExtension);

            const fileURL = URL.createObjectURL(file);
            setImageAvatar(fileURL);

            sendImageToServer(file);
        };

        input.click();
    };

    const handleAudioUploadClick = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "audio/*";

        input.onchange = (event) => {
            const file = event.target.files[0];
            const fileName = file.name;
            const questionFieldText = `J:\\${folderNameInput}\\${categoryName}\\${fileName}`;
            onQuestionChange(index, questionFieldText);

            const fileNameWithoutExtension = fileName.split('.')[0];
            onAnswerChange(index, fileNameWithoutExtension);

            sendAudioToServer(file);
        };

        input.click();
    };

    const addMediaButtonEnabled = ['P', 'S'].includes(categoryType);

    return (
        <div className="question-answer-pair">
            <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Grid item xs={imageAvatar ? 10 : 12} pr={2}>
                    <TextField
                        id={`question-${index}`}
                        value={question}
                        onChange={(event) => onQuestionChange(index, event.target.value)}
                        label="Question"
                        className="question-textarea"
                        variant="outlined"
                        multiline
                        fullWidth
                    />
                </Grid>
                {imageAvatar && (
                    <Button onClick={() => setIsImagePreviewOpen(true)}>
                        <Avatar src={imageAvatar} sx={{ width: 56, height: 56, borderRadius: '0%' }} />
                    </Button>
                )}
                <Dialog open={isImagePreviewOpen} onClose={() => setIsImagePreviewOpen(false)}>
                    <DialogContent>
                        <img src={imageAvatar} alt="" style={{ width: '100%', height: '100%' }} />
                    </DialogContent>
                </Dialog>
            </Grid>
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
            <Button
                disabled={!addMediaButtonEnabled}
                sx={addMediaButtonEnabled
                    ? {
                        backgroundColor: '#3f51b5',
                        color: '#ffffff',
                        '&:hover': {
                            backgroundColor: 'pink',
                            transition: '0s',
                        }
                    }
                    : {
                        backgroundColor: '#eaeaea',
                    }}
                onClick={{
                    'P': handleImageUploadClick,
                    'S': handleAudioUploadClick,
                }[categoryType]}
            >
                {addMediaButtonEnabled
                    ? "Add"
                    : <s>Add</s>
                }
            </Button>
            <FormControl component="fieldset">
                <RadioGroup
                    row
                    aria-label="position"
                    name="position"
                    value={categoryType}
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
                        checked={isDD}
                        onChange={handleCheckboxChange}
                    />
                }
                label="Daily Double?"
            />
        </div>
    );
};

export default EditableQuestionAnswerPair;
