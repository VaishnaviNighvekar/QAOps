const base = require('@playwright/test');
const {APiUtils} = require('./APiUtils.js');
const {request} = require('@playwright/test');

const loginPayLoad = { userEmail: 'rahulshettyw@gmail.com', userPassword: 'Learning@830$3mK3' };
const orderPayLoad = {
  orders: [{ country: 'India', productOrderedId: '6960eac0c941646b7a8b3e68' }]};

exports.customtest = base.test.extend({
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    try {
      const page = await context.newPage();
      await page.goto('https://rahulshettyacademy.com/client');
      await page.locator('#userEmail').fill(loginPayLoad.userEmail);
      await page.locator('#userPassword').fill(loginPayLoad.userPassword);
      await page.locator("[value='Login']").click();
      await page.waitForLoadState('networkidle');

      await use(page);
    } finally {
      await context.close();
    }
  },

  createOrder: async ({}, use) => {
    const apiContext = await request.newContext();
    try {
      const apiUtils = new APiUtils(apiContext, loginPayLoad);
      const response = await apiUtils.createOrder(orderPayLoad);
      await use(response);
    } finally {
      await apiContext.dispose();
    }
  },

  testDataForOrder: {
    productName: 'ADIDAS ORIGINAL'
  }
});
