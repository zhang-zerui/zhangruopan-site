namespace RuopanDemo {
  export type Tone = 'good'|'warn'|'bad';
  export function periodTotals(rows:number[][],offset:0|2) {
    const spend=rows.reduce((sum,row)=>sum+row[offset],0);
    const revenue=rows.reduce((sum,row)=>sum+row[offset+1],0);
    return {spend,revenue,ratio:spend>0?revenue/spend:null};
  }
  export function assessAd(s:AdScenario) {
    const days=s.available!==null && s.velocity>0 ? s.available/s.velocity:null;
    const blocked=!s.synced || !s.mapped || days===null || days<7;
    const grade:Tone=blocked?'bad':s.revised?'good':'warn';
    return {days,grade,mayAdopt:grade==='good'};
  }
  export interface Rule {
    event:'new_product_approval'|'logistics_balance'; region?:'SEA'; states:BillStatus[];
    elapsed:{field:'pending_hours'|'overdue_hours';op:'gt';value:number};
    recipient:'approval_owner'|'payment_owner'; link:'source_document'; primaryRecheck:boolean;
  }
  export function translateRule(text:string):Rule|null {
    const normalized=text.trim().replace(/\s+/g,' ').toLowerCase();
    const isPayment=ruleExamples.payment.some(s=>s.toLowerCase()===normalized);
    if(isPayment) return {event:'logistics_balance',states:['UNPAID','PARTIAL'],elapsed:{field:'overdue_hours',op:'gt',value:0},recipient:'payment_owner',link:'source_document',primaryRecheck:true};
    for(const example of ruleExamples.approval) {
      const shape=example.toLowerCase().replace('24','{hours}');
      const digits=normalized.match(/\d+/g);
      if(digits?.length!==1 || normalized.replace(digits[0],'{hours}')!==shape) continue;
      const hours=Number(digits[0]);
      if(!Number.isSafeInteger(hours)||hours<1||hours>720) return null;
      return {event:'new_product_approval',region:'SEA',states:['PENDING'],elapsed:{field:'pending_hours',op:'gt',value:hours},recipient:'approval_owner',link:'source_document',primaryRecheck:false};
    }
    return null;
  }
  export function readBack(r:Rule):Words {
    return r.event==='logistics_balance'
      ? ['仅当物流尾款已逾期且付款状态为未付款或部分付款，才提醒付款负责人。发前按主库排除已全额付款的单据，消息附原单链接。','Notify the payment owner only for overdue balances that are unpaid or partly paid. Recheck the primary before delivery, exclude fully paid bills and attach a source link.']
      : ['仅当东南亚新品仍待审批且等待超过 '+r.elapsed.value+' 小时，才通知该单审批负责人，并附单号及原单链接。','Notify the document owner only for pending Southeast Asian new-product approvals waiting strictly longer than '+r.elapsed.value+' hours. Include the document ID and link.'];
  }
  export function runTrial(rule:Rule,source:SourceDoc[]=trialDocs) {
    return source.filter(doc=>doc.kind===(rule.event==='new_product_approval'?'approval':'payment')&&(!rule.region||doc.region===rule.region)&&rule.states.includes(doc.replica)&&doc.hours>rule.elapsed.value);
  }
  export function deliveryPlan(rule:Rule,hits:SourceDoc[]) {
    return {send:hits.filter(d=>!rule.primaryRecheck||rule.states.includes(d.primary)),skip:hits.filter(d=>rule.primaryRecheck&&!rule.states.includes(d.primary))};
  }
  export function isoDigit(prefix:string):number|null {
    if(!/^[A-Z]{3}[UJZ]\d{6}$/.test(prefix)) return null;
    const table='0123456789A BCDEFGHIJK LMNOPQRSTU VWXYZ';
    const total=Array.from(prefix).reduce((sum,c,i)=>sum+table.indexOf(c)*2**i,0);
    return (total%11)%10;
  }
  export function validContainer(value:string):boolean {
    return /^[A-Z]{3}[UJZ]\d{7}$/.test(value)&&isoDigit(value.slice(0,10))===Number(value[10]);
  }
  export type FieldValues=Record<FieldKey,string>;
  export function initialFields():FieldValues {
    return Object.fromEntries(docFields.map(f=>[f.key,f.initial])) as FieldValues;
  }
  const numericFields:FieldKey[]=['packages','weightA','weightB','gross'];
  export function numeric(value:string) {
    if(!/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value.trim())) return NaN;
    return Number(value.trim().replace(/,/g,''));
  }
  export interface ReviewState {tone:Tone; reason:Words}
  export function checkField(f:DocField,values:FieldValues,checked:Partial<Record<FieldKey,boolean>>):ReviewState {
    const raw=values[f.key].trim();
    if(f.key==='container'&&!validContainer(raw)) return {tone:'bad',reason:['ISO 校验位异常','Invalid ISO check digit']};
    if(f.key==='gross'&&numeric(raw)!==numeric(values.weightA)+numeric(values.weightB)) return {tone:'bad',reason:['明细加总与总毛重不一致','Line weights do not equal the total']};
    const match=numericFields.includes(f.key)?numeric(raw)===numeric(f.source):raw===f.source;
    if(!match) return {tone:'bad',reason:['与原文不符，请对照框选位置','Does not match the highlighted source']};
    if(f.requiredReview&&!checked[f.key]) return {tone:'warn',reason:f.key==='discharge'?['印章遮挡 · 待人工确认','Stamp overlap · review required']:['红线字段 · 待人工确认','Sensitive field · review required']};
    return {tone:'good',reason:f.requiredReview?['已人工复核','Reviewed by a person']:['校验通过','Verified']};
  }
  export function reviewStatus(values:FieldValues,checked:Partial<Record<FieldKey,boolean>>) {
    const results=docFields.map(f=>checkField(f,values,checked));
    const conflicts=results.filter(s=>s.tone==='bad').length;
    const pending=results.filter(s=>s.tone==='warn').length;
    return {results,conflicts,pending,ready:conflicts===0&&pending===0};
  }
  export function mappingPreview(v:FieldValues,checked:Partial<Record<FieldKey,boolean>>) {
    if(!reviewStatus(v,checked).ready) return null;
    const standard={billId:v.blNo,vesselVoyage:v.vessel,loadingPort:v.loading,dischargePort:v.discharge,containerNo:v.container,packages:numeric(v.packages),lineWeightsKg:[numeric(v.weightA),numeric(v.weightB)],grossWeightKg:numeric(v.gross)};
    const customer={reference:standard.billId,voyage:standard.vesselVoyage,origin:standard.loadingPort,destination:standard.dischargePort,equipment:standard.containerNo,pieces:standard.packages,weights_kg:standard.lineWeightsKg,weight_kg:standard.grossWeightKg};
    return {standard,customer};
  }
}
