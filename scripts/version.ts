import chalk from 'chalk';
import { version as root } from '../package.json';
import { version as applicant } from '../packages/applicant/package.json';
import { version as common } from '../packages/common/package.json';
import { version as issuer } from '../packages/issuer/package.json';

import { promises as fs } from 'fs';
import { execSync } from 'child_process';
import * as path from 'path';

const semvers = { root, applicant, common, issuer }

async function readPackageJson(packagePath: string) {
  const data = await fs.readFile(packagePath, 'utf-8');
  return JSON.parse(data);
}

async function writePackageJson(packagePath: string, content: any) {
  await fs.writeFile(packagePath, JSON.stringify(content, null, 2) + '\n', 'utf-8');
}

function incrementVersion(version: string, releaseType: string): string {
  const [major, minor, patch] = version.split('.').map(Number);

  switch (releaseType) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error(`Unknown release type: ${releaseType}`);
  }
}

async function updateVersion(packagePath: string, releaseType: string) {
  const packageJson = await readPackageJson(packagePath);
  const newVersion = incrementVersion(packageJson.version, releaseType);
  packageJson.version = newVersion;

  await writePackageJson(packagePath, packageJson);

  switch (packageJson.name) {
    case '@dvcx/applicant':
      semvers.applicant = newVersion;
      break;
    case '@dvcx/common':
      semvers.common = newVersion;
      break;
    case '@dvcx/issuer':
      semvers.issuer = newVersion;
      break;
    case '@dvcx/protocol':
      semvers.common = newVersion;
      break;
  }

  console.log(`Updated ${packageJson.name} to version ${newVersion}`);
}

async function version() {
  const args = process.argv.slice(2);
  const releaseTypes = ['patch', 'minor', 'major'];
  const releaseType = args.find(arg => releaseTypes.find(releaseType => releaseType === arg));
  const doGit = args.some(arg => ['--git', '-g'].includes(arg));

  if (!releaseType) {
    throw new Error('Invalid argument. Use "patch", "minor", or "major".');
  }

  const packagePaths = [
    path.resolve(process.cwd(), 'package.json'),
    path.resolve(process.cwd(), 'packages/applicant/package.json'),
    path.resolve(process.cwd(), 'packages/common/package.json'),
    path.resolve(process.cwd(), 'packages/issuer/package.json'),
  ];

  for (const packagePath of packagePaths) {
    await updateVersion(packagePath, releaseType);
  }

  console.log('Package versions updated:', semvers);

  if (doGit) {
    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "chore: bump versions to ${releaseType}"`, { stdio: 'inherit' });
    execSync(`git tag -a "v${releaseType}" -m "Release ${releaseType}"`, { stdio: 'inherit' });
  }
}

version().catch(err => {
  console.error(err);
  process.exit(1);
});
