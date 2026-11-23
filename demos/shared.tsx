namespace RuopanDemo {
  export const Locale=React.createContext<Language>('zh');
  export function useWords(){const lang=React.useContext(Locale);return (zh:string,en:string)=>lang==='zh'?zh:en;}
  export function Badge(){return <span className="dx-badge">{badge}</span>;}
  export function Status({tone,children}:{tone:Tone;children:React.ReactNode}) {return <span className={'dx-status dx-'+tone}><i aria-hidden="true"/>{children}</span>;}
  export function Panel({title,children}:{title:string;children:React.ReactNode}) {return <section className="dx-panel"><h3>{title}</h3>{children}</section>;}
  export function Modal({title,children,close}:{title:string;children:React.ReactNode;close:()=>void}) {
    const ref=React.useRef<HTMLDialogElement>(null);
    const id=React.useId();
    const t=useWords();
    React.useEffect(()=>{
      const dialog=ref.current!;
      const previous=document.activeElement as HTMLElement|SVGElement|null;
      if(typeof dialog.showModal==='function')dialog.showModal(); else dialog.setAttribute('open','');
      return ()=>{if(dialog.open&&typeof dialog.close==='function')dialog.close(); previous?.focus?.({preventScroll:true});};
    },[]);
    return <dialog className="dx-dialog" ref={ref} aria-labelledby={id} onCancel={e=>{e.preventDefault();close();}}
      onClick={e=>{if(e.target===e.currentTarget)close();}} onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();close();}}}>
      <div className="dx-dialog-inner"><div className="dx-dialog-head"><h3 id={id}>{title}</h3><button type="button" className="dx-close" onClick={close} aria-label={t('关闭','Close')}>×</button></div>{children}</div>
    </dialog>;
  }
  function textUnits(s:string){return Array.from(s).reduce((sum,c)=>sum+(/[\u3000-\uffef]/.test(c)?1:0.58),0);}
  export function wrapLabel(text:string,limit:number) {
    const parts=text.match(/[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*|\s+|./gu)||[];
    const lines:string[]=[];let current='';
    for(const part of parts){
      if(current.trim()&&textUnits(current+part)>limit){lines.push(current.trim());current=part.trimStart();}
      else current+=part;
    }
    if(current.trim())lines.push(current.trim());
    return lines;
  }
  export function Diagram({graph}:{graph:Graph}) {
    const t=useWords();
    const [selected,select]=React.useState(graph.nodes[0].id);
    const [opened,open]=React.useState<string|null>(null);
    const holder=React.useRef<HTMLDivElement>(null);
    const [size,setSize]=React.useState(440);
    const marker='dx-arrow-'+React.useId().replace(/:/g,'');
    React.useLayoutEffect(()=>{
      const el=holder.current!;
      const measure=()=>{const w=el.getBoundingClientRect().width;if(w>0)setSize(Math.min(640,Math.max(230,Math.floor(w))));};
      measure();
      if(typeof ResizeObserver==='undefined'){window.addEventListener('resize',measure);return ()=>window.removeEventListener('resize',measure);}
      const observer=new ResizeObserver(measure);observer.observe(el);return ()=>observer.disconnect();
    },[]);
    const gap=size<360?10:18, pad=4, maxSingle=390, vertical=22;
    type Box={x:number;y:number;w:number;h:number;lines:string[]};
    const boxes:Record<string,Box>={};
    let bottom=pad;
    for(const row of graph.rows) {
      const w=Math.min(row.length===1?maxSingle:300,(size-2*pad-gap*(row.length-1))/row.length);
      const labels=row.map(id=>wrapLabel(t(...graph.nodes.find(n=>n.id===id)!.label),(w-18)/13));
      const h=Math.max(42, Math.max(...labels.map(a=>a.length))*16+18);
      const start=(size-(row.length*w+(row.length-1)*gap))/2;
      row.forEach((id,i)=>boxes[id]={x:start+i*(w+gap),y:bottom,w,h,lines:labels[i]});
      bottom+=h+vertical;
    }
    const node=graph.nodes.find(n=>n.id===selected)||graph.nodes[0];
    const dialogNode=graph.nodes.find(n=>n.id===opened);
    return <div className="dx-architecture"><div className="dx-diagram" ref={holder}>
      <svg viewBox={'0 0 '+size+' '+(bottom-vertical+pad)} role="group" aria-label={t(...graph.title)}>
        <defs><marker id={marker} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M1 1 L7 4 L1 7" fill="none" stroke="currentColor"/></marker></defs>
        {graph.edges.map(([from,to])=>{const a=boxes[from],b=boxes[to];const x=a.x+a.w/2,y=a.y+a.h,x2=b.x+b.w/2,y2=b.y-3,mid=(y+y2)/2;
          return <path key={from+to} className="dx-edge" d={'M '+x+' '+y+' C '+x+' '+mid+' '+x2+' '+mid+' '+x2+' '+y2} markerEnd={'url(#'+marker+')'}/>;})}
        {graph.nodes.map(n=>{const b=boxes[n.id],active=n.id===node.id;const activate=()=>{select(n.id);open(n.id);};
          return <g key={n.id} className={'dx-node dx-role-'+n.kind+(active?' dx-selected':'')} role="button" tabIndex={0} aria-haspopup="dialog"
            aria-label={t(...n.label)+' · '+t(...roles[n.kind])} onMouseEnter={()=>select(n.id)} onFocus={()=>select(n.id)} onClick={activate}
            onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}}}>
            <rect x={b.x+0.7} y={b.y+0.7} width={b.w-1.4} height={b.h-1.4} rx="6"/>
            <path className="dx-role-stripe" d={'M '+(b.x+3)+' '+(b.y+9)+' v '+(b.h-18)}/>
            <text x={b.x+b.w/2} y={b.y+(b.h-(b.lines.length-1)*16)/2+4.5} textAnchor="middle">{b.lines.map((line,i)=><tspan key={i} x={b.x+b.w/2} dy={i?16:0}>{line}</tspan>)}</text>
          </g>;})}
      </svg></div>
      <aside className="dx-inspection"><p className="dx-label">{t('节点说明','Node notes')}</p><span className={'dx-role-tag dx-role-'+node.kind}>{t(...roles[node.kind])}</span><h3>{t(...node.label)}</h3><p>{t(...node.note)}</p><div className="dx-legend">{(Object.keys(roles) as Kind[]).map(k=><span key={k} className={'dx-role-tag dx-role-'+k}>{t(...roles[k])}</span>)}</div></aside>
      {dialogNode&&<Modal title={t(...dialogNode.label)} close={()=>open(null)}><span className={'dx-role-tag dx-role-'+dialogNode.kind}>{t(...roles[dialogNode.kind])}</span><p>{t(...dialogNode.note)}</p></Modal>}
    </div>;
  }
  export function Architecture({study}:{study:Study}) {
    const t=useWords();const [index,set]=React.useState(0);
    return <>{study.graphs.length>1&&<div className="dx-options" aria-label={t('选择架构视图','Choose architecture view')}>{study.graphs.map((g,i)=><button type="button" key={i} aria-pressed={index===i} onClick={()=>set(i)}>{t(...g.title)}</button>)}</div>}
      <Diagram graph={study.graphs[index]} key={index}/></>;
  }
}
