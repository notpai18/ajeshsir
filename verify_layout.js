import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // We are checking the Professor Workspace. 
  // It should be accessible at http://localhost:3002/
  // Wait, let's login first if needed or if there's no auth, just visit it.
  await page.goto('http://localhost:3002/');

  // Wait, the professor dashboard requires selecting a professor profile on the SelectionPage?
  // Let's see what is rendered. 
  // We'll wait a bit.
  await page.waitForTimeout(1000);
  
  const content = await page.content();
  if (content.includes('Select your workspace')) {
    // Click professor workspace
    await page.click('text=Professor Workspace');
    await page.waitForTimeout(1000);
  }

  const widths = [
    { w: 744, h: 1133 },
    { w: 800, h: 1280 },
    { w: 820, h: 1180 },
    { w: 834, h: 1194 },
    { w: 884, h: 1400 },
    { w: 912, h: 1368 },
    { w: 1024, h: 1366 }
  ];

  const results = [];

  for (const dim of widths) {
    // Test Portrait
    await evaluateViewport(page, dim.w, dim.h, 'Portrait');
    // Test Landscape
    await evaluateViewport(page, dim.h, dim.w, 'Landscape');
  }

  async function evaluateViewport(page, w, h, orientation) {
    await page.setViewportSize({ width: w, height: h });
    await page.waitForTimeout(500); // let resize settle

    // Test each tab: overview, notes, videos, pyqs, sheets
    const tabs = ['notes', 'videos', 'pyqs', 'sheets'];
    
    for (const tab of tabs) {
      // Click tab to ensure the content is loaded
      // The tab has id `sidebar-tab-${tab}` or we can click text
      try {
        const tabBtn = page.locator(`button[id="sidebar-tab-${tab}"]`);
        if (await tabBtn.isVisible()) {
           await tabBtn.click();
        } else {
           // Mobile nav is collapsed, open it
           await page.click('button:has-text("Overview"), button:has-text("Study Notes"), button:has-text("Video Lectures"), button:has-text("PYQ Library"), button:has-text("Practice Sheets")');
           await page.waitForTimeout(300);
           await page.click(`button:has-text("${getTabName(tab)}")`);
        }
      } catch (e) {
        console.log(`Failed to navigate to tab ${tab}`);
      }
      
      await page.waitForTimeout(500);

      // 1. Check for horizontal overflow on the page
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      // 2. Check for tap target sizes in RowActions (should be at least 44x44px)
      const tapTargetIssues = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button[aria-label="View PDF"], button[aria-label="Edit"], button[aria-label="Delete"]'));
        let issues = 0;
        for (const btn of buttons) {
          const rect = btn.getBoundingClientRect();
          if (rect.width > 0 && (rect.width < 43.5 || rect.height < 43.5)) {
            issues++;
          }
        }
        return issues;
      });
      
      // 3. Look for table clipping or overlap
      const tableOverflow = await page.evaluate(() => {
        const tables = Array.from(document.querySelectorAll('table'));
        let clipped = 0;
        for (const table of tables) {
          if (table.getBoundingClientRect().width > window.innerWidth) {
            clipped++;
          }
        }
        return clipped;
      });

      if (hasOverflow || tapTargetIssues > 0 || tableOverflow > 0) {
        results.push({
          resolution: `${w}x${h} (${orientation})`,
          tab: tab,
          hasOverflow,
          tableOverflow,
          tapTargetIssues
        });
      }
    }
  }

  function getTabName(id) {
    if (id === 'notes') return 'Study Notes';
    if (id === 'videos') return 'Video Lectures';
    if (id === 'pyqs') return 'PYQ Library';
    if (id === 'sheets') return 'Practice Sheets';
    return 'Overview';
  }

  if (results.length === 0) {
    console.log("SUCCESS: No overflow, clipping, or undersized tap targets found across any tested tablet width.");
  } else {
    console.log("ISSUES FOUND:");
    console.table(results);
  }

  await browser.close();
})();
