// lib/browser.ts
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

const LOCAL_CHROME_EXECUTABLE = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

export async function getBrowser() {
  const isVercel = !!process.env.VERCEL;

  return puppeteer.launch({
    args: isVercel ? chromium.args : [],
    defaultViewport: { width: 1920, height: 1080 },
    executablePath: isVercel
      ? await chromium.executablePath()
      : (process.env.LOCAL_CHROME_PATH || LOCAL_CHROME_EXECUTABLE),
    headless: isVercel ? true : false, 
  });
}
