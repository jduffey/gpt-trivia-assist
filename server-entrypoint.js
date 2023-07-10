const fs = require('fs');
const path = require('path');

const express = require('express');
const multer = require('multer');
const { generateTriviaQuestions } = require('./server-utils/generateTriviaQuestions');
const { convertAndSave } = require('./server-utils/convertAndSave');
const app = express();
const PORT = process.env.PORT || 3000;

const mediaFilesOutputDirPath = path.join(__dirname, 'media-files');
const imagesOutputDirPath = path.join(mediaFilesOutputDirPath, 'images');
const audioOutputDirPath = path.join(mediaFilesOutputDirPath, 'audio');
[
    mediaFilesOutputDirPath,
    imagesOutputDirPath,
    audioOutputDirPath
].forEach(dirPath => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
});

const handleGenerate = async (req, res) => {
    console.log('Request body sent from client:');
    console.log(req.body);
    const { categoryInput, numQuestions } = req.body;

    try {
        const questions = await generateTriviaQuestions(categoryInput, numQuestions);
        res.status(200).json(questions);
    } catch (error) {
        console.error(`Error generating trivia questions: ${error}`);
        res.status(500).json({ message: 'Server error' });
    }
}

const handleSave = async (req, res) => {
    const { categoryNames, questionsByCategory, folderName } = req.body;
    const fileName = categoryNames.join('_') + '.txt';

    try {
        await convertAndSave(questionsByCategory, fileName, folderName);
        res.status(200).json({ message: 'Trivia questions saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const fileType = req.query.fileType;
        const categoryName = req.query.categoryName;
        const fileFolderPath = {
            'image': path.join(imagesOutputDirPath, categoryName),
            'audio': path.join(audioOutputDirPath, categoryName),
        }[fileType];
        if (!fs.existsSync(fileFolderPath)) {
            fs.mkdirSync(fileFolderPath);
        }
        cb(null, fileFolderPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });


app.use(express.json());
app.post('/generate', handleGenerate);
app.post('/save', handleSave);
app.post(
    '/create-image-category-folder',
    (req, res) => {
        const { categoryName } = req.body;
        const categoryFolderPath = path.join(imagesOutputDirPath, categoryName);
        if (!fs.existsSync(categoryFolderPath)) {
            fs.mkdirSync(categoryFolderPath);
        }
        res.status(200).json({ message: 'Category folder created successfully' });
    });
app.post(
    '/create-audio-category-folder',
    (req, res) => {
        const { categoryName } = req.body;
        const categoryFolderPath = path.join(audioOutputDirPath, categoryName);
        if (!fs.existsSync(categoryFolderPath)) {
            fs.mkdirSync(categoryFolderPath);
        }
        res.status(200).json({ message: 'Category folder created successfully' });
    });
app.post(
    '/copy-image',
    upload.single('imageFile'),
    (req, res) => {
        res.send('Image received and stored');
    }
);
app.post(
    '/copy-audio',
    upload.single('audioFile'),
    (req, res) => {
        res.send('Audio file received and stored');
    }
);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
