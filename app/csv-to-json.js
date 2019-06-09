const GoogleDrive = require('../google-drive/google-drive-api');
const serviceAccount = require('../google-drive/private_key.json');
const SeparatorDetector = require('./separator');
const { Transform } = require('stream');
const chalk = require('chalk');
const fileSystem = require('fs');
const constants = require('./constants');

class CsvToJson {

    constructor(sourceFile, resultFile) {
        this.sourceFile = sourceFile;
        this.resultFile = resultFile;
        this.separator = null;
        this.nextLineSeparator = null;
        this.firstLineEnd = null;
        this.structureKeys = null;
        this.srcStream = null;
        this.targetStream = null;
    }

    run() {
        this.srcStream = fileSystem.createReadStream(this.sourceFile);
        this.srcStream.on('error', err => console.log(chalk.red(`File ${this.sourceFile} is not exists!`)));
        this.__defineTransformStreamOptions(this.srcStream, this.targetStream);
        this.srcStream.on('close', this.__startProcessing());
    }

    __createTransformStream() {
        const csvToJson = this;

        return new Transform({
            transform(chunk, encoding, callback) {
                const currentPieces = (csvToJson.firstLineEnd ? chunk.toString().substr(csvToJson.firstLineEnd + 1) : chunk.toString()).split(csvToJson.nextLineSeparator);

                currentPieces.forEach((piece) => {
                    const obj = {};
                    const values = piece.split(csvToJson.separator);

                    csvToJson.structureKeys.forEach((key, index) => {
                        obj[key] = values[index];
                    });
                    this.push(`${csvToJson.firstLineEnd ? '' : ','}\r\n${JSON.stringify(obj)}`);
                    csvToJson.firstLineEnd = null;
                });
                callback();
            }
        });
    }

    __defineTransformStreamOptions() {
        this.srcStream.on('data', (filePiece) => {
            this.separator = SeparatorDetector.getSeparator(filePiece.toString());
            this.targetStream = fileSystem.createWriteStream(this.resultFile);
            this.targetStream.write('[');
            console.log(chalk.green('The process have started...'));

            this.nextLineSeparator = SeparatorDetector.getNextLineSeparator(filePiece);
            this.firstLineEnd = filePiece.toString().indexOf(this.nextLineSeparator);

            if (~this.firstLineEnd) {
                this.structureKeys = filePiece.toString().substr(0, this.firstLineEnd - 1).split(this.separator);
                this.__defineTransformStreamOptions();
                this.srcStream.close();
            }
        });
    }

    __startProcessing() {
        return () => {
            const transformStream = this.__createTransformStream();
            const mainStream = fileSystem.createReadStream(this.sourceFile).pipe(transformStream).pipe(this.targetStream);

            mainStream.on('finish', async () => {
                const finishStream = fileSystem.createWriteStream(this.resultFile, { flags: 'a' });
                const googleDrive = new GoogleDrive(
                    constants.googleDrive.folderId,
                    serviceAccount.client_email,
                    serviceAccount.private_key,
                    [constants.googleDrive.scopes.authDrive],
                    constants.googleDrive.mimeType,
                    constants.googleDrive.fields
                );

                finishStream.write(']');
                finishStream.close();
                this.targetStream.close();
                console.log(chalk.green('Converting was performed successfully!'));
                await googleDrive.authorize();
                await googleDrive.uploadFile(this.resultFile);
                console.log(chalk.bgGreen(`Result was saved on Google Drive as ${this.resultFile}.`));
                console.log(chalk.green('Go to https://drive.google.com/drive/folders/1VeKxiwl93buBrcaaB7zhCGMnSGfiHyP7 to open this file'));
            });
        };
    }
}

module.exports = CsvToJson;
