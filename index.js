#!/usr/bin/env node
const args = process.argv.slice(2);
const fileSystem = require('fs');
const chalk = require('chalk');
const { Transform } = require('stream');
const { uploadFile, authorizeGoogleDrive } = require('./google-drive/google-drive-api');
const constants = require('./app/constants');
const { getSeparator } = require('./app/separator');

if (constants.args.requiredArgs.every(argument => args.includes(argument))) {
    const sourceFileArgIndex = args.findIndex(argument => argument === constants.args.requiredArgs[0]);
    const resultFileArgIndex = args.findIndex(argument => argument === constants.args.requiredArgs[1]);

    if (
        constants.args.argValiIndexes.includes(sourceFileArgIndex) &&
        constants.args.argValiIndexes.includes(resultFileArgIndex) &&
        args.length >= constants.args.minLengthOfArguments
    ) {
        const sourceFile = args[sourceFileArgIndex + 1];
        const resultFile = args[resultFileArgIndex + 1];

        if (fileSystem.existsSync(resultFile)) {
            console.log(chalk.red(`File ${resultFile} is already exists!`));
        } else {
            const srcStream = fileSystem.createReadStream(sourceFile);
            let distStream;
            let nextLineSeparator;
            let separator;
            let firstLineEnd;
            let structureKeys;
            const transformStream = new Transform({
                transform(chunk, encoding, callback) {
                    const currentPieces = (firstLineEnd ? chunk.toString().substr(firstLineEnd + 1) : chunk.toString()).split(nextLineSeparator);

                    currentPieces.forEach((piece) => {
                        const obj = {};
                        const values = piece.split(separator);

                        structureKeys.forEach((key, index) => {
                            obj[key] = values[index];
                        });
                        this.push(`${firstLineEnd ? '' : ','}\r\n${JSON.stringify(obj)}`);
                        firstLineEnd = null;
                    });
                    callback();
                }
            });

            srcStream.on('error', err => console.log(chalk.red(`File ${sourceFile} is not exists!`)));
            srcStream.on('data', (data) => {
                separator = getSeparator(data.toString());
                distStream = fileSystem.createWriteStream(resultFile);
                distStream.write('[');
                console.log(chalk.green('The process have started...'));

                if (~data.toString().indexOf('\r')) {
                    nextLineSeparator = '\r';
                } else {
                    nextLineSeparator = '\n';
                }

                firstLineEnd = data.toString().indexOf(nextLineSeparator);

                if (~firstLineEnd) {
                    structureKeys = data.toString().substr(0, firstLineEnd - 1).split(separator);
                    srcStream.close();
                }
            });
            srcStream.on('close', () => {
                const mainStream = fileSystem.createReadStream(sourceFile).pipe(transformStream).pipe(distStream);

                mainStream.on('finish', async () => {
                    const finishStream = fileSystem.createWriteStream(resultFile, { flags: 'a' });

                    finishStream.write(']');
                    finishStream.close();
                    distStream.close();
                    console.log(chalk.green('Converting was performed successfully!'));
                    await authorizeGoogleDrive();
                    await uploadFile(resultFile);
                    console.log(chalk.bgGreen(`Result was saved on Google Drive as ${resultFile}.`));
                    console.log(chalk.green('Go to https://drive.google.com/drive/folders/1VeKxiwl93buBrcaaB7zhCGMnSGfiHyP7 to open this file'));
                });
            });
        }
    } else {
        console.log(chalk.red('Incorrect syntax of the command!'));
    }
} else {
    console.log(chalk.red('Missing required arguments!'));
}
