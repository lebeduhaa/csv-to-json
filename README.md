# Csv to json parser

## Install as a global tool

1. npm install -g csv-to-json-lebeduha
2. csv-to-json-lebeduha [options]

## Usage as a command line tool

1. git clone https://github.com/lebeduhaa/csv-to-json.git
2. cd cvs-to-json
3. npm link
4. csvToJson [options]

## Common usage

1. git clone https://github.com/lebeduhaa/csv-to-json.git
2. cd cvs-to-json
3. npm rum start [options]

### Options

1. --sourceFile
2. --resultFile
3. --separator

### Examples
1. csvToJson --sourceFile ".\for-testing\qwe.csv" --resultFile "qwe.json"
2. csvToJson --sourceFile ".\for-testing\star-wars.csv" --resultFile "star-wars.json" --separator "/"
3. csvToJson --sourceFile ".\for-testing\test.csv" --resultFile "test.json"

### Conclusion
Using windows task manager I checked and detected that max memory usage was not more than 65mb.