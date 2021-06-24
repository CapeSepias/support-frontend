import path from 'path';
import fs from 'fs';
import lineReader from 'line-reader';

const logPath = path.resolve(__dirname, '../err.log');

const typescriptErrors: {
  [key: string]: {
    count: number,
    instances: Array<{
      path: string,
      message: string
    }>
  }
} = {};

let currentError: {
  errorPath?: string,
  errorCode?: string,
  errorMessage?: string
} = {};

const addCurrentErrorToMap: () => void = () => {
  const { errorPath, errorCode, errorMessage } = currentError;

  if (!errorPath || !errorCode || !errorMessage) {
    return;
  }

  if (!typescriptErrors[errorCode]) {
    typescriptErrors[errorCode] = {
      count: 0,
      instances: [],
    };
  }

  typescriptErrors[errorCode].count += 1;
  typescriptErrors[errorCode].instances.push({
    path: errorPath,
    message: errorMessage,
  });
};

const eachLineAsync = (): Promise<void> => new Promise((resolve) => {
  lineReader.eachLine(logPath, (line, lastLine) => {
    const capturedGroups = (/^(?<errorPath>[^(]*(\.tsx|\.ts)).*?(?<errorCode>TS\d+):\s(?<errorMessage>.*)$/gm.exec(line));

    if (capturedGroups && capturedGroups.groups) {
      const { errorPath, errorCode, errorMessage } = capturedGroups.groups;

      currentError = {
        errorPath,
        errorCode,
        errorMessage,
      };
    } else {
      currentError = {
        ...currentError,
        errorMessage: line.trim(),
      };
    }

    addCurrentErrorToMap();

    if (lastLine) {
      resolve();
    }
  });
});

eachLineAsync().then(() => {
  fs.writeFileSync('typescript-errors.json', JSON.stringify(typescriptErrors, null, 4));
}).catch((err) => {
  console.error(err);
});
