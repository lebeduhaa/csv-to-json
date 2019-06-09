const { google } = require('googleapis');
const drive = google.drive('v3');
const fs = require('fs');
let jwToken;

class GoogleDrive {

    constructor(
        folderId,
        clientEmail,
        privateKey,
        scopes,
        mimeType,
        fields
    ) {
        this.folderId = folderId;
        this.clientEmail = clientEmail;
        this.privateKey = privateKey;
        this.scopes = scopes;
        this.mimeType = mimeType;
        this.fields = fields;
    }

    authorize() {
        return new Promise((resolve, reject) => {
            jwToken = new google.auth.JWT(
                this.clientEmail,
                null,
                this.privateKey,
                this.scopes,
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
    } 

    uploadFile(filename) {
        return new Promise((resolve, reject) => {
            const fileMetadata = {
                name: filename,
                parents: [this.folderId]
            };
            const media = {
                mimeType: this.mimeType,
                body: fs.createReadStream(filename)
            };
        
            drive.files.create({
                auth: jwToken,
                resource: fileMetadata,
                media,
                fields: this.fields
            }, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = GoogleDrive;
