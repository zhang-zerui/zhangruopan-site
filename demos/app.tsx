namespace RuopanDemo {
  function Motif({id}:{id:string}) {
    const style={fill:'none',stroke:'currentColor',strokeWidth:1.5,strokeLinecap:'round',strokeLinejoin:'round'} as const;
    return <svg className={'dx-motif dx-motif-'+id} viewBox="0 0 92 64" aria-hidden="true" {...style}>
      {id==='ads'?<><path d="M7 52h75M14 44V30h9v14m7 0V23h9v21m7 0V15h9v29"/><path d="m59 24 10-6 11 6v14l-11 6-10-6Zm0 0 10 6 11-6m-11 6v14"/></>:
      id==='rules'?<><rect x="9" y="10" width="41" height="42" rx="3"/><path d="M17 21h23m-23 8h17m-17 8h9m9 6h21l9-10"/><rect x="60" y="18" width="22" height="16" rx="3"/><path d="m65 25 4 4 7-8"/></>:
      id==='support'?<><path d="M8 11h48v27H30l-10 9v-9H8zm18 12h15"/><rect x="50" y="31" width="33" height="18" rx="3"/><path d="M56 31V21h20v10m-19 13h18v12H57zm4 5h9"/></>:
      <><path d="M18 6h35l9 9v37H18zm35 0v10h9M25 22h28m-28 8h18m-18 8h12"/><circle cx="62" cy="39" r="11"/><path d="m70 47 10 9m-23-18 4 4 6-8"/></>}
    </svg>;
  }
  function Hub() {
    const t=useWords();
    return <div className="dx-hub-list">{studies.map(s=><article className="dx-hub-card" key={s.id}><Badge/>
      <div className="dx-hub-body"><div><h2><a href={'#demo-'+s.id}>{t(...s.title)}</a></h2><p>{t(...s.question)}</p></div><Motif id={s.id}/></div>
      <a className="dx-entry" href={'#demo-'+s.id}>{t(...s.action)} <span aria-hidden="true">↗</span></a></article>)}</div>;
  }
  function CaseView({study}:{study:Study}) {
    const t=useWords();
    const [tab,setTab]=React.useState(0),[visited,visit]=React.useState(false);
    const id='dx-'+study.id;
    function activate(i:number){setTab(i);if(i===1)visit(true);}
    return <><p className="dx-question">{t(...study.question)}</p><div className="dx-tabs" role="tablist" aria-label={t('演示内容','Demo content')}>
      {([['交互式系统架构图','Interactive architecture'],['可操作核心原型','Working prototype']] as Words[]).map((s,i)=><button key={i} role="tab" id={id+'-tab-'+i} aria-controls={id+'-panel-'+i} aria-selected={tab===i} tabIndex={tab===i?0:-1} onClick={()=>activate(i)}
        onKeyDown={e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?1:1-i;activate(next);document.getElementById(id+'-tab-'+next)?.focus();}}>{t(...s)}</button>)}</div>
      <div id={id+'-panel-0'} role="tabpanel" aria-labelledby={id+'-tab-0'} hidden={tab!==0}><Architecture study={study}/></div>
      <div id={id+'-panel-1'} role="tabpanel" aria-labelledby={id+'-tab-1'} hidden={tab!==1}>{visited&&(study.id==='ads'?<Advertising/>:study.id==='rules'?<Rules/>:study.id==='support'?<Support active={tab===1}/>:<Documents/>)}</div>
      <footer className="dx-back"><a className="dx-entry" href="#demos">← {t('全部交互演示','All interactive demos')}</a><a className="dx-entry" href={'#'+study.project}>{t('阅读项目案例','Read the case study')} ↗</a></footer></>;
  }
  let active:HTMLElement|null=null;
  let root:{render:(view:React.ReactNode)=>void;unmount:()=>void}|null=null;
  export function renderPage(el:HTMLElement|null) {
    if(el!==active){root?.unmount();active=el;
      root=el?(ReactDOM as unknown as {createRoot:(el:HTMLElement)=>NonNullable<typeof root>}).createRoot(el):null;}
    if(!el||!root)return;
    const lang:Language=document.documentElement.lang.toLowerCase().startsWith('en')?'en':'zh';
    const study=studies.find(s=>s.id===el.dataset.dxMount);
    root.render(<Locale.Provider value={lang}>{study?<CaseView key={study.id} study={study}/>:<Hub/>}</Locale.Provider>);
  }
}
