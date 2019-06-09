const constants = {
    args: {
        required: [
            '--sourceFile',
            '--resultFile'
        ],
        optional: {
            separator: '--separator'
        },
        valiIndexes: [0, 2, 4],
        minLength: 4
    },
    potentialSeparators: [
        ' ', ',', '/', '\\', '|', '.', '!', '@', '#', '$', '%', '^', '&',
        '*', '(', ')', '_', '+', '"', '№', ';', ':', '?', '<', '>'
    ],
    googleDrive: {
        scopes: {
            authDrive: 'https://www.googleapis.com/auth/drive'
        },
        folderId: '1VeKxiwl93buBrcaaB7zhCGMnSGfiHyP7',
        mimeType: 'tapplication/json',
        fields: 'id'
    },
    generateTest: {
        // numberOfIteration: 13600
        numberOfIteration: 600
    }
};

module.exports = constants;
