const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8000/index.html');
 await page.locator('[data-product=home]').click();
 const price=()=>page.locator('#homeQuote .grand-total strong').innerText();
 assert.equal(await price(),'HK$ 1,323.00');
 const rows=[[400,1095],[401,1323],[560,1323],[561,1751],[800,1751],[801,2192],[1200,2192],[1201,2594],[1600,2594],[1601,3114],[2000,3114],[2001,3717],[2400,3717],[2401,4382],[2800,4382],[2801,5178]];
 for(const [area,expected] of rows){await page.locator('#homeArea').fill(String(area));assert.equal(await price(),`HK$ ${expected.toLocaleString('en-HK')}.00`);}
 await page.locator('#areaBasis').selectOption('gross');
 for(const [area,expected] of [[500,1095],[501,1323],[700,1323],[701,1751],[1000,1751],[1001,2192],[1500,2192],[1501,2594],[2000,2594],[2001,3114],[2500,3114],[2501,3717],[3000,3717],[3001,4382],[3500,4382],[3501,5178]]){await page.locator('#homeArea').fill(String(area));assert.equal(await price(),`HK$ ${expected.toLocaleString('en-HK')}.00`);}
 await page.locator('#homeArea').fill('500');for(const id of ['building','parking','charger'])await page.locator('#'+id).check();assert.equal(await price(),'HK$ 3,269.00');
 await page.locator('#homeArea').fill('0');assert.equal(await page.locator('#homeQuote').isVisible(),false);assert.equal(await page.locator('#homeError').isVisible(),true);
 await page.locator('#homeArea').fill('500');
 await page.locator('[data-product=helper]').click();
 const hp=()=>page.locator('#helperQuote .grand-total strong').innerText();
 assert.equal(await hp(),'HK$ 946.00');
 for(const [years,upgrade,expected] of [['1','classic',1096],['1','deluxe',1246],['2','none',1798],['2','classic',2098],['2','deluxe',2398]]){await page.locator('#helperYears').selectOption(years);await page.locator('#helperUpgrade').selectOption(upgrade);assert.equal(await hp(),`HK$ ${expected.toLocaleString('en-HK')}.00`);}
 await page.locator('#helperCount').fill('2');assert.equal(await hp(),'HK$ 4,796.00');
 await page.locator('#helperType').selectOption('ec');assert.equal(await hp(),'HK$ 700.00');assert.equal(await page.locator('#helperYears').inputValue(),'1');assert.equal(await page.locator('#helperUpgrade').isDisabled(),true);
 await page.locator('#helperCount').fill('1.5');assert.equal(await page.locator('#helperError').isVisible(),true);await page.locator('#helperCount').fill('1');
 await page.locator('[data-capture=helper]').click();assert.equal(await page.locator('#messages').isVisible(),false);assert.equal(await page.locator('#helperQuote').isVisible(),true);assert.equal(await page.locator('#homeWorkspace').isVisible(),false);await page.locator('#exitCaptureButton').click();
 assert.equal(await page.locator('.message-card').count(),5);await page.locator('.message-card textarea').first().fill('測試編輯');await page.locator('[data-product=home]').click();await page.locator('[data-product=helper]').click();assert.equal(await page.locator('.message-card textarea').first().inputValue(),'測試編輯');
 await page.locator('.message-card .dark-button').first().click();await page.waitForTimeout(200);assert.match(await page.locator('#copyStatus').innerText(),/已複製/);
 await page.locator('[data-product=travel]').click();
 await page.locator('#tripDays').fill('5');await page.waitForTimeout(500);assert.equal(await page.locator('#quoteResult').isVisible(),true);assert.match(await page.locator('#grandTotal').innerText(),/\d/);
 await page.locator('input[name=insurer][value=msig]').check({force:true});await page.waitForTimeout(500);assert.equal(await page.locator('#quoteResult').isVisible(),true);console.log('MSIG total',await page.locator('#grandTotal').innerText());
 await page.setViewportSize({width:390,height:844});await page.locator('[data-product=home]').click();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.screenshot({path:'/workspace/GI/mobile-check.png',fullPage:true});
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: all home tiers/boundaries, add-ons, helper combinations, validation, screenshot mode, templates/copy, travel Zurich/MSIG, mobile layout.');
})().catch(e=>{console.error(e);process.exit(1)});
