namespace RuopanDemo {
  interface DecisionLog {id:number;event:'adopt'|'bypass';sku:string;site:string;channel:Channel;scenario:string}
  const fmt=(n:number)=>n.toLocaleString('en-US',{maximumFractionDigits:2});
  export function Advertising() {
    const t=useWords();
    const [index,choose]=React.useState(0),[channel,setChannel]=React.useState<Channel>('tiktok');
    const [logs,setLogs]=React.useState<DecisionLog[]>([]);
    const s=adScenarios[index],decision=assessAd(s),rows=s.figures[channel],metric=channel==='tiktok'?'ROI':'ROAS';
    const totals=[periodTotals(rows,0),periodTotals(rows,2)];
    const adopted=logs.some(l=>l.sku===s.sku&&l.channel===channel&&l.event==='adopt');
    const record=(event:DecisionLog['event'])=>setLogs(prev=>{
      if((event==='adopt'&&(!decision.mayAdopt||prev.some(l=>l.sku===s.sku&&l.channel===channel&&l.event===event)))||(event==='bypass'&&decision.grade!=='bad'))return prev;
      return [{id:(prev[0]?.id||0)+1,event,sku:s.sku,site:s.site,channel,scenario:s.id},...prev];});
    return <div className="dx-stack"><div className="dx-options">{adScenarios.map((item,i)=><button key={item.id} type="button" aria-pressed={i===index} onClick={()=>choose(i)}>{item.id} · {t(...item.name)}</button>)}</div>
      <div className="dx-grid"><div className="dx-stack"><Panel title={t('两期投放复盘','Two-period ad review')}>
        <label className="dx-labelrow">{t('渠道与口径','Channel & metric')}<select value={channel} onChange={e=>setChannel(e.target.value as Channel)}>{Object.entries(channelLabels).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label>
        <p className="dx-id">{s.site} · {s.sku} · THB</p>
        <table className="dx-table"><caption>{t('每期先汇总归因收入和花费，再相除。金额单位为泰铢。','Divide attributed revenue by spend after summing each period. All amounts in THB.')}</caption><thead><tr>{[t('周期','Period'),t('花费','Spend'),t('归因收入','Revenue'),metric].map(v=><th key={v}>{v}</th>)}</tr></thead><tbody>{totals.map((p,i)=><tr key={i}><th>{t(i?'本期':'上期',i?'Current':'Prior')}<small>{adPeriods[i]}</small></th><td>{fmt(p.spend)}</td><td>{fmt(p.revenue)}</td><td>{p.ratio?.toFixed(2)??'—'}</td></tr>)}</tbody></table>
        <details className="dx-details"><summary>{t('查看两期底层明细','Inspect the underlying rows')}</summary><table className="dx-table"><thead><tr><th>{t('明细','Line')}</th><th>{t('上期花费 / 收入','Prior spend / revenue')}</th><th>{t('本期花费 / 收入','Current spend / revenue')}</th></tr></thead><tbody>{rows.map((r,i)=><tr key={i}><th>AD-DEMO-0{i+1}</th><td>{fmt(r[0])} / {fmt(r[1])}</td><td>{fmt(r[2])} / {fmt(r[3])}</td></tr>)}</tbody></table></details>
        </Panel><Panel title={t('可售库存与建议','Stock & recommendation')}>
        <Status tone={decision.grade}>{t('工程置信度','Engineering confidence')} · {t(...({good:['高','High'],warn:['中','Medium'],bad:['低','Low']} as Record<Tone,Words>)[decision.grade])}</Status>
        <dl className="dx-facts"><div><dt>{t('在库 / 可售','On hand / sellable')}</dt><dd>{s.book} / {s.available??t('未核准','Unverified')}</dd></div><div><dt>{t('日均销量 / 预计可售','Daily sales / cover')}</dt><dd>{s.velocity} / {decision.days===null?'—':decision.days+' '+t('天','days')}</dd></div></dl>
        {decision.grade==='good'?<><p>{t('数据已同步，T+1 回刷结束，站点库存核验通过。建议小幅增加预算，由运营执行。','Data is synced, the T+1 window has closed and site stock is verified. A modest increase is eligible for operator execution.')}</p><button className="dx-primary" disabled={adopted} onClick={()=>record('adopt')}>{adopted?t('已采纳','Adopted'):t('采纳','Adopt')}</button></>:
        decision.grade==='warn'?<div className="dx-callout dx-warn"><strong>{t('T+1 回刷中 · 保守观察','T+1 revision window · observe')}</strong><p>{t('演示假设：本期归因收入可能回刷 ±2%，花费不变。','Demo assumption: attributed revenue may revise by ±2% at fixed spend.')} {metric} {(totals[1].ratio!*0.98).toFixed(2)}–{(totals[1].ratio!*1.02).toFixed(2)}。</p></div>:
        <div className="dx-callout dx-bad"><strong>{t('已拦截 · 组合 SKU 映射缺失','On hold · missing bundle mapping')}</strong><p>{t('本站点可售量尚未核准。即使回报高，也无法生成放量建议。','Sellable units for this site are unverified. Higher returns cannot clear this hold.')}</p><button onClick={()=>record('bypass')}>{t('模拟业务强行绕过（记录周复盘留痕）','Simulate an operator bypass · log for review')}</button></div>}
        </Panel></div>
        <Panel title={t('周复盘留痕','Weekly review log')}><p className="dx-muted">{t('仅记录本次演示中的人工决定。预算不会自动执行。','These entries record this demo’s operator decisions. Budget changes are manual.')}</p>
        <div aria-live="polite">{logs.length===0?<p className="dx-empty">{t('尚无操作记录','No decisions recorded yet.')}</p>:<ol className="dx-log">{logs.map(l=><li key={l.id}><strong>{l.event==='bypass'?t('业务绕过 · 待周复盘','Business bypass · review due'):t('建议已采纳 · 待人工执行','Adopted · pending execution')}</strong><small>{'LOG-DEMO-'+String(l.id).padStart(3,'0')} · {l.site} · {l.sku}</small><small>{channelLabels[l.channel]} · {t('场景','Scenario')} {l.scenario}</small>{l.event==='bypass'&&<small>{t('原因：库存映射未核准，交运营与 IT 复核。','Reason: mapping unverified. Operations and IT review required.')}</small>}</li>)}</ol>}</div></Panel></div></div>;
  }
}
