// Isolated, empty browser contexts. The site runs from disk, with no login or server.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {fileURLToPath} from 'node:url';

const site = new URL('../index.html',import.meta.url);
const browser = await chromium.launch();
const failures=[];
const sizes=[[320,720],[390,844],[768,1024],[1280,900]];
async function checkWidth(page,name,width){
  const outside=await page.evaluate(()=>({
    screen:document.documentElement.clientWidth,page:document.documentElement.scrollWidth,
    parts:[...document.querySelectorAll('.dx-page:not([hidden]) :is(button,textarea,input,table,pre,svg,.dx-panel)')].filter(el=>{
      if(!el.getClientRects().length)return false;
      const r=el.getBoundingClientRect(); return r.left< -1 || r.right>document.documentElement.clientWidth+1;
    }).map(el=>el.tagName+' '+el.className).slice(0,8)
  }));
  assert.ok(outside.page<=outside.screen+1 && !outside.parts.length,name+' at '+width+'px: '+JSON.stringify(outside));
}
try {
  for(const [width,height] of sizes){
    const context=await browser.newContext({viewport:{width,height},isMobile:width<600,hasTouch:width<600});
    const page=await context.newPage();
    page.on('pageerror',error=>failures.push(error.message));
    await page.goto(site.href+'#demos');
    await page.locator('.dx-hub-card').first().waitFor();
    assert.equal(await page.locator('.dx-hub-card .dx-badge').count(),4);
    await checkWidth(page,'index',width);
    for(const id of ['ads','rules','support','documents']){
      await page.goto(site.href+'#demo-'+id);
      const current=page.locator('#demo-'+id);
      await current.locator('.dx-node').first().waitFor();
      await checkWidth(page,id+' architecture',width);
      await current.locator('.dx-node').first().click();
      await current.locator('dialog[open]').waitFor();
      await page.keyboard.press('Escape');
      if(id==='rules'){
        await current.getByRole('button',{name:'Dify 管控台与权限',exact:true}).click();
        assert.ok(await current.getByRole('button',{name:/飞书组织架构/}).isVisible());
        await checkWidth(page,'Dify',width);
      }
      await current.getByRole('tab',{name:'可操作核心原型'}).click();
      if(id==='ads'){
        const channel=current.getByLabel('渠道与口径');
        await channel.selectOption('shopee');
        assert.ok(await current.getByText(/站点 ROAS 复盘的需求与口径/).isVisible());
        assert.equal(await current.getByRole('button',{name:'采纳',exact:true}).count(),0);
        await channel.selectOption('tiktok');
        await current.getByRole('button',{name:'采纳',exact:true}).click();
        await current.getByRole('button',{name:/B · 中可信/}).click();
        assert.ok(await current.getByText(/±2%/).isVisible());
        assert.ok(await current.getByText('AD-DEMO-01').isVisible());
        await current.getByRole('button',{name:/C · 低可信/}).click();
        assert.equal(await current.getByRole('button',{name:'采纳',exact:true}).count(),0);
        await current.getByRole('button',{name:/模拟业务强行绕过/}).click();
        assert.equal(await current.locator('.dx-log li').count(),2);
      }
      if(id==='rules'){
        await current.getByRole('button',{name:/示例二/}).click();
        await current.getByRole('button',{name:'转译并试跑'}).click();
        assert.equal(await current.locator('.dx-records li').count(),3);
        await current.getByRole('button',{name:'核对原单',exact:false}).first().click();
        await current.locator('dialog[open]').waitFor();await page.keyboard.press('Escape');
        await current.getByRole('button',{name:'确认规则并模拟扫描'}).click();
        assert.equal(await current.locator('.dx-message-card').count(),2);
        await current.getByRole('button',{name:'有用',exact:true}).first().click();
      }
      if(id==='support'){
        for(const [i,count] of [[1,7],[2,4],[3,4]]){
          await current.getByRole('button',{name:new RegExp('^'+i+' ·')}).click();
          await current.getByRole('button',{name:'暂停',exact:true}).click();
          for(let j=1;j<count;j++)await current.getByRole('button',{name:'下一步'}).click();
          if(i===1)assert.ok(await current.locator('[data-demo-paper-guide], .dx-who-agent svg').last().isVisible());
          if(i===3)assert.ok(await current.getByText(/尚未承诺退款/).isVisible());
        }
      }
      if(id==='documents'){
        const write=current.getByRole('button',{name:'确认经 API 写入系统'});
        assert.ok(await write.isDisabled());
        await current.locator('#dx-field-container').fill('DEMU0000891');
        await current.locator('#dx-field-gross').fill('8000');
        assert.equal(await current.locator('#demo-source-gross').getAttribute('aria-pressed'),'true');
        const scan=await current.locator('.dx-scan').boundingBox(), box=await current.locator('#demo-source-gross').boundingBox();
        assert.ok(box.y>=scan.y-2 && box.y+box.height<=scan.y+scan.height+2,'Selected source field outside its scan pane');
        for(const cb of await current.getByRole('checkbox').all())await cb.check();
        assert.ok(await write.isEnabled());await write.click();
        assert.ok(await current.getByText(/"weight_kg": 8000/).isVisible());
      }
      await checkWidth(page,id+' prototype',width);
    }
    await page.goBack();await page.locator('#demo-support:not([hidden])').waitFor();
    await page.locator('#rp-theme').click();
    await page.locator('[data-language]').click();
    await page.locator('html[lang^="en"]').waitFor({state:'attached'});
    await page.goto(site.href+'#demos');
    await page.getByRole('heading',{name:'Ad spend & sellable stock'}).waitFor();
    await checkWidth(page,'English dark theme index',width);
    await page.goto(site.href+'#demo-rules');
    await page.getByRole('tab',{name:'Working prototype'}).click();
    await page.getByRole('button',{name:'Translate & dry-run'}).click();
    assert.equal(await page.locator('.dx-records li').count(),3);
    await checkWidth(page,'English dark theme rule trial',width);
    await context.close(); console.log(width+'px passed');
  }
  assert.deepEqual(failures,[]);
  console.log('Verified '+fileURLToPath(site));
} finally {await browser.close();}
