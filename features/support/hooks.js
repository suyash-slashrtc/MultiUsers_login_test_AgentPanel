// features/support/hooks.js
const { AfterAll, Before, After, BeforeAll, setDefaultTimeout } = require('@cucumber/cucumber');
const fs = require('fs-extra');
const csv = require('csv-parser');
const path = require('path');

// Store agents globally
let globalAgents = [];
setDefaultTimeout(60 * 1000);

BeforeAll(async function () {
  console.log('Loading agents from CSV (once)...');
  const csvPath = path.join(__dirname, '..', '..', 'data', 'agents.csv');
  
  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found at: ${csvPath}`);
  }
  
  globalAgents = await new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        console.log(`Loaded ${results.length} agents from CSV`);
        resolve(results);
      })
      .on('error', reject);
  });
});

Before(async function () {
  console.log('Starting scenario...');
  
  // Assign pre-loaded agents to scenario
  this.agents = [...globalAgents];
  console.log(`Assigned ${this.agents.length} agents to scenario`);
});

After(async function () {
  // Clean up after each scenario
  if (this.closeBrowser) {
    try {
      await this.closeBrowser();
    } catch (error) {
      console.log('Error closing browser:', error.message);
    }
  }
  console.log('Scenario completed');
});

AfterAll(async function () {
  console.log('All tests completed');
  
  // Optional: Clean up old screenshots (keep only from last run)
  const screenshotsDir = path.join(__dirname, '..', '..', 'screenshots');
  if (fs.existsSync(screenshotsDir)) {
    console.log(`Screenshots are available in: ${screenshotsDir}`);
  }
});