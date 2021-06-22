const lineReader = require('line-reader');
const path = require('path');

const logPath = path.resolve(__dirname, '../err.log');

lineReader.eachLine(logPath, (line) => {
  console.log(line.split(':').length);
});
