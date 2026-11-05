const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>{window.copiedText=text;}}}));
 await page.goto('http://127.0.0.1:8000/index.html');
 for(const product of ['home','helper']){
  await page.locator(`[data-product=${product}]`).click();
  const discounts=page.locator(`input[name=${product}Discount]`);
  const total=page.locator(`#${product}Quote .grand-total strong`);
  const base=product==='home'?1323:946;
  const format=n=>'HK$ '+n.toLocaleString('en-HK',{minimumFractionDigits:2,maximumFractionDigits:2});
  for(const [i,rate] of [0.9,0.85,0.8,0.75,0.7,0.8].entries()){
   await discounts.nth(i).check({force:true});assert.equal(await total.innerText(),format(Math.round(base*rate*100)/100));await discounts.nth(i).uncheck({force:true});
  }
  await discounts.nth(0).check({force:true});await discounts.nth(2).check({force:true});
  assert.equal(await total.innerText(),format(Math.round(base*.72*100)/100));
  assert.match(await page.locator(`#${product}DiscountSummary`).innerText(),/72%/);
  await page.locator(`[data-copy-quote=${product}]`).click();
  let copied=await page.evaluate(()=>window.copiedText);assert.match(copied,/九折 × 八折/);assert.ok(!copied.includes('主要保障內容'));
  await page.locator(`#${product}BenefitToggle`).check({force:true});
  assert.equal(await page.locator(`#${product}BenefitSummary`).isVisible(),true);
  await page.locator(`[data-copy-quote=${product}]`).click();copied=await page.evaluate(()=>window.copiedText);assert.match(copied,/主要保障內容/);assert.ok(copied.includes(await total.innerText()));
  await page.locator(`[data-capture=${product}]`).click();assert.equal(await page.locator(`#${product}BenefitSummary`).isVisible(),true);assert.equal(await page.locator(`#${product}BenefitControl`).isVisible(),false);await page.locator('#exitCaptureButton').click();
  if(product==='home'){
   await page.locator('#building').check();assert.match(await page.locator('#homeBenefitSummary').innerText(),/樓宇意外損毀（已選）/);assert.equal(await total.innerText(),format(Math.round((1323+914)*.72*100)/100));
   await page.locator('#homeArea').fill('1201');assert.match(await page.locator('#homeBenefitSummary').innerText(),/1,250,000/);
  }else{
   await page.locator('#helperYears').selectOption('2');await page.locator('#helperUpgrade').selectOption('deluxe');await page.locator('#helperCount').fill('2');assert.equal(await total.innerText(),'HK$ 3,453.12');assert.match(await page.locator('#helperBenefitSummary').innerText(),/100,000.00/);
   await page.locator('#helperType').selectOption('ec');assert.equal(await total.innerText(),'HK$ 504.00');assert.equal(await page.locator('#helperBenefitSummary .benefit-rows>div').count(),3);assert.doesNotMatch(await page.locator('#helperBenefitSummary').innerText(),/住院保障/);
  }
  await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.locator(`#${product}Quote`).screenshot({path:`/workspace/${product}-benefits-check.png`});await page.setViewportSize({width:1280,height:900});
 }
 await page.locator('[data-product=travel]').click();assert.equal(await page.locator('input[name=discount]:checked').count(),0);assert.equal(await page.locator('#grandTotal').innerText(),'HK$380.00');
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: both products, all six discounts, compounded discounts, add-ons, multi-helper two-year plan, EC isolation, benefit toggles, copy/capture, mobile and travel isolation.');
})().catch(e=>{console.error(e);process.exit(1)});
