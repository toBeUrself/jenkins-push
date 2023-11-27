import puppeteer from 'puppeteer';

let browser = null;
const launchOptions = {
  headless: false,
};

export const getBrowserAsync = () => {
  return new Promise((r, j) => {
    if (browser) {
      return r(browser);
    } else {
      puppeteer
        .launch(launchOptions)
        .then(instance => {
          browser = instance;
          return r(instance);
        })
        .catch(err => {
          j(err);
        });
    }
  });
};

export const getNewPageAsync = async () => {
  const browser = await getBrowserAsync();
  const page = await browser.newPage();

  return page;
}

export const browserClose = () => {
  browser?.close();
}