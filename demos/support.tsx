namespace RuopanDemo {
  export function Support({active=true}:{active?:boolean}) {
    const t=useWords(),lang=React.useContext(Locale);
    const [index,select]=React.useState(0),[frame,advance]=React.useState(-1),[playing,play]=React.useState(false);
    const script=chatScripts[index],state=frame>=0?script.steps[frame]:null, end=frame>=script.steps.length-1;
    React.useEffect(()=>{
      if(!active||!playing||end)return;
      const timer=window.setTimeout(()=>advance(v=>Math.min(v+1,script.steps.length-1)),830);
      return ()=>window.clearTimeout(timer);
    },[active,playing,frame,index,end]);
    function start(i:number){select(i);advance(0);play(true);}
    const messages=script.steps.slice(0,frame+1).flatMap(s=>s.messages);
    const rolesText:Record<ChatMessage['who'],Words>={buyer:['买家','Buyer'],agent:['客服 Agent','Support agent'],system:['系统事件','Workflow event'],draft:['仅人工可见的草稿','Staff-only draft']};
    return <div className="dx-stack"><div className="dx-options">{chatScripts.map((s,i)=><button key={i} aria-pressed={i===index&&frame>=0} onClick={()=>start(i)}>{i+1} · {t(...s.name)}</button>)}</div>
      <div className="dx-grid"><Panel title={t('买家对话','Buyer conversation')}><p className="dx-id">{script.shop} · {t('演示时钟','Demo clock')}</p>
        {frame<0?<p className="dx-empty">{t('选择一个剧本，查看买家消息和状态变化。','Pick a script to follow its messages and transitions.')}</p>:<ol className="dx-chat">{messages.map((m,i)=><li key={index+'-'+i} className={'dx-who-'+m.who}><div><strong>{t(...rolesText[m.who])}</strong><time>{m.time}</time></div><p>{t(...m.text)}</p>{m.art==='guide'&&<window.RuopanDemoArt.PaperGuide lang={lang}/>}
          {m.art==='blur'&&<svg viewBox="0 0 170 52" width="170" height="52" role="img" aria-label={t('模糊的模拟机身铭牌','Blurred synthetic device label')}><rect x="1" y="1" width="168" height="50" rx="5" fill="var(--rp-wash)" stroke="var(--rp-edge)"/><g fill="currentColor" opacity=".28"><rect x="13" y="13" width="85" height="5" rx="2"/><rect x="13" y="27" width="120" height="8" rx="4"/></g><text x="114" y="17" fontSize="9" fill="currentColor">DEMO</text></svg>}</li>)}</ol>}
      </Panel><div className="dx-stack"><Panel title={t('实时状态面板','Live workflow state')}><div aria-live="polite"><Status tone={!state||state.risk==='clear'?'good':state.risk==='red'?'bad':'warn'}>{state?t(...state.node):t('等待运行','Ready')}</Status>
        <dl className="dx-facts">{[
          [t('已锁定机型','Locked model'),state?.model??t('未知','Unknown')],
          [t('风控层级','Risk level'),!state?'—':state.risk==='red'?t('高危 · 退款 / 差评','High · refund / rating'):state.risk==='uncertain'?t('证据不足 · 人工','Uncertain · handoff'):t('常规','Routine')],
          [t('调用工具','Current tool'),state?.tool??'—'],[t('多语种术语校验','Terminology'),state?t(...state.glossary):'—']
        ].map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl></div>
        <div className="dx-options"><button onClick={()=>{if(frame<0||end)start(index);else play(!playing);}}>{frame<0?t('运行剧本','Run script'):end?t('重新运行','Replay'):playing?t('暂停','Pause'):t('继续','Resume')}</button>
        <button disabled={end} onClick={()=>{play(false);advance(v=>Math.min(v+1,script.steps.length-1));}}>{t('下一步','Next step')}</button></div><p className="dx-muted">{Math.max(frame+1,0)} / {script.steps.length} · {t('按模拟时间加速播放','Accelerated simulation')}</p></Panel></div></div></div>;
  }
}
