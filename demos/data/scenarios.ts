namespace RuopanDemo {
  export type Channel = 'tiktok' | 'shopee';
  export interface AdScenario { id:string; name:Words; site:string; sku:string; synced:boolean; revised:boolean; mapped:boolean; available:number|null; velocity:number; book:number; figures:Record<Channel,number[][]> }
  // Each row contains prior spend/revenue, then current spend/revenue in THB.
  export const adScenarios:AdScenario[] = [
    {id:'A', name:['高可信 · 建议放量','High · eligible to scale'],site:'SHOP-DEMO-TH-01',sku:'SKU-DEMO-001',synced:true,revised:true,mapped:true,available:560,velocity:20,book:700,
      figures:{tiktok:[[1000,2800,1200,4200],[500,1400,800,3800]],shopee:[[900,2400,1100,3400],[600,1500,700,2900]]}},
    {id:'B', name:['中可信 · T+1 回刷','Medium · T+1 revisions'],site:'SHOP-DEMO-TH-01',sku:'SKU-DEMO-002',synced:true,revised:false,mapped:true,available:360,velocity:18,book:390,
      figures:{tiktok:[[1000,2500,1200,3600],[500,1550,800,2800]],shopee:[[700,1750,900,2700],[500,1250,650,2080]]}},
    {id:'C', name:['低可信 · 库存拦截','Low · stock hold'],site:'SHOP-DEMO-TH-02',sku:'SKU-DEMO-SET-003',synced:true,revised:true,mapped:false,available:null,velocity:30,book:840,
      figures:{tiktok:[[1000,3400,1200,6000],[500,2000,800,4400]],shopee:[[850,2975,1000,5000],[500,1600,700,3710]]}}
  ];
  export const channelLabels:Record<Channel,string> = {tiktok:'TikTok Shop · GMV Max ROI',shopee:'Shopee · ROAS'};
  export const adPeriods = ['2026-04-06 – 04-12','2026-04-13 – 04-19'];
  export type RuleKind = 'approval'|'payment';
  export const ruleExamples:Record<RuleKind,Words> = {
    approval:['东南亚新品审批超 24 小时未审提醒对应负责人并带单号直达','Remind the owner about Southeast Asian new-product approvals pending over 24 hours, with a direct document link.'],
    payment:['跨境物流尾款未付款及部分付款超期催付，排除已全额付款单据','Chase overdue cross-border logistics balances that are unpaid or partially paid. Exclude fully paid bills.']
  };
  export type BillStatus='PENDING'|'APPROVED'|'UNPAID'|'PARTIAL'|'PAID';
  export const billStates:Record<BillStatus,Words>={PENDING:['未审批','Pending'],APPROVED:['已审批','Approved'],UNPAID:['未付款','Unpaid'],PARTIAL:['部分付款','Partly paid'],PAID:['已全额付款','Fully paid']};
  export interface SourceDoc {id:string; kind:RuleKind; replica:BillStatus; primary:BillStatus; hours:number; owner:string; region:string}
  export const trialDocs:SourceDoc[]=[
    {id:'APR-DEMO-SEA-001',kind:'approval',replica:'PENDING',primary:'PENDING',hours:49,owner:'OWNER-DEMO-TH',region:'SEA'},
    {id:'APR-DEMO-SEA-002',kind:'approval',replica:'PENDING',primary:'PENDING',hours:31,owner:'OWNER-DEMO-MY',region:'SEA'},
    {id:'APR-DEMO-SEA-003',kind:'approval',replica:'PENDING',primary:'PENDING',hours:25,owner:'OWNER-DEMO-PH',region:'SEA'},
    {id:'APR-DEMO-SEA-004',kind:'approval',replica:'PENDING',primary:'PENDING',hours:24,owner:'OWNER-DEMO-TH',region:'SEA'},
    {id:'APR-DEMO-SEA-005',kind:'approval',replica:'APPROVED',primary:'APPROVED',hours:51,owner:'OWNER-DEMO-MY',region:'SEA'},
    {id:'PAY-DEMO-SEA-001',kind:'payment',replica:'UNPAID',primary:'UNPAID',hours:36,owner:'FIN-DEMO-TH',region:'SEA'},
    {id:'PAY-DEMO-SEA-002',kind:'payment',replica:'PARTIAL',primary:'PARTIAL',hours:18,owner:'FIN-DEMO-MY',region:'SEA'},
    {id:'PAY-DEMO-SEA-003',kind:'payment',replica:'PARTIAL',primary:'PAID',hours:6,owner:'FIN-DEMO-PH',region:'SEA'},
    {id:'PAY-DEMO-SEA-004',kind:'payment',replica:'PAID',primary:'PAID',hours:48,owner:'FIN-DEMO-TH',region:'SEA'},
    {id:'PAY-DEMO-SEA-005',kind:'payment',replica:'UNPAID',primary:'UNPAID',hours:0,owner:'FIN-DEMO-TH',region:'SEA'}
  ];
  export interface ChatMessage { who:'buyer'|'agent'|'system'|'draft'; text:Words; time:string; art?:'guide'|'blur' }
  export interface ChatStep {node:Words; model:string|null; risk:'clear'|'uncertain'|'red'; tool:string; glossary:Words; messages:ChatMessage[]}
  export interface ChatScript {name:Words; shop:string; steps:ChatStep[]}
  const msg=(who:ChatMessage['who'],time:string,zh:string,en:string,art?:ChatMessage['art']):ChatMessage=>({who,time,text:[zh,en],art});
  const waitTerms:Words=['待核对','Pending'];
  const step=(node:Words,model:string|null,risk:ChatStep['risk'],tool:string,glossary:Words,...messages:ChatMessage[]):ChatStep=>({node,model,risk,tool,glossary,messages});
  export const chatScripts:ChatScript[]=[
    {name:['订单反查与装纸排障','Order lookup & paper loading'],shop:'SHOP-DEMO-TH-01',steps:[
      step(['接收碎片 1/3','Receive fragment 1/3'],null,'clear','Shopee Chat · OAuth',waitTerms,msg('buyer','00:00','สวัสดีค่ะ · 你好','สวัสดีค่ะ · Hello')),
      step(['接收碎片 2/3','Receive fragment 2/3'],null,'clear','Redis · buffer',waitTerms,msg('buyer','00:01','กระดาษไม่ออก · 打印机不出纸','กระดาษไม่ออก · No paper comes out')),
      step(['接收碎片 3/3','Receive fragment 3/3'],null,'clear','Redis · buffer',waitTerms,msg('buyer','00:03','订单 ORD-DEMO-SEA-202604，怎么装纸？','My order is ORD-DEMO-SEA-202604. How do I load the roll?')),
      step(['防抖合并 · 红线检查通过','Merge fragments · guard clear'],null,'clear','Redis · 6 s',waitTerms,msg('system','00:09','静默 6 秒，3 条碎片合并为 1 次处理。','After 6 quiet seconds, three fragments enter one workflow.')),
      step(['订单反查锁定机型','Identify model from order'],'P-DEMO-M1','clear','Fixed SQL · ORD-DEMO-SEA-202604',waitTerms,msg('system','00:10','本店已入库订单命中标签打印机 P-DEMO-M1。','The stored order in this shop identifies label printer P-DEMO-M1.')),
      step(['二维知识库 · 标准回复','Model-specific answer'],'P-DEMO-M1','clear','KB · paper-feed × P-DEMO-M1',['泰语「进纸键」已核对','Thai feed-button term verified'],msg('agent','00:11','请打开上盖，按图放入标签卷，再合盖按一次进纸键（ปุ่มป้อนกระดาษ）。','Open the cover, insert the roll as shown, then close it and press feed (ปุ่มป้อนกระดาษ) once.','guide')),
      step(['买家确认 · 排障完成','Buyer confirms resolution'],'P-DEMO-M1','clear','Shopee Chat · closed',['图示与机型相符','Guide matches model'],msg('buyer','00:20','พิมพ์ได้แล้ว · 已经可以打印了。','พิมพ์ได้แล้ว · It prints now.'))]},
    {name:['模糊机身图转人工','Unclear photo → staff'],shop:'SHOP-DEMO-MY-02',steps:[
      step(['接收机身照片','Receive device photo'],null,'clear','Shopee Chat · OAuth',waitTerms,msg('buyer','00:00','Label dah pudar. 机身标签模糊，能认出型号吗？','Label dah pudar. Can you identify the printer from this photo?','blur')),
      step(['实时查单未匹配','Live order lookup: no match'],null,'clear','HTTP · shop-scoped lookup',waitTerms,msg('system','00:03','已入库查询无匹配，HTTP 直查也未找到可核对的机型。','No stored match. A live HTTP lookup also returns no verifiable model.')),
      step(['VLM 证据不足','VLM evidence insufficient'],null,'uncertain','VLM · 0.42 / 0.80',waitTerms,msg('system','00:05','识图分数 0.42，低于演示阈值 0.80。保留机型未知，停止检索机型手册。','Image score 0.42 is below the demo threshold of 0.80. Keep model unknown and stop manual retrieval.')),
      step(['转人工 · 草稿辅助','Transfer with a draft'],null,'uncertain','Copilot · staff only',['马来语铭牌用词已核对','Malay label term verified'],msg('draft','00:06','请人工索取清晰铭牌或订单号。当前证据不足以给出对应机型的安装步骤。','Ask for a clear device label or order number. The evidence does not support model-specific instructions.'))]},
    {name:['第二轮退款红线打断','Refund interrupts turn two'],shop:'SHOP-DEMO-TH-01',steps:[
      step(['第一轮 · 订单锁机型','Turn one · identify model'],'P-DEMO-M1','clear','Fixed SQL · ORD-DEMO-SEA-202605',waitTerms,msg('buyer','00:00','订单 ORD-DEMO-SEA-202605，标签卷卡住了。','Order ORD-DEMO-SEA-202605. The label roll is stuck.')),
      step(['第一轮 · 排障中','Turn one · troubleshoot'],'P-DEMO-M1','clear','KB · paper-feed × P-DEMO-M1',['步骤已核对','Steps verified'],msg('agent','00:05','可以先描述一下进纸键的指示灯吗？','What does the feed-button indicator show?')),
      step(['第二轮 · 全局红线触发','Turn two · global interrupt'],'P-DEMO-M1','red','Global guard · refund + rating',['停止生成回复','Reply generation stopped'],msg('buyer','00:10','机器坏了快退钱否则给 1 星','This machine is broken. Refund me now or I will give one star.'),msg('system','00:10','退款诉求和差评威胁命中，立即中止排障。','Refund demand and review threat detected. Troubleshooting stops immediately.')),
      step(['高危转人工 · 禁止退款承诺','High-risk handoff'],'P-DEMO-M1','red','Handoff · staff only',['人工判责','Staff decision'],msg('draft','00:11','高危原因：退款诉求及一星威胁。请人工核对订单与售后政策，尚未承诺退款。','Refund demand and one-star threat. Staff should review the order and returns policy. No refund commitment has been made.'))]}
  ];
  export type FieldKey='blNo'|'vessel'|'loading'|'discharge'|'container'|'packages'|'weightA'|'weightB'|'gross';
  export interface DocField {key:FieldKey; label:string; en:string; source:string; initial:string; box:number[]; requiredReview?:boolean}
  export const docFields:DocField[]=[
    {key:'blNo',label:'提单号',en:'Bill of lading',source:'BL-DEMO-089',initial:'BL-DEMO-089',box:[34,126,255,54]},
    {key:'vessel',label:'船名 / 航次',en:'Vessel / voyage',source:'DEMO STAR / V089',initial:'DEMO STAR / V089',box:[300,126,246,54]},
    {key:'loading',label:'起运港',en:'Port of loading',source:'SHENZHEN',initial:'SHENZHEN',box:[34,204,255,64]},
    {key:'discharge',label:'目的港',en:'Port of discharge',source:'BANGKOK',initial:'BANGKOK',requiredReview:true,box:[300,204,246,64]},
    {key:'container',label:'集装箱号',en:'Container number',source:'DEMU0000891',initial:'DEMU0000898',box:[34,302,255,62]},
    {key:'packages',label:'总件数',en:'Package count',source:'160',initial:'160',requiredReview:true,box:[300,302,246,62]},
    {key:'weightA',label:'明细 A 毛重（kg）',en:'Line A gross (kg)',source:'4,800',initial:'4800',box:[34,424,255,56]},
    {key:'weightB',label:'明细 B 毛重（kg）',en:'Line B gross (kg)',source:'3,200',initial:'3200',box:[300,424,246,56]},
    {key:'gross',label:'总毛重（kg）',en:'Total gross (kg)',source:'8,000',initial:'8800',box:[34,512,512,60]}
  ];
}
