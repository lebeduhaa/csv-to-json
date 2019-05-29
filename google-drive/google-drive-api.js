const {google} = require('googleapis');
const drive = google.drive('v3');
const key = require('./private_key.json');
const fs = require('fs');
const chalk = require('chalk');

const jwToken = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ['https://www.googleapis.com/auth/drive'],
  null
);
jwToken.authorize(authErr => {
  if (authErr) {
    console.log(`err : ${authErr}`);
    return;
  }
});

const uploadFile = fileName => {
  const folderId = "1VeKxiwl93buBrcaaB7zhCGMnSGfiHyP7";
  const fileMetadata = {
    name: fileName,
    parents: [folderId]
  };
  const media = {
    mimeType: 'tapplication/json',
    body: fs.createReadStream(fileName)
  };

  drive.files.create({
    auth: jwToken,
    resource: fileMetadata,
    media,
    fields: 'id'
  }, (err, file) => {
    if (err) {
      console.error(err);
    } else {
      console.log(chalk.bgGreen(`Result was saved on Google Drive as ${fileName}.`));
      console.log(chalk.green('Go to https://drive.google.com/drive/folders/1VeKxiwl93buBrcaaB7zhCGMnSGfiHyP7 to open this file'))
    }
  });
}

exports.uploadFile = uploadFile
