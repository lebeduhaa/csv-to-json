const constants = {
    args: {
        requiredArgs: [
            '--sourceFile',
            '--resultFile'
        ],
        optionalArgs: {
            separator: '--separator'
        },
        argValiIndexes: [0, 2, 4],
        minLengthOfArguments: 4
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
        numberOfIteration: 13600
    }
};

module.exports = constants;
