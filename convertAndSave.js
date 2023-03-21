const fs = require('fs');
const path = require('path');

function convertToCustomFormat(questionsByCategory) {
    let output = '';

    questionsByCategory.forEach(categoryObj => {
        const { category, questions } = categoryObj;

        output += category + '\n';

        questions.forEach(q => {
            output += q.question + '\n';
            output += q.answer + '^^^^\n';
            output += 'N\n';
            output += 'T#Courier New#28#True#True#16777215#\n';
        });
    });

    return output;
}

function saveCustomFormatFile(data, fileName) {
    const filePath = path.join(__dirname, fileName);

    fs.writeFile(filePath, data, (err) => {
        if (err) {
            console.error(`Error saving trivia questions: ${err}`);
            return false;
        } else {
            console.log(`Trivia questions saved successfully as ${fileName}`);
            return true;
        }
    });
}

module.exports = {
    convertAndSave: (questionsByCategory, fileName) => {
        const customFormatData = convertToCustomFormat(questionsByCategory);
        return saveCustomFormatFile(customFormatData, fileName);
    }
};
