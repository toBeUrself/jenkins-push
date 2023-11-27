import { getNewPageAsync } from "./pupperteer.mjs";

const JENKINS_ROOT = 'https://jenkins.hmswork.space/jenkins/';
const JENKINS_MYVIEWS_ALL = 'https://jenkins.hmswork.space/jenkins/me/my-views/view/all/';
// https://jenkins.hmswork.space/jenkins/me/my-views/view/all/job/hedge-web/
const getJenkinsJobUrl = (project) => (`https://jenkins.hmswork.space/jenkins/me/my-views/view/all/job/${project}/build?delay=0sec`); 

export const getJenkinsPageAsync = async () => {
  const page = await getNewPageAsync();
  await page.goto(JENKINS_ROOT);
  await page.setViewport({width: 1680, height: 1024});

  return page;
};

export const loginJenkinsAsync = async (params) => {
  const page = await getJenkinsPageAsync();

  const searchResultSelector = '.content-block__link';
  await page.waitForSelector(searchResultSelector);
  await page.click(searchResultSelector);

  const userNameSelector = '#j_username';
  await page.waitForSelector(userNameSelector);
  await page.type(userNameSelector, params.username);

  const userPwdSelector = 'input[name="j_password"]';
  await page.waitForSelector(userPwdSelector);
  await page.type(userPwdSelector, params.password);

  const submitBtnSelector = 'input[type="submit"]';
  await page.waitForSelector(submitBtnSelector);
  await page.click(submitBtnSelector);

  return page;
}

export const checkJenkinsHasTheJobAsync = async (params) => {
  const page = await loginJenkinsAsync(params);

  await page.goto(JENKINS_MYVIEWS_ALL);

  const jobList = await page.$$eval('#projectstatus tr', trs => trs.filter(tr => tr.id).map(tr => tr.id.replace('job_', '')));

  if (!jobList.includes(params.project)) {
    throw new Error(`你没有这个项目【${params.project}】的权限，请重新设置！`);
  }

  return page;
}

export const gotoJenkinsJobPageSettingAsync = async (params) => {
  const page = await checkJenkinsHasTheJobAsync(params);

  await page.goto(getJenkinsJobUrl(params.project));

  const branchNameSelector = 'input[value="branchName"] + select';
  await page.$eval(branchNameSelector, (element, params) => {
    element.value = params.branchname;
    element.dispatchEvent(new Event('change'));
  }, params);

  const deployEnvSelector = 'input[value="deployEnv"] + select';
  await page.$eval(deployEnvSelector, (element, params) => {
    element.value = params.deployEnv;
    element.dispatchEvent(new Event('change'));
  }, params);

  return page;
};

export const jenkinsJobBuildAsync = async (params) => {
  const page = await gotoJenkinsJobPageSettingAsync(params);

  const buildBtnSelector = 'button[type="submit"]';
  await page.waitForSelector(buildBtnSelector);
  await page.click(buildBtnSelector);

  return page;
};