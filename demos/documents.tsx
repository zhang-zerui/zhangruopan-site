interface Window {
  RuopanDemoArt:{
    BillDrawing:React.ComponentType<{fields:RuopanDemo.DocField[];selected:string;onSelect:(key:RuopanDemo.FieldKey)=>void;lang:string}>;
    PaperGuide:React.ComponentType<{lang:string}>;
  };
}
namespace RuopanDemo {
  export function Documents() {
    const t=useWords(),lang=React.useContext(Locale);
    const [values,edit]=React.useState(initialFields),[checked,check]=React.useState<Partial<Record<FieldKey,boolean>>>({});
    const [selected,select]=React.useState<FieldKey>('container'),[written,write]=React.useState(false);
    const pane=React.useRef<HTMLDivElement>(null);
    const inputs=React.useRef<Partial<Record<FieldKey,HTMLInputElement>>>({});
    const status=reviewStatus(values,checked), preview=written?mappingPreview(values,checked):null;
    function locate(key:FieldKey) {
      select(key);
      const view=pane.current, area=document.getElementById('demo-source-'+key);
      if(!view||!area)return;
      const a=area.getBoundingClientRect(),b=view.getBoundingClientRect();
      if(a.top<b.top+8||a.bottom>b.bottom-8)view.scrollTop+=a.top-b.top-(view.clientHeight-a.height)/2;
    }
    function change(key:FieldKey,value:string){edit(v=>({...v,[key]:value}));check(v=>({...v,[key]:false}));write(false);}
    return <div className="dx-stack"><div className="dx-review"><Panel title={t('海运提单原文','Source bill of lading')}><p className="dx-muted">{t('点选字段核对原文。红章是演示用遮挡。','Select a field to locate its source. The red seal simulates an obstruction.')}</p>
      <div className="dx-scan" ref={pane}><window.RuopanDemoArt.BillDrawing lang={lang} fields={docFields} selected={selected} onSelect={key=>{locate(key);inputs.current[key]?.focus({preventScroll:true});}}/></div>
      </Panel><Panel title={t('结构化字段复核','Structured field review')}><div className="dx-fieldlist">
      {docFields.map((f,i)=>{const s=status.results[i];return <div key={f.key} className={'dx-review-field'+(selected===f.key?' dx-field-selected':'')}>
        <label htmlFor={'dx-field-'+f.key}>{lang==='zh'?f.label:f.en}</label><input id={'dx-field-'+f.key} ref={el=>{if(el)inputs.current[f.key]=el;}}
          value={values[f.key]} onFocus={()=>locate(f.key)} onClick={()=>locate(f.key)} onChange={e=>change(f.key,e.target.value)} aria-invalid={s.tone==='bad'} aria-describedby={'dx-state-'+f.key} spellCheck={false}/>
        <div id={'dx-state-'+f.key}><Status tone={s.tone}>{t(...s.reason)}</Status></div>
        {f.requiredReview&&<label className="dx-check"><input type="checkbox" disabled={s.tone==='bad'} checked={!!checked[f.key]} onFocus={()=>locate(f.key)} onChange={e=>{check(v=>({...v,[f.key]:e.target.checked}));write(false);}}/>{t('已对照原文复核','Checked against source')}</label>}
      </div>;})}</div></Panel></div>
      <div className="dx-panel dx-release"><div aria-live="polite"><Status tone={status.conflicts?'bad':status.pending?'warn':'good'}>{t('冲突','Conflicts')} {status.conflicts} · {t('待人工复核','Awaiting review')} {status.pending}</Status><p>{t('修正冲突并逐项复核后，可查看本次模拟写入的字段映射。','Resolve conflicts and sign off each sensitive field to inspect the simulated write mapping.')}</p></div>
      <div className="dx-options"><button className="dx-primary" disabled={!status.ready||written} onClick={()=>{if(status.ready)write(true);}}>{written?t('已生成模拟写入预览','Simulated write preview ready'):t('确认经 API 写入系统','Confirm API write')}</button>
      <button onClick={()=>{edit(initialFields());check({});write(false);locate('container');}}>{t('重置样例','Reset sample')}</button></div></div>
      {preview&&<div className="dx-grid"><Panel title={t('通用物流 Schema','Standard freight schema')}><pre>{JSON.stringify(preview.standard,null,2)}</pre></Panel><Panel title={t('客户字段映射 · 模拟 API 请求体','Customer mapping · simulated API body')}><pre>{JSON.stringify(preview.customer,null,2)}</pre></Panel></div>}
    </div>;
  }
}
