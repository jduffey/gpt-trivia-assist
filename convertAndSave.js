const fs = require('fs');
const path = require('path');

const ANSWER_TERMINATOR = '^^^^';
const QUESTION_TYPE = {
    text: "T",
    photo: "P",
    sound: "S",
};
const TEXT_FONT = "#Palatino Linotype#28#True#False#16777215#";
const IS_NOT_DAILY_DOUBLE = "N";

function convertToCustomFormat(questionsByCategory) {
    let output = '';

    questionsByCategory.forEach(categoryObj => {
        const { category, questions } = categoryObj;

        output += category + '\n';

        questions.forEach(q => {
            output += q.question + '\n';
            output += q.answer + ANSWER_TERMINATOR + '\n';
            output += IS_NOT_DAILY_DOUBLE + '\n';
            output += QUESTION_TYPE.text + TEXT_FONT + '\n';
        });
    });

    return output;
}

function saveCustomFormatFile(data, fileName) {
    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    const filePath = path.join(outputDir, fileName);

    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                console.error(`Error saving trivia questions: ${err}`);
                reject(err);
            } else {
                console.log(`Trivia questions saved successfully as ${fileName}`);
                resolve();
            }
        });
    });
}

module.exports = {
    convertAndSave: (questionsByCategory, fileName) => {
        const customFormatData = convertToCustomFormat(questionsByCategory);
        return saveCustomFormatFile(customFormatData, fileName);
    }
};
