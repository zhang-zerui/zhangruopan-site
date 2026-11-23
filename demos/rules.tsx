namespace RuopanDemo {
  type MonitorMode='normal'|'zero'|'failure';
  type Feedback='up'|'down';
  function SourcePreview({doc,close}:{doc:SourceDoc;close:()=>void}) {
    const t=useWords();
    return <Modal title={t('核对模拟原单','Inspect synthetic document')} close={close}><Badge/><h4>{doc.id}</h4><dl className="dx-facts">
      <div><dt>{t('负责人','Owner')}</dt><dd>{doc.owner}</dd></div><div><dt>{t('从库快照','Replica snapshot')}</dt><dd>{t(...billStates[doc.replica])}</dd></div>
      <div><dt>{t('主库当前值','Current primary')}</dt><dd>{t(...billStates[doc.primary])}</dd></div><div><dt>{t('待审 / 逾期时长','Pending / overdue for')}</dt><dd>{doc.hours} h</dd></div></dl></Modal>;
  }
  export function Rules() {
    const t=useWords(),lang=React.useContext(Locale);
    const [draft,write]=React.useState(t(...ruleExamples.approval));
    const [rule,setRule]=React.useState<Rule|null>(null),[error,fail]=React.useState(false),[confirmed,confirm]=React.useState(false);
    const [mode,setMode]=React.useState<MonitorMode>('normal'),[retried,retry]=React.useState(false);
    const [opened,open]=React.useState<SourceDoc|null>(null),[votes,vote]=React.useState<Record<string,Feedback>>({});
    const prevLang=React.useRef(lang);
    React.useEffect(()=>{if(prevLang.current!==lang){write(current=>{
      const known=(Object.keys(ruleExamples) as RuleKind[]).find(k=>ruleExamples[k].includes(current));return known?t(...ruleExamples[known]):current;
    });prevLang.current=lang;}},[lang]);
    function reset(){setRule(null);fail(false);confirm(false);retry(false);vote({});open(null);}
    function change(value:string){write(value);reset();}
    function dryRun(){const parsed=translateRule(draft);setRule(parsed);fail(!parsed);confirm(false);retry(false);vote({});open(null);}
    const hits=rule?runTrial(rule,mode==='zero'?[]:trialDocs):[];
    const plan=rule?deliveryPlan(rule,hits):{send:[],skip:[]};
    const failed=confirmed&&mode==='failure'&&!retried?plan.send[0]?.id:null;
    const delivered=confirmed?plan.send.filter(doc=>doc.id!==failed):[];
    function cast(id:string,value:Feedback){vote(v=>({...v,[id]:value}));}
    return <div className="dx-stack"><div className="dx-options">{(['approval','payment'] as const).map(k=><button key={k} aria-pressed={ruleExamples[k].includes(draft)} onClick={()=>change(t(...ruleExamples[k]))}>{k==='approval'?t('示例一 · 新品审批','Example 1 · approval'):t('示例二 · 物流尾款','Example 2 · freight payment')}</button>)}</div>
      <div className="dx-panel"><label className="dx-block-label" htmlFor="dx-rule-sentence">{t('你想在什么情况下提醒谁？','Who should be notified, and when?')}</label>
        <textarea id="dx-rule-sentence" rows={2} value={draft} onChange={e=>change(e.target.value)}/><p className="dx-muted">{t('本地转译器支持上面两种句式。审批等待时长可改为 1–720 小时。','The local translator supports these two patterns. The approval threshold accepts 1–720 hours.')}</p>
        <div className="dx-controls"><label>{t('监控样例','Monitor sample')} <select value={mode} onChange={e=>{setMode(e.target.value as MonitorMode);reset();}}>
          <option value="normal">{t('正常扫描','Normal scan')}</option><option value="zero">{t('预期有单但 0 命中','Unexpected zero hits')}</option><option value="failure">{t('首条发送失败','First delivery fails')}</option>
        </select></label><button className="dx-primary" onClick={dryRun}>{t('转译并试跑','Translate & dry-run')}</button></div>
        {error&&<p role="alert" className="dx-callout dx-bad">{t('这句话未通过受控规则校验。请选择一种示例句式后修改；本次未生成规则。','This input failed the bounded rule validator. Start from one of the example sentences.')}</p>}
      </div>
      {rule&&<><div className="dx-three"><Panel title={t('受控 JSON DSL','Validated JSON DSL')}><pre>{JSON.stringify(rule,null,2)}</pre></Panel>
        <Panel title={t('反译与试跑原单','Read-back & evidence')}><p>{t(...readBack(rule))}</p><p className="dx-label">{t('从库命中','Replica matches')} · {hits.length}</p>
          <ul className="dx-records">{hits.map(d=><li key={d.id}><strong>{d.id}</strong><small>{t(...billStates[d.replica])} · {d.hours} h</small><button className="dx-link" onClick={()=>open(d)}>{t('核对原单','Inspect document')} ↗</button></li>)}</ul>
          <button className="dx-primary" disabled={confirmed} onClick={()=>confirm(true)}>{confirmed?t('已确认并模拟扫描','Confirmed & scanned'):t('确认规则并模拟扫描','Confirm rule & simulate scan')}</button>
        </Panel>
        <Panel title={t('模拟通知卡片','Simulated notifications')}>
          {!confirmed&&<p className="dx-muted">{t('以下是样稿。确认规则后显示模拟发送回执。','These are previews. Confirm the rule to simulate delivery receipts.')}</p>}
          {(confirmed?delivered:plan.send).map(d=><article className="dx-message-card" key={d.id}><Badge/><span className="dx-label">{confirmed?t('模拟已触达','Simulated delivery'):t('待确认 · 样稿','Unconfirmed preview')}</span>
            <h4>{rule.primaryRecheck?t('物流尾款待处理','Freight balance due'):t('新品等待审批','New product awaiting approval')}</h4><p>{d.owner} · {d.id}</p><button className="dx-link" onClick={()=>open(d)}>{t('去 ERP 核对原单','Review ERP document')} ↗</button>
            {confirmed&&<div className="dx-options dx-votes">{(['up','down'] as const).map(v=><button key={v} aria-pressed={votes[d.id]===v} onClick={()=>cast(d.id,v)}>{v==='up'?t('有用','Useful'):t('不准确','Inaccurate')}</button>)}</div>}</article>)}
          {plan.send.length===0&&<p className="dx-empty">{t('没有可发送的单据。','No eligible documents.')}</p>}
        </Panel></div>
        <div className="dx-panel" aria-live="polite"><h3>{t('通知监控中心','Notification monitor')}</h3><div className="dx-monitor">
          <Status tone={failed?'bad':'good'}>{t('回执触达','Receipts')} · {delivered.length}/{confirmed?plan.send.length:0}</Status>
          <Status tone={hits.length===0?'warn':'good'}>{hits.length===0?t('0 命中 · 静默告警','Zero hits · silence alert'):t('0 命中告警未触发','Zero-hit alarm clear')}</Status>
          <Status tone={rule.primaryRecheck&&confirmed?'good':'warn'}>{rule.primaryRecheck?(confirmed?t('主库二次核验 · 跳过','Primary rechecked · skipped')+' '+plan.skip.length:t('资金类 · 发前复核待执行','Payment · primary check pending')):t('审批类 · 无资金复核','Approval · no payment check')}</Status></div>
          {confirmed&&plan.skip.map(d=><p key={d.id}>{d.id} · {t('主库已全额付款，跳过发送。','Settled on the primary. Delivery skipped.')}</p>)}
          {failed&&<p>{failed} · {t('模拟发送失败','Simulated delivery failure')} <button onClick={()=>retry(true)}>{t('重试失败项','Retry failed item')}</button></p>}
          {retried&&<p>{t('重试成功，未重复发送已触达的通知。','Retry succeeded. Previous deliveries were not duplicated.')}</p>}
          {Object.keys(votes).length>0&&<small>{t('评价已回流','Feedback received')} · {Object.keys(votes).length}</small>}
        </div></>}
      {opened&&<SourcePreview doc={opened} close={()=>open(null)}/>}
    </div>;
  }
}
