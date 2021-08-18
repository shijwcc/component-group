const child_process = require('child_process');
const packageJson = require('./package.json');

const execSync = command => {
  child_process.execSync(command, { stdio: [0, 1, 2] });
};

let { version } = packageJson;
const reg = /\d+\.\d+\.\d+/;
if (version.match(reg)) {
  version = version.match(reg)[0];
}

execSync(`npm run build`);
execSync(`npm run build-stories`);
execSync(`mkdir -p ./build`);
execSync(`mv ./dist/* ./build/`);
execSync(`mkdir -p ./dist/code/npm/${packageJson.name}/${version}`);
execSync(`mv ./build/* ./dist/code/npm/${packageJson.name}/${version}/`);
