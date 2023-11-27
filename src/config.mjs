import fs from 'fs';
import path, { resolve } from 'path';

const configFilePath = resolve('./config.json');

const getConfigFile = () => {
  if (!fs.existsSync(configFilePath)) {
    fs.writeFileSync(configFilePath, '');
  }

  return fs.readFileSync(configFilePath, {
    encoding: 'utf-8',
  });
};

export const getAppConfig = () => {
  const file = getConfigFile();
  const content = file ? JSON.parse(file) : null;

  return content;
};

export const writeAppConfig = (json) => {
  fs.writeFileSync(
    configFilePath,
    JSON.stringify(json),
  );
};