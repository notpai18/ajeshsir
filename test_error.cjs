const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  await page.goto('https://chemistrikaran.vercel.app/', { waitUntil: 'networkidle2' });
  const html = await page.evaluate(() => document.body.innerHTML);
  console.log('HTML:', html.substring(0, 500));
  await browser.close();
})();
