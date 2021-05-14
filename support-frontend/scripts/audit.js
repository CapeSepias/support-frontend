const path = require('path');
const madge = require('madge');
const entryPoints = require('../webpack.entryPoints');

const flattenedEntryPoints = Object.keys(entryPoints).reduce((acc, key) => ({
  ...acc,
  ...entryPoints[key],
}), {});

const baseDir = path.join(__dirname, '..', 'assets');

const config = {
  baseDir,
  fileExtensions: [
    'js',
    'jsx',
  ],
};

console.log(flattenedEntryPoints);

const imagePromises = Object.keys(flattenedEntryPoints).map(async (entryPointKey) => {
  const result = await madge(path.join(baseDir, flattenedEntryPoints[entryPointKey]));
  const writtenImagePath = await result.image(`${entryPointKey}.svg`);
  return writtenImagePath;
});

Promise.all(imagePromises).then((result) => {
  console.log(result);
});


// // Draw dependency graph
// madge(path.join(baseDir, 'pages/showcase/showcase.jsx'))
//   .then(result => result.image('showcase.svg'))
//   .then((writtenImagePath) => {
//     console.log(`Image written to ${writtenImagePath}`);
//   })
//   .catch((e) => {
//     console.log(`\n${e}\n`);
//   });
