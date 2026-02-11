// lib/browser.ts
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

// Optional: specific path for local development (e.g., your Chrome location)
// On Vercel, this variable is not used.
const LOCAL_CHROME_EXECUTABLE = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'; // Windows Example
// const LOCAL_CHROME_EXECUTABLE = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'; // Mac Example

export async function getBrowser() {
  const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION;

  return puppeteer.launch({
    args: isVercel ? chromium.args : [],
    defaultViewport: chromium.defaultViewport,
    executablePath: isVercel 
      ? await chromium.executablePath() 
      : (process.env.LOCAL_CHROME_PATH || LOCAL_CHROME_EXECUTABLE), 
    headless: chromium.headless,
  });
}
