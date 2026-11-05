/* Additional products use only the supplied Zurich brochure tables. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const money = n => `HK$ ${n.toLocaleString('en-HK', {minimumFractionDigits:2,maximumFractionDigits:2})}`;
  const HOME = [
    [500,400,1095,725],[700,560,1323,914],[1000,800,1751,1478],
    [1500,1200,2192,2218],[2000,1600,2594,2833],[2500,2000,3114,3472],
    [3000,2400,3717,4236],[3500,2800,4382,4999],[Infinity,Infinity,5178,5666]
  ];
  let active = 'travel';
  const savedQuotes = {};
  const templates = {
    travel: [
      ['旅遊保係咩？','你好！旅遊保主要係幫你分擔旅程中突發事故帶來嘅開支，例如意外或疾病醫療、行程受阻、行李等。你可以按目的地、旅程日數同同行人士選擇單次或全年計劃。實際保障、限額及不保事項以所選計劃條款為準。'],
      ['揀保障時留意乜？','睇旅遊保唔好只比較價錢，亦要比較海外醫療、緊急支援、取消行程、旅程延誤同行李保障嘅限額及索償條件。如果會玩運動、踩單車或坐郵輪，請預先話我知，等我幫你確認保障或附加保障。'],
      ['出發前溫馨提示','建議確認行程後及出發前安排旅遊保，並按要求如實申報。已知事故、投保前已存在嘅疾病或特定活動可能不受保。出發時記低保單及緊急支援電話，遇事保留收據同相關證明；如需緊急支援，先聯絡保險公司。'],
      ['報價前：請客人提供資料','你好！幫你比較旅遊保，麻煩提供：\n1. 目的地及途經地區\n2. 出發、回港日期\n3. 成人、小童及長者人數，以及各人年齡\n4. 單次定全年保障\n5. 會否參加運動、單車、郵輪或其他特別活動\n6. 想要嘅保障級別及特別需要\n先提供以上資料就可以初步報價，唔使傳證件副本。'],
      ['確認投保：資料清單','如想安排旅遊保，請先確認報價、計劃及保障日期。我會再按保險公司要求，透過指定安全渠道收集各受保人證件上英文姓名、出生日期、所需證件資料，以及投保人聯絡電話、電郵、地址和相關申報。全年／家庭計劃亦可能要確認家庭關係及每次旅程限制。請唔好喺一般訊息傳信用卡資料或驗證碼。']
    ],
    home: [
      ['家居保係咩？','你好！家居保主要照顧屋企嘅家居財物，以及住戶可能承擔嘅法律責任，業主同租客都可以按需要考慮。今次參考嘅係蘇黎世「自選家居保險計劃－住戶保險」標準計劃，保費按你選用嘅實用或建築面積計算。'],
      ['家居保包到啲咩？','呢個標準計劃嘅家居財物全年總保障額按面積分為 HK$750,000、HK$1,000,000 或 HK$1,250,000，法律責任全年限額 HK$10,000,000。另有臨時居所、部分電子產品維修等保障，但各項都有獨立限額及條件，唔代表任何損壞都包；自然損耗及機件故障等一般不受保。'],
      ['家居保同火險有咩分別？','家居保一般集中家居財物同住戶法律責任；俗稱「火險」嘅樓宇保險主要保障樓宇結構，按揭銀行可能有指定要求。兩者保障對象唔同，通常不能互相取代。呢個家居計劃可以另加樓宇意外損毀保障，但要按重建費用同銀行要求確認，唔可以直接當作已符合按揭火險要求。'],
      ['報價前：請客人提供資料','你好！幫你報家居保，麻煩提供：\n1. 物業地址／地區及物業類型\n2. 實用或建築面積（請註明用邊種）\n3. 樓齡、自住／出租／租住情況\n4. 希望生效日期\n5. 要唔要樓宇、車位／電動車充電設施責任保障\n6. 有冇貴重物品、藝術品或全球個人物品保障需要\n7. 過往索償、裝修或其他需要申報情況\n先提供報價資料即可，證件資料留待投保時透過安全渠道提交。'],
      ['確認投保：資料清單','如確認安排家居保，請核對計劃、保額、物業完整地址、面積及計算方式、生效日期和附加保障。投保人姓名、聯絡資料、所需證件資料、物業用途／樓齡及相關申報，會按正式投保表要求收集。如加樓宇保障，亦要確認重建費用及按揭銀行要求；貴重物品可能要另附清單及估值。請透過指定安全渠道提交敏感文件，唔使喺一般訊息傳信用卡資料。']
    ],
    helper: [
      ['家傭保係咩？','你好！僱用家庭傭工，僱主需要安排適用嘅僱員補償保險。綜合家傭保除咗僱主責任，亦可以包含家傭醫療、遣送及補聘等保障。海外家庭傭工綜合計劃同本地鐘點傭工僱員補償計劃唔同，我會先按你嘅僱用情況幫你分清楚。'],
      ['傭易保有啲咩保障？','按你提供嘅蘇黎世「傭易保」2021 年小冊子，綜合計劃包括每宗事故最高 HK$100,000,000 僱主責任、每保單年度 HK$80,000 住院、門診、補聘、遣送等保障。各項有分項限額、自負額及條件。本地鐘點傭工僱員補償計劃只包括僱主責任，唔包括綜合醫療等保障。'],
      ['等候期同附加保障','家傭醫療及牙齒保障一般有 15 日等候期；心臟病及癌症附加保障一般有 90 日等候期，詳情及例外按條款。附加標準／特級計劃年度限額分別為 HK$50,000／HK$100,000。投保前已存在傷疾等可能不受保，唔係一投保就所有病都包。現有保費資料係 2021 年版本，投保前要確認最新收費及承保要求。'],
      ['報價前：請客人提供資料','你好！幫你報家傭保，麻煩提供：\n1. 海外家庭傭工，定本地鐘點傭工\n2. 人數、各人年齡及國籍\n3. 工作職責（有冇駕駛或非家務工作）\n4. 合約開始日期及希望保障生效日期\n5. 想保一年定兩年\n6. 要唔要心臟病及癌症附加保障（標準／特級）\n7. 有冇曾被拒保、現有保險或需要申報嘅情況\n先提供以上資料作初步報價即可，唔使先傳證件副本。'],
      ['確認投保：資料清單','確認安排家傭保後，需按正式投保表提供：\n• 僱主英文姓名、中文姓名、出生日期、所需身份證／護照資料、電話及電郵\n• 通訊地址及家傭工作地址（須與僱傭合約地址一致）\n• 每位家傭英文姓名、出生日期、國籍及所需身份證／護照資料\n• 計劃、保障年期、附加保障及生效日期\n• 曾被拒保及非家務職責等申報，並按承保要求提供合約／其他文件\n申請人須為合法僱主。敏感文件請用指定安全渠道提供；付款另用正式渠道，請唔好傳信用卡號碼或驗證碼。']
    ]
  };
  const field = (id,label,control) => `<label class="field" for="${id}">${label}${control}</label>`;
  const check = (id,label) => `<label class="check-row"><input id="${id}" type="checkbox"><span>${label}</span></label>`;
  const homeFields = field('areaBasis','面積計算方式','<select id="areaBasis"><option value="saleable">實用面積</option><option value="gross">建築面積</option></select>') +
    field('homeArea','單位面積（平方呎）','<input id="homeArea" type="number" min="1" step="1" value="500" required inputmode="numeric">') +
    field('homeStart','預計保障生效日期（選填）','<input id="homeStart" type="date">') +
    '<h3>自選保障</h3>' + check('building','樓宇意外損毀保障') + check('parking','停車位法律責任（每年 HK$435）') + check('charger','停車位內電動車充電設施法律責任（每年 HK$1,014）') +
    '<p class="source-note">全球個人物品、私人藝術品及自訂保額計劃須個別報價，未納入自動計算。</p><p class="notice">小冊子未明示家居保費是否已含徵費，本頁只列保費表小計；最終應付金額及徵費須向保險公司確認。</p>';
  const helperFields = field('helperType','僱用及保障類型','<select id="helperType"><option value="comprehensive">海外家傭｜傭易保綜合計劃</option><option value="ec">本地鐘點家傭｜僱員補償計劃</option></select>') +
    field('helperYears','保障年期','<select id="helperYears"><option value="1">一年</option><option value="2">兩年</option></select>') +
    field('helperCount','受保家傭人數','<input id="helperCount" type="number" min="1" max="100" step="1" value="1" required inputmode="numeric">') +
    field('helperUpgrade','心臟病及癌症附加保障','<select id="helperUpgrade"><option value="none">不附加</option><option value="classic">標準計劃</option><option value="deluxe">特級計劃</option></select>') +
    field('helperStart','預計保障生效日期（選填）','<input id="helperStart" type="date">') +
    '<p class="source-note">多人報價按相同年期及附加保障逐人計算；投保時每位家傭須另填申請表。不同選擇請分開報價。</p><p class="notice">參考 2021 年保費表（文件列明已含徵費），並非已確認現行價。請先核實最新收費、承保資格及條款。</p>';
  const benefits = {
    home:'<li>法律責任：每年最高 HK$10,000,000。</li><li>家居財物：按面積每年最高 HK$750,000／1,000,000／1,250,000；另有每組／每件限額。</li><li>臨時居所總額：每次意外最高 HK$60,000；分項設每天限額。</li><li>電子產品維修：每部手機最高 HK$2,500；每部筆記型／平板電腦最高 HK$5,000，通常每年最多兩次。</li><li>多層大廈、樓齡40年或以下居所，家居財物標準自負額為零；並非所有項目均無自負額。</li><li>樓宇附加保障按重建費用；山泥傾瀉及地陷自負額為 HK$10,000 或經評定損失10%，以較高者為準。</li><li>自然損耗、機件故障、無法解釋的損失及違例僭建等不受保。</li>',
    helper:'<li>綜合計劃僱主責任：每宗事故最高 HK$100,000,000。</li><li>住院每保單年度最高 HK$80,000；房膳每日 HK$300、每次手術 HK$15,000；住院每宗索償自負額 HK$300。</li><li>非網絡門診每年最高 HK$3,000；網絡門診每年最多20次，按醫生類別設自負費。</li><li>補聘每年最高 HK$5,000；遣送每年最高 HK$10,000。</li><li>醫療及牙齒一般等候期15日；心臟病及癌症附加保障90日。投保前已存在傷疾等不受保。</li>'
  };
  for (const [key,title,subtitle,fields] of [
    ['home','家居保險','Zurich 自選家居保險計劃－住戶保險｜標準計劃',homeFields],
    ['helper','家傭保險','Zurich 傭易保／本地鐘點家傭僱員補償',helperFields]
  ]) {
    const section = document.createElement('main');
    section.id = `${key}Workspace`; section.className='workspace new-workspace'; section.hidden=true;
    section.innerHTML=`<form id="${key}Form" class="quote-form"><h2>${title}</h2><p class="intro">${subtitle}</p>${fields}<p id="${key}Error" class="error-message" role="alert" hidden></p></form><aside class="result-panel" aria-live="polite"><article id="${key}Quote" class="quote-paper"></article><div class="result-actions"><button type="button" class="secondary-button" data-copy-quote="${key}">複製報價文字</button><button type="button" class="dark-button" data-capture="${key}">截圖模式</button></div><section class="document-links"><div><h2>產品文件</h2><p>資料來源：${key==='home'?'ZHM-001-08-2026C-02，第2–3頁':'ZPP-003-04-2021，第3–4頁；投保表 ZDH-AGT-EF-07-2021'}</p></div><a href="documents/zurich-${key}.pdf" target="_blank" rel="noopener">保障及保費表 PDF</a>${key==='helper'?'<a href="documents/zurich-helper-form.pdf" target="_blank" rel="noopener">投保表及所需資料</a>':''}</section></aside>`;
    $('#travelWorkspace').after(section);
    section.querySelector('form').addEventListener('submit', e => e.preventDefault());
    section.querySelector('form').addEventListener('input', () => renderQuote(key));
    section.querySelector('form').addEventListener('change', () => renderQuote(key));
  }
  const messages = document.createElement('section'); messages.className='messages'; messages.id='messages';
  messages.innerHTML='<h2 id="messagesTitle">客戶 WhatsApp 訊息</h2><p class="intro">選一段、按需要修改，再複製到 WhatsApp。內容只喺本頁編輯，唔會自動傳送或儲存。</p><div class="message-grid" id="messageGrid"></div><p class="message-help">「火險」按一般樓宇保險解釋。範本係保障摘要，實際以正式保單及核保為準；投保資料須再按保險公司表格確認。</p><div id="copyStatus" class="copy-status" role="status" aria-live="polite"></div>';
  $('#captureToolbar').before(messages);
  const messageDrafts = {};
  function renderMessages() {
    $('#messagesTitle').textContent=`${{travel:'旅遊保',home:'家居保',helper:'家傭保'}[active]}｜客戶 WhatsApp 訊息`;
    $('#messageGrid').replaceChildren();
    templates[active].forEach(([title,text],i) => {
      const card=document.createElement('article'); card.className='message-card';
      const heading=document.createElement('h3'); heading.textContent=title;
      const textarea=document.createElement('textarea'); textarea.setAttribute('aria-label',title); textarea.value=messageDrafts[`${active}-${i}`]??text;
      const key=`${active}-${i}`; textarea.addEventListener('input',()=>{messageDrafts[key]=textarea.value;});
      const actions=document.createElement('div'); actions.className='message-actions';
      const copy=document.createElement('button'); copy.type='button'; copy.className='dark-button'; copy.textContent='複製 WhatsApp 文字'; copy.onclick=()=>copyText(textarea.value,copy);
      const reset=document.createElement('button'); reset.type='button'; reset.className='secondary-button'; reset.textContent='還原範本'; reset.onclick=()=>{textarea.value=text;delete messageDrafts[key];};
      actions.append(copy,reset); card.append(heading,textarea,actions); $('#messageGrid').append(card);
    });
    $('#copyStatus').textContent='';
  }
  async function copyText(text,button) {
    let ok=false;
    try { await navigator.clipboard.writeText(text); ok=true; } catch {
      const fallback=document.createElement('textarea'); fallback.value=text; fallback.style.position='fixed'; fallback.style.top='0'; document.body.append(fallback); fallback.focus();fallback.select();
      try {ok=document.execCommand('copy');} catch {} fallback.remove();
    }
    $('#copyStatus').textContent=ok?'已複製，可以貼到 WhatsApp。':'未能自動複製，請選取範本文字後手動複製。';
    if(ok){const label=button.textContent;button.textContent='已複製 ✓';setTimeout(()=>button.textContent=label,1800);}
  }
  function renderQuote(key) {
    const form=$(`#${key}Form`), error=$(`#${key}Error`), article=$(`#${key}Quote`);
    if(key==='helper') {
      const ec=$('#helperType').value==='ec';
      $('#helperYears').options[1].disabled=ec;
      if(ec){$('#helperYears').value='1';$('#helperUpgrade').value='none';}
      $('#helperUpgrade').disabled=ec;
    }
    if(!form.checkValidity()) {
      error.hidden=false; error.textContent='請輸入有效正整數（家傭人數上限100），並檢查日期。'; article.hidden=true;delete savedQuotes[key];return;
    }
    error.hidden=true;article.hidden=false;
    let title,facts=[],lines=[],total,note,summary;
    if(key==='home') {
      const area=Number($('#homeArea').value),gross=$('#areaBasis').value==='gross';
      const row=HOME.find(r=>area<=r[gross?0:1]);
      total=row[2]; lines.push(['標準計劃基本年保費',row[2]]);
      for(const [id,label,value] of [['building','樓宇附加保障',row[3]],['parking','停車位法律責任',435],['charger','電動車充電設施法律責任',1014]]) if($(`#${id}`).checked){total+=value;lines.push([label,value]);}
      const contents=area<=(gross?700:560)?750000:area<=(gross?1500:1200)?1000000:1250000;
      title='Zurich 家居保險參考報價';facts=[['計劃','住戶保險標準計劃'],['保障期','一年'],['面積',`${area} 平方呎（${gross?'建築':'實用'}）`],['預計生效日',$('#homeStart').value||'待確認']];
      summary=`家居財物每年總限額 ${money(contents)}；法律責任每年最高 HK$10,000,000。分項限額及自負額按條款。`;
      note='來源：ZHM-001-08-2026C-02 第2–3頁。金額為小冊子保費表小計；徵費是否已含未明示，最終應付金額、承保資格及保障須另行確認。全球個人物品／藝術品及自訂計劃未計入。';
    } else {
      const ec=$('#helperType').value==='ec',years=Number($('#helperYears').value),count=Number($('#helperCount').value),upgrade=$('#helperUpgrade').value;
      const base=ec?350:years===1?946:1798;
      const extra=ec||upgrade==='none'?0:(upgrade==='classic'?150:300)*years;
      title='Zurich 家傭保險參考報價'; total=(base+extra)*count;
      facts=[['計劃',ec?'本地鐘點家傭僱員補償':'傭易保綜合計劃'],['保障期',`${years} 年`],['家傭人數',`${count} 位`],['預計生效日',$('#helperStart').value||'待確認']];
      lines.push([`基本保費（每位 ${money(base)} × ${count}）`,base*count]);
      if(extra)lines.push([`心臟病及癌症${upgrade==='classic'?'標準':'特級'}（每位 ${money(extra)} × ${count}）`,extra*count]);
      summary=ec?'只包括僱主責任：每宗事故最高 HK$100,000,000，不包括醫療、補聘及其他綜合保障。':'僱主責任每宗事故最高 HK$100,000,000；住院每年最高 HK$80,000，另設分項限額及自負額。醫療／牙齒一般等候期15日。';
      if(extra) summary+=` 心臟病及癌症附加保障每保單年度最高 ${money(upgrade==='classic'?50000:100000)}，一般等候期90日。`;
      note='來源：ZPP-003-04-2021 第3–4頁。2021年歷史文件參考價，文件列明已包括保險徵費。現行保費、徵費及承保要求須向保險公司核實；本頁並非正式承保確認。';
    }
    article.replaceChildren();
    const header=document.createElement('header');header.className='quote-paper__header';const h2=document.createElement('h2');h2.textContent=title;header.append(h2);article.append(header);
    const dl=document.createElement('dl');dl.className='quote-facts';for(const [label,value] of facts){const div=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;div.append(dt,dd);dl.append(div);}article.append(dl);
    const prices=document.createElement('div');prices.className='quote-lines';for(const [label,value] of lines){const div=document.createElement('div'),span=document.createElement('span'),strong=document.createElement('strong');span.textContent=label;strong.textContent=money(value);div.append(span,strong);prices.append(div);}article.append(prices);
    const totals=document.createElement('div');totals.className='totals';totals.innerHTML=`<div class="grand-total"><span>${key==='home'?'年保費表小計':'全期參考保費（已含徵費）'}</span><strong>${money(total)}</strong></div>`;article.append(totals);
    const desc=document.createElement('p');desc.className='disclaimer';desc.textContent=summary;article.append(desc);
    const details=document.createElement('details');details.className='disclaimer';details.innerHTML=`<summary>主要保障及注意事項</summary><ul class="benefits">${key==='helper'&&$('#helperType').value==='ec'?'<li>本地鐘點家傭計劃只包括僱主責任，每宗事故最高 HK$100,000,000。</li>':benefits[key]}</ul>`;article.append(details);
    const disclaimer=document.createElement('p');disclaimer.className='disclaimer';disclaimer.textContent=note+' 實際以正式保單條款為準。';article.append(disclaimer);
    const footer=document.createElement('footer');footer.className='quote-paper__footer';footer.textContent=`報價日期 ${new Date().toLocaleDateString('zh-HK',{timeZone:'Asia/Hong_Kong'})} · 金額為港幣 · 文件參考價`;article.append(footer);
    savedQuotes[key]=[title,...facts.map(([a,b])=>`${a}：${b}`),...lines.map(([a,b])=>`${a}：${money(b)}`),`${key==='home'?'年保費表小計':'全期參考保費（已含徵費）'}：${money(total)}`,summary,note,footer.textContent].join('\n');
  }
  document.querySelectorAll('[data-product]').forEach(button=>button.addEventListener('click',()=>{
    active=button.dataset.product;
    document.querySelectorAll('[data-product]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    for(const key of ['travel','home','helper'])$(`#${key}Workspace`).hidden=active!==key;
    $('#resetButton').hidden=active!=='travel';renderMessages();
  }));
  document.querySelectorAll('[data-copy-quote]').forEach(b=>b.addEventListener('click',()=>{const key=b.dataset.copyQuote;renderQuote(key);if(savedQuotes[key])copyText(savedQuotes[key],b);else $(`#${key}Error`).scrollIntoView({block:'center'});}));
  document.querySelectorAll('[data-capture]').forEach(b=>b.addEventListener('click',()=>{const key=b.dataset.capture;renderQuote(key);if(!savedQuotes[key])return;document.body.classList.add('capture-mode');$('#captureToolbar').hidden=false;window.scrollTo({top:0,behavior:'instant'});}));
  renderQuote('home');renderQuote('helper');renderMessages();
})();
