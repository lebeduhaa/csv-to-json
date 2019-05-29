const constants = {
    requiredArgs: [
        '--sourceFile',
        '--resultFile'
    ],
    optionalArgs: {
        separator: '--separator'
    },
    argValiIndexes: [0, 2, 4],
    minLengthOfArguments: 4,
    potentialSeparators: [
        ' ', ',', '/', '\\', '|', '.', '!', '@', '#', '$', '%', '^', '&',
        '*', '(', ')', '_', '+', '"', '№', ';', ':', '?', '<', '>'
    ]
};

module.exports = constants;
