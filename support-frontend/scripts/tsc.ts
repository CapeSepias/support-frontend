import lineReader from 'line-reader';
import path from 'path';

const logPath = path.resolve(__dirname, '../err.log');

const errorMap: {
  [key: string]: {
    count: number,
    instances: Array<{
      path: string,
      message: string
    }>
  }
} = {};

const addErrorToMap: (errorPath: string, errorCode: string, errorMessage: string) => void = (errorPath, errorCode, errorMessage) => {
  if (!errorMap[errorCode]) {
    errorMap[errorCode] = {
      count: 0,
      instances: [],
    };
  }

  errorMap[errorCode].count += 1;
  errorMap[errorCode].instances.push({
    path: errorPath,
    message: errorMessage,
  });
};

const eachLineAsync = (): Promise<void> => new Promise((resolve) => {
  lineReader.eachLine(logPath, (line, lastLine) => {

    const capturedGroups = (/^(?<errorPath>[^(]*(\.tsx|\.ts)).*?(?<errorCode>TS\d+):\s(?<errorMessage>.*)$/gm.exec(line));

    if (capturedGroups && capturedGroups.groups) {
      const { errorPath, errorCode, errorMessage } = capturedGroups.groups;

      addErrorToMap(errorPath, errorCode, errorMessage);
    }

    if (lastLine) {
      resolve();
    }
  });
});

eachLineAsync().then(() => {
  console.log('errorMap --->', errorMap);
}).catch((err) => {
  console.error(err);
});
