// features/step_definitions/steps.js
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');

Given('I have loaded agents from CSV', async function () {
  console.log(`Agents loaded: ${this.agents.length}`);
});

Given('I am on the login page for agent from row {int}', async function (rowIndex) {
  await this.initBrowser();
  this.setCurrentAgent(rowIndex);
  
  await this.page.goto('https://tracelog14.slashrtc.in/index.php/login');
  await this.page.waitForSelector('#loginForm', { timeout: 40000 });
  await this.takeScreenshot(`login_page_${this.currentAgent.username}`);
});

When('I login with credentials from CSV row {int}', async function (rowIndex) {
  const { username, password } = this.currentAgent;
  
  console.log(`Logging in with user: ${username}`);
  await this.takeScreenshot(`before_login_${username}`);
  
  // Fill login form
  await this.page.fill('input[name="username"]', username);
  await this.page.fill('input[name="password"]', password);
  
  await this.takeScreenshot(`login_form_filled_${username}`);
  
  // Click login button
  await this.page.click('#loginProcess');
  
  // Wait for navigation
  await this.page.waitForNavigation({ timeout: 15000 });
  await this.takeScreenshot(`after_login_${username}`);
});

When('I click on the web endpoint button', async function () {
  console.log('Clicking on web endpoint button...');
  await this.takeScreenshot('before_web_endpoint_click');
  
  try {
    await this.page.click('button.webPhone');
    await this.takeScreenshot('after_web_endpoint_click');
    await this.page.waitForTimeout(3000);
  } catch (error) {
    console.log('Error clicking web endpoint:', error.message);
    await this.takeScreenshot('web_endpoint_error');
  }
});

When('I handle microphone permission popup', async function () {
  console.log('Handling microphone permission...');
  await this.takeScreenshot('before_microphone_permission');
  
  // Playwright automatically handles permissions when configured in context
  await this.page.waitForTimeout(2000);
  await this.takeScreenshot('after_microphone_permission');
});

When('I click on the menu tab', async function () {
  console.log('Clicking on menu tab...');
  await this.takeScreenshot('before_menu_click');
  
  try {
    await this.page.click('#menuScreenTab');
    await this.takeScreenshot('after_menu_click');
    await this.page.waitForTimeout(2000);
  } catch (error) {
    console.log('Error clicking menu tab:', error.message);
    await this.takeScreenshot('menu_tab_error');
  }
});

When('I click on the logout button', async function () {
  console.log('Clicking on logout button...');
  await this.takeScreenshot('before_logout_click');
  
  try {
    // Using the selector from your feature file
    await this.page.waitForTimeout(3000);
    await this.page.click('#logoutStateUpdateBox i.fa-power-off');
    await this.takeScreenshot('after_logout_click');
    await this.page.waitForTimeout(3000);
  } catch (error) {
    console.log('Error clicking logout button:', error.message);
    await this.takeScreenshot('logout_button_error');
  }
});

Then('I should be redirected to the dashboard', async function () {
  const url = this.page.url();
  expect(url).not.to.contain('/login');
  expect(url).to.contain('/dialScreen');
  
  await this.takeScreenshot('dashboard_redirect');
  console.log('Successfully redirected to dashboard');
});

Then('I should be redirected to the login page', async function () {
  const url = await this.page.url();
  expect(url).to.contain('/login');
  
  await this.takeScreenshot('logout_success');
  console.log('Successfully logged out and redirected to login page');
});

Then('I should be in ready state', async function () {
  console.log('Verifying ready state...');
  await this.page.waitForTimeout(3000);
  
  const isReady = await this.checkReadyState();
  expect(isReady).to.be.true;
  
  const screenshotPath = await this.takeScreenshot(`ready_state_${this.currentAgent.username}`);
  console.log(`Ready state confirmed for ${this.currentAgent.username}`);
  console.log(`Screenshot saved: ${screenshotPath}`);
});