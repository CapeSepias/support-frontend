const path = require('path');
const madge = require('madge');
const chalk = require('chalk');
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

madge(baseDir, config).then((result) => {
  const testDirectoryName = '__tests__';
  const warningColour = chalk.rgb(245, 123, 66);
  const noWarningColour = chalk.keyword('green');
  const jsOrphans = result.orphans().filter(orphanPath => path.extname(orphanPath) !== '.scss');
  const entryPointPaths = Object.keys(flattenedEntryPoints).map(entryPoint => flattenedEntryPoints[entryPoint]);

  // filter out entryPointPaths and tests from jsOrphans
  const jsOrphansFiltered = jsOrphans.filter(orphanPath =>
    !entryPointPaths.includes(orphanPath) && path.basename(path.dirname(orphanPath)) !== testDirectoryName);

  if (!jsOrphansFiltered.length) {
    console.log(noWarningColour('No orphan modules identified!'));
  } else {
    console.log(`${'\n'}${warningColour.bold(`${jsOrphansFiltered.length} orphan .js/.jsx modules identified...`)}`);
    jsOrphansFiltered.forEach(orphan => console.log(warningColour(orphan)));
  }
}).catch((e) => {
  console.log(`\n${e}\n`);
});

// Draw dependency graph
madge(path.join(baseDir, 'pages/showcase/showcase.jsx'))
  .then(result => result.image('showcase.svg'))
  .then((writtenImagePath) => {
    console.log(`Image written to ${writtenImagePath}`);
  })
  .catch((e) => {
    console.log(`\n${e}\n`);
  });
