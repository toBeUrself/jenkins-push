import inquirer from "inquirer";
import { decrypt, encrypt } from "./crypto.mjs";
import { getAppConfig, writeAppConfig } from "./config.mjs";

const account = [
  {
    type: 'input',
    name: 'username',
    message: '输入Jenkins账户名称：',
    validate: function (input) {
      const done = this.async();

      setTimeout(function() {
        if (!input) {
          done('账户名称必须输入！');
        } else {
          done(null, true);
        }
      }, 300);
    },
  }, {
    type: 'password',
    name: 'password',
    message: '输入Jenkins账户密码：',
    validate: function (input) {
      const done = this.async();

      setTimeout(function() {
        if (!input) {
          done('账户密码必须输入！');
        } else {
          done(null, true);
        }
      }, 300);
    },
  },
];

const projects = [
  {
    type: 'input',
    name: 'projects',
    message: '设置常用项目名称[项目间用,隔开]',
  },
];

let questions = [
  {
    type: 'input',
    name: 'project',
    message: '输入要发布的项目名称：',
  }, {
    type: 'list',
    name: 'branchname',
    message: '输入要发布的项目分支：',
    default: 'qa',
    choices: ['dev', 'qa', 'master', 'sass'],
  }, {
    type: 'list',
    name: 'deployEnv',
    message: '输入要发布的环境：',
    default: 'test',
    choices: ['dev', 'test', 'prod', 'sass', 'mock'],
  },
];

export const initAppAsync = async () => {
  return new Promise((r, j) => {
    const appConfig = getAppConfig();
    if (!appConfig) {
      questions = [...account, ...projects, ...questions];
    } else if (appConfig.projects) {
      questions[0].type = 'list';
      questions[0].choices = appConfig.projects.split(',');
    }

    inquirer
      .prompt(questions)
      .then(answers => {
        if (!appConfig) {
          answers.password = encrypt(answers.password);
          writeAppConfig(answers);
        } else {
          answers.username = appConfig.username;
          answers.password = decrypt(appConfig.password);
        }

        r(answers);
      })
      .catch((err) => {
        console.error('输入有误： ', err);
        j(err);
      });
  });
};