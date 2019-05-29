const fs = require('fs');
const readLine = require('readline');
const chalk = require('chalk');

const r = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

const readFileName = () => {
  r.question('Input name of the big file :  ', fileName => {
    if (fs.existsSync(`${__dirname}|${fileName}.csv`)) {
      console.log(chalk.red(`File ${fileName}.csv is already exists!`));
      readFileName();
    } else {
      r.close();
      createBigFile(fileName);
    }
  });
}

const createBigFile = fileName => {
  const stream = fs.createWriteStream(`${__dirname}/${fileName}.csv`);

  stream.write('name|heightmass|hair_color|eye_color|gender\n');
  console.log(chalk.yellow('Start of the file creating...'));

  for (var i = 0; i < 7000000; i++) {
    stream.write(`Luke Skywalker!172!77!blond!blue!male
C-3PO!167!75!n|a!yellow!n|a
R2-D2!96!32!n|a!red!n|a
Darth Vader!202!136!none!yellow!male
Leia Organa!150!49!brown!brown!female
`);
  }

  console.log(chalk.green(`File ${fileName}.csv was created successfully`));
}

readFileName();