const { google } = require('googleapis');
const drive = google.drive('v3');
const fs = require('fs');
const key = require('./private_key.json');
const constants = require('../app/constants');
let jwToken;


const authorizeGoogleDrive = () => new Promise((resolve, reject) => {
    jwToken = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
        [constants.googleDrive.scopes.authDrive],
        null
    );
    jwToken.authorize((err) => {
        if (err) {
            reject(err);
        } else {
            resolve();
        }
    });
});

const uploadFile = fileName => new Promise((resolve, reject) => {
    const { folderId } = constants.googleDrive;
    const fileMetadata = {
        name: fileName,
        parents: [folderId]
    };
    const media = {
        mimeType: constants.googleDrive.mimeType,
        body: fs.createReadStream(fileName)
    };

    drive.files.create({
        auth: jwToken,
        resource: fileMetadata,
        media,
        fields: constants.googleDrive.fields
    }, (err) => {
        if (err) {
            reject(err);
        } else {
            resolve();
        }
    });
});

exports.uploadFile = uploadFile;
exports.authorizeGoogleDrive = authorizeGoogleDrive;
