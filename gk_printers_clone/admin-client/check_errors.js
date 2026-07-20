import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`PAGE ERROR: ${msg.text()}`);
    } else {
      console.log(`PAGE LOG: ${msg.text()}`);
    }
  });
  
  page.on('pageerror', error => {
    console.log(`PAGE EXCEPTION: ${error.message}`);
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' }).catch(e => console.log(e));
  
  // Wait a bit to let any runtime errors happen
  await page.waitForTimeout(2000);
  
  await browser.close();
})();
