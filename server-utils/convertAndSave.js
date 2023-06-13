const fs = require('fs');
const path = require('path');

const CRLF = '\r\n';
const CARET_TERMINATOR = {
    ANSWER: '^^^^',
    FILE: '^^^',
};
const DAILY_DOUBLE = {
    YES: "Y",
    NO: "N",
};
const QUESTION_TYPE = {
    T: "T#Palatino Linotype#28#True#False#16777215#",
    P: "P",
    S: "S",
};

function convertToCustomFormat(questionsByCategory) {
    let output = '';

    questionsByCategory.forEach(categoryObj => {
        const { category, questions } = categoryObj;

        output += category + CRLF;

        questions.forEach(q => {
            output += q.question + CRLF;
            output += q.answer + CARET_TERMINATOR.ANSWER + CRLF;
            output += (q.isDD ? DAILY_DOUBLE.YES : DAILY_DOUBLE.NO) + CRLF;
            output += (q.questionType ? QUESTION_TYPE[q.questionType] : QUESTION_TYPE.T) + CRLF;
        });
    });

    output += CRLF + CARET_TERMINATOR.FILE + CRLF + CRLF;

    return output;
}

function saveCustomFormatFile(data, fileName) {
    const outputDir = path.resolve(__dirname, '..', 'output');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    const filePath = path.join(outputDir, fileName);

    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                console.error(`🔴 Error saving trivia questions: ${err} 🔴`);
                reject(err);
            } else {
                console.log(`🟢 Trivia questions saved successfully as ${fileName} 🟢`);
                fs.readFile(filePath, 'utf-8', (readErr, contents) => {
                    if (readErr) {
                        console.error(`🔴 Error reading trivia questions: ${readErr} 🔴`);
                        reject(readErr);
                    } else {
                        console.log(`🟢 Reading ${fileName}: 🟢\n${contents}🟢🟢🟢`);
                        resolve();
                    }
                });
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
