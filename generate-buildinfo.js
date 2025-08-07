const fs = require('fs');
const path = require('path');
const packageJson = require('./package.json');
const buildInfo = {
  buildDate: new Date().toISOString(),
  buildVersion: packageJson.version,
};
const buildInfoPath = path.join(__dirname, 'assets', 'build-info.json');
fs.mkdirSync(path.dirname(buildInfoPath), { recursive: true });
fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2), 'utf8');
console.log(`Build info written to ${buildInfoPath}`);