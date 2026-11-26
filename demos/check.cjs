const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {join} = require('node:path');
const vm = require('node:vm');

const site = join(__dirname, '..');
const read = path => readFileSync(join(site, path), 'utf8');
const context = vm.createContext({});
context.self = context;
context.window = context;
vm.runInContext(read('vendor/react.production.min.js'), context);
vm.runInContext(read('demos/interactive.js'), context);
const demo = context.RuopanDemo;
const plain = value => JSON.parse(JSON.stringify(value));

test('four deep links, two rule views, connected graphs and visible labels', () => {
  const html = read('index.html');
  assert.equal(demo.studies.length, 4);
  assert.equal(demo.studies.flatMap(s => s.graphs).length, 5);
  for (const s of demo.studies) {
    assert.ok(html.includes('id="demo-' + s.id + '" data-view'));
    assert.ok(html.includes('href="#demo-' + s.id + '"'));
    assert.ok(html.includes('id="' + s.project + '" data-view'));
    for (const g of s.graphs) {
      const ids = new Set(g.nodes.map(n => n.id));
      assert.equal(ids.size, g.nodes.length);
      assert.deepEqual(plain(g.rows.flat().sort()), Array.from(ids).sort());
      for (const [a,b] of g.edges) assert.ok(ids.has(a) && ids.has(b) && a !== b);
      const orderedRows = new Map(g.rows.flatMap((row,i) => row.map(id => [id,i])));
      for (const [a,b] of g.edges) assert.ok(orderedRows.get(a) < orderedRows.get(b));
      for (const n of g.nodes) {
        assert.ok(n.label.every(Boolean) && n.note.every(Boolean));
        assert.ok(g.edges.some(e => e.includes(n.id)));
      }
    }
  }
  assert.ok(html.includes(demo.badge));
});

test('period returns weight by spend for both platforms; zero spend has no ratio', () => {
  for (const channel of ['tiktok','shopee']) {
    const rows = demo.adScenarios[0].figures[channel];
    const p = demo.periodTotals(rows,2);
    assert.equal(p.ratio,(rows[0][3]+rows[1][3])/(rows[0][2]+rows[1][2]));
    assert.notEqual(p.ratio,(rows[0][3]/rows[0][2]+rows[1][3]/rows[1][2])/2);
  }
  assert.equal(demo.periodTotals([[0,17,0,22]],0).ratio,null);
});

test('revision window and missing inventory independently veto adoption', () => {
  const [a,b,c] = demo.adScenarios;
  assert.equal(demo.assessAd(a).days,28);
  assert.equal(demo.assessAd(a).mayAdopt,true);
  assert.equal(demo.assessAd(b).grade,'warn');
  assert.equal(demo.assessAd(c).grade,'bad');
  for (const override of [{synced:false},{mapped:false},{available:null},{available:0},{available:100},{velocity:0}]) {
    assert.equal(demo.assessAd({...a,...override}).mayAdopt,false);
  }
  assert.equal(demo.periodTotals(c.figures.tiktok,2).ratio,5.2);
});

test('rule translator allowlist, strict elapsed boundary and regional scope', () => {
  for (const lang of [0,1]) {
    const r = demo.translateRule(demo.ruleExamples.approval[lang]);
    assert.equal(demo.runTrial(r).length,3);
    assert.equal(demo.runTrial(r).some(d => d.hours === 24),false);
    assert.equal(demo.runTrial(r,[{...demo.trialDocs[0],region:'EU'}]).length,0);
    assert.equal(demo.runTrial(demo.translateRule(demo.ruleExamples.approval[lang].replace('24','48'))).length,1);
    assert.equal(demo.translateRule(demo.ruleExamples.approval[lang].replace('24','0')),null);
  }
  assert.equal(demo.translateRule('任意 SQL 并直接发送通知'),null);
});

test('replica trial includes partial balances; primary settlement suppresses a send', () => {
  const rule = demo.translateRule(demo.ruleExamples.payment[0]);
  const hits = demo.runTrial(rule);
  assert.equal(hits.length,3);
  assert.equal(hits.some(d => d.replica === 'PAID' || d.hours <= 0),false);
  const plan = demo.deliveryPlan(rule,hits);
  assert.equal(plan.send.length,2);
  assert.equal(plan.skip[0].id,'PAY-DEMO-SEA-003');
  assert.equal(demo.runTrial(rule,[]).length,0);
});

test('support scripts isolate shop identity, preserve debounce, uncertainty and red-line handoff', () => {
  const [normal,blur,red] = demo.chatScripts;
  assert.ok(demo.chatScripts.every(s => s.shop.startsWith('SHOP-DEMO-')));
  assert.equal(normal.steps.slice(0,3).flatMap(s=>s.messages).filter(m=>m.who==='buyer').length,3);
  assert.ok(normal.steps[3].tool.includes('6 s'));
  assert.equal(normal.steps[4].model,'P-DEMO-M1');
  assert.ok(normal.steps.flatMap(s=>s.messages).some(m=>m.art==='guide'));
  assert.ok(blur.steps.every(s=>s.model===null));
  assert.equal(blur.steps.at(-1).messages[0].who,'draft');
  const interrupted = red.steps.slice(red.steps.findIndex(s => s.risk === 'red'));
  assert.ok(interrupted.length>0 && interrupted.every(s=>s.risk==='red'));
  assert.ok(interrupted.flatMap(s=>s.messages).every(m=>m.who!=='agent'));
});

test('field checks reject bad check digits, counterfeit matching totals and unsigned sensitive fields', () => {
  const raw = demo.initialFields();
  const checked = {};
  assert.deepEqual([demo.reviewStatus(raw,checked).conflicts,demo.reviewStatus(raw,checked).pending],[2,2]);
  assert.ok(demo.validContainer('CSQU3054383'));
  assert.ok(demo.validContainer('DEMU0000891'));
  assert.equal(demo.validContainer('DEMU0000898'),false);
  assert.equal(demo.isoDigit('DEMX000089'),null);
  assert.equal(demo.numeric('8,8,00').toString(),'NaN');
  const correct=Object.fromEntries(demo.docFields.map(f=>[f.key,f.source]));
  assert.equal(demo.mappingPreview(correct,checked),null);
  checked.discharge=true; checked.packages=true;
  assert.equal(demo.mappingPreview(correct,checked).customer.weight_kg,8000);
  assert.equal(demo.mappingPreview({...correct,weightA:'5800',gross:'9000'},checked),null);
  assert.equal(demo.mappingPreview({...correct,container:'CSQU3054383'},checked),null);
});

test('all nine drawing boxes are inside the synthetic source canvas', () => {
  const fields = demo.docFields;
  assert.equal(new Set(fields.map(f=>f.key)).size,9);
  for(const f of fields) {
    const [x,y,w,h]=f.box;
    assert.ok(x>=0 && y>=0 && x+w<=580 && y+h<=680);
  }
});
