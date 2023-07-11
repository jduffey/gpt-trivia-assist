const fs = require('fs');
const path = require('path');
const axios = require('axios');
const stream = require('stream');
const { promisify } = require('util');
const { v4: uuidv4 } = require('uuid');

const pipeline = promisify(stream.pipeline);

const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const { generateTriviaQuestions } = require('./server-utils/generateTriviaQuestions');
const { convertAndSave } = require('./server-utils/convertAndSave');
const app = express();
const PORT = process.env.PORT || 3000;

const mediaFilesOutputDirPath = path.join(__dirname, 'media-files');
const imagesOutputDirPath = path.join(mediaFilesOutputDirPath, 'images');
const originalImagesOutputDirPath = path.join(mediaFilesOutputDirPath, 'original-images');
const audioOutputDirPath = path.join(mediaFilesOutputDirPath, 'audio');
[
    mediaFilesOutputDirPath,
    imagesOutputDirPath,
    originalImagesOutputDirPath,
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
            'image': path.join(originalImagesOutputDirPath, categoryName),
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

const fetchImage = async (req, res) => {
    const imageURL = req.query.imageURL;
    console.log(`Fetching image from ${imageURL}`);

    const imageFileName = uuidv4();
    const originalImageFilePath = path.join(originalImagesOutputDirPath, imageFileName + ".jpg");

    try {
        const response = await axios({
            url: imageURL,
            method: 'GET',
            responseType: 'stream',
        });

        console.log(response.data);

        await pipeline(response.data, fs.createWriteStream(originalImageFilePath));

        const categoryName = req.query.categoryName;
        const categoryFolderPath = path.join(imagesOutputDirPath, categoryName);
        if (!fs.existsSync(categoryFolderPath)) {
            fs.mkdirSync(categoryFolderPath);
        }

        const outputFilename = imageFileName + ".jpg";
        const outputFile = path.join(categoryFolderPath, outputFilename);

        await sharp(originalImageFilePath)
            .resize(1920, 1080, {
                fit: 'inside'
            })
            .jpeg()
            .toFile(outputFile);

        res.status(200).json({ message: 'Image fetched, converted and saved successfully' });
    } catch (error) {
        console.error(`Error fetching image: ${error}`);
        res.status(500).json({ message: 'Server error' });
    }
}

app.use(express.json());
app.post('/generate', handleGenerate);
app.post('/save', handleSave);
app.post('/fetch-image', fetchImage)
app.post(
    '/copy-image',
    upload.single('imageFile'),
    async (req, res, next) => {
        const categoryName = req.query.categoryName;
        const categoryFolderPath = path.join(imagesOutputDirPath, categoryName);
        if (!fs.existsSync(categoryFolderPath)) {
            fs.mkdirSync(categoryFolderPath);
        }

        const inputFile = req.file.path;
        const outputFilename = path.parse(req.file.originalname).name + ".jpg";
        const outputFile = path.join(categoryFolderPath, outputFilename);

        try {
            await sharp(inputFile)
                .resize(1920, 1080, {
                    fit: 'inside'
                })
                .jpeg()
                .toFile(outputFile);

            next();
        } catch (err) {
            console.log("Sharp error: ", err);
            res.status(500).json({ message: 'Error resizing image' });
        }
    },
    (req, res) => {
        res.send('Image received, stored, and resized');
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
