namespace RuopanDemo {
  export type Words = [string, string];
  export type Language = 'zh' | 'en';
  export type Kind = 'source' | 'rule' | 'model' | 'human';
  export interface ArchNode { id: string; kind: Kind; label: Words; note: Words }
  export interface Graph { title: Words; rows: string[][]; edges: [string,string][]; nodes: ArchNode[] }
  export interface Study { id: string; title: Words; question: Words; action: Words; project: string; graphs: Graph[] }
  export const badge = '脱敏逻辑复原 · 模拟演示数据（Synthetic Demo）';
  export const roles: Record<Kind, Words> = {
    source: ['数据来源','Source'], rule: ['确定性规则','Rule'], model: ['模型','Model'], human: ['人工','Human']
  };
  const n = (id: string, kind: Kind, zh: string, en: string, note: string, english: string): ArchNode =>
    ({id, kind, label:[zh,en], note:[note,english]});
  function graph(title: Words, nodes: ArchNode[], rows?: string[][], edges?: [string,string][]): Graph {
    return {title, nodes, rows: rows || nodes.map(node => [node.id]),
      edges: edges || nodes.slice(1).map((node,i) => [nodes[i].id,node.id])};
  }
  export const studies: Study[] = [
    {id:'ads', project:'project-ads', title:['广告与库存联合决策 Agent','Ad spend & sellable stock'],
      question:['投放回报很好，什么时候仍要拦住加预算建议？','When should strong ad returns still hold back a budget recommendation?'],
      action:['切换三种库存与归因状态','Compare three decision scenarios'], graphs:[graph(['决策链路','Decision path'],[
        n('sources','source','广告平台与 ERP 只读数据','Ad platforms & read-only ERP','按店铺、站点、币种和归因口径取数。账面在库量与可售量分开保存。','Scope inputs by shop, site, currency and attribution. Keep on-hand and sellable units separate.'),
        n('readiness','rule','数据就绪与组合 SKU 映射','Freshness & bundle mapping','检查两期同步水位和 T+1 回刷窗口。每个组合 SKU 必须映射到本站点的可售组件。','Check both sync watermarks and the T+1 revision window. A bundle needs a verified mapping to sellable components at this site.'),
        n('query','rule','固定 SQL / API · 两期汇总','Fixed SQL / API · period totals','模板锁定过滤条件和分母，避免 Text-to-SQL 改写口径。TikTok 按期汇总归因收入÷花费；Shopee 按站点单列 ROAS。','Fixed queries preserve filters and denominators. TikTok divides period revenue by period spend. Shopee uses its own site-level ROAS.'),
        n('grade','rule','工程置信度 · 高 / 中 / 低','Engineering confidence','同步、回刷期与库存核验直接决定评级。这里的高、中、低来自工程规则，不是模型自评。','Freshness, the revision window and inventory checks set the grade. The model cannot raise it.'),
        n('stock','rule','可售库存 · 建议层拦截','Sellable stock · advice gate','可售量不足或映射缺失时，隐藏加预算动作。系统提供建议，预算执行权仍由运营持有。','Low or unverified sellable stock removes the increase action. The operator retains budget execution authority.'),
        n('gateway','model','多模型网关 · 归因解释','Model gateway · explanation','模型只接收已核准的指标、等级和允许的建议类型，负责组织解释。模型异常时仍可读原始规则结果。','Models receive verified totals, grade and allowed actions. The rule result remains available if explanation generation fails.'),
        n('owner','human','人工执行与绕过留痕','Human execution & audit','采纳与实际调整分开记录。绕过写入周复盘记录，保留站点、SKU 和原因，供运营与 IT 核对。','Adoption and execution are distinct. A bypass records the site, SKU and reason for weekly operations and IT review.')
      ])]},
    {id:'rules', project:'project-notifications', title:['ERP 对话式规则与 Dify 管控台','Conversational ERP rules & Dify controls'],
      question:['一句话催付款，怎样避免催到已经付清的单？','How do you prevent a reminder after the final payment clears?'],
      action:['试跑规则并核对原单','Dry-run a rule against its documents'],graphs:[
      graph(['NL2Rule 规则链路','NL2Rule pipeline'],[
        n('form','human','手动配置表单','Manual form','表单规定字段、运算符和接收人。自然语言入口与表单共用同一份结构。','The form defines fields, operators and recipients. Both entry paths use the same structure.'),
        n('prefill','model','一句话预填','Language prefill','模型只起草条件。不能新建字段、执行 SQL 或直接发出通知。','The model drafts conditions. It cannot invent fields, execute SQL or send a notification.'),
        n('dsl','rule','受控 JSON DSL 校验','Validate JSON DSL','只接受白名单事件、状态、时间条件和接收人。无法表达的指令留给人修改。','Validate events, states, time constraints and recipients against an allowlist. Ask for revision when a rule cannot be expressed.'),
        n('trial','rule','中文反译与试跑原单','Read-back & dry run','从结构化条件反译，列出命中单据和来源，供业务核对“且 / 或”及时间边界。','Render the rule back from its structure. Source previews expose AND / OR and time boundaries.'),
        n('confirm','human','人工确认落库','Human confirmation','只有人工确认才保存。修改草稿会使上一次试跑失效。','Only a person can confirm a rule. Editing the draft invalidates its previous trial.'),
        n('scan','rule','从库扫描 · 资金发前复核','Replica scan & primary check','定时从只读从库扫描。付款提醒发出前再查主库，期间已全额付款的单据跳过。','Scan a read replica on schedule. Recheck payment on the primary immediately before sending and skip settled bills.'),
        n('push','rule','按风险分级推送','Risk-based delivery','PMC 汇总可按周推送，付款催办采用更高检查频率。接收人仍由业务角色映射确定。','PMC summaries can run weekly. Payment rules check more frequently. Business roles determine recipients.'),
        n('monitor','rule','回执、重试与静默告警','Receipts, retries & silence','记录发送结果、失败重试和单条评价。有预期命中却持续为零时发监控告警。','Track receipts, retries and per-message feedback. Flag unexpected zero hits on a monitored run.')
      ],[['form','prefill'],['dsl'],['trial'],['confirm'],['scan'],['push'],['monitor']],
      [['form','dsl'],['prefill','dsl'],['dsl','trial'],['trial','confirm'],['confirm','scan'],['scan','push'],['push','monitor']]),
      graph(['Dify 管控台与权限','Dify control plane'],[
        n('org','source','飞书组织架构','Feishu organisation','用组织成员与岗位识别身份，变更沿 ERP 既有权限关系生效。','Resolve people and roles through the organisation and its existing ERP grants.'),
        n('erp','rule','复用 ERP 权限底座','Reuse ERP permissions','权限直接读取既有底座，避免两套授权表双写和回收延迟。','Read the existing entitlement source to avoid duplicate writes and stale revocations.'),
        n('auth','rule','统一鉴权网关','Shared access gateway','把身份、角色和额度交给网关核验。工作流调用也需同样授权。','The gateway checks identity, role and quota, including calls originating in a workflow.'),
        n('mcp','rule','MCP 过滤与审计','MCP filter & audit','按用户先过滤工具再允许调用，授权及回收都有记录。','Filter the tool list per user before invocation and audit grants and revocations.'),
        n('image','model','外部生图与费用托管','Image API & spend controls','示例 Nano Banana 先过额度检查，再提交轻量生图流程，费用记在网关。','A sample Nano Banana workflow checks quota before generation and attributes usage at the gateway.'),
        n('ops','human','运营问数端','Operations workspace','运营只能访问授权工具和业务结果。工作流配置保留在开发端。','Operators see approved tools and business results. Workflow configuration stays in the developer workspace.'),
        n('dev','human','开发配置端','Developer workspace','研发可以维护工作流、账户额度和工具配置，变更进入回归。','Developers maintain workflows, quotas and tools, then run regression checks.'),
        n('assert','rule','PRD 断言与 Mock 快照回归','Assertions & mock snapshots','用原问题核对工具可见性、拒绝原因与输出字段。一键回归使用固定模拟快照。','Replay a fixed mock snapshot against PRD assertions for tool visibility, denials and output fields.')
      ],[['org'],['erp'],['auth'],['mcp','image'],['ops','dev'],['assert']],
      [['org','erp'],['erp','auth'],['auth','mcp'],['auth','image'],['mcp','ops'],['image','ops'],['mcp','dev'],['image','dev'],['dev','assert']])]},
    {id:'support',project:'project-support',title:['Shopee 硬件客服与售后 Agent','Shopee hardware support'],
      question:['买家突然要求退款时，正在进行的排障会怎样？','What happens when a refund request interrupts troubleshooting?'],
      action:['运行三段买家对话','Play three buyer conversations'],graphs:[graph(['售后消息链路','After-sales workflow'],[
        n('shops','source','Shopee Chat API · 分店授权','Shopee Chat API · per shop','多品牌多店铺各自持有 shop_id OAuth 授权和会话空间，避免串店查单和凭据混用。','Each shop has its own OAuth grant and conversation scope to avoid cross-shop lookups or credential reuse.'),
        n('redis','rule','Redis 防抖与令牌桶','Redis debounce & rate limit','同店同会话碎片等候 5–8 秒静默后合并。令牌桶限流时排队或交人工。','Combine fragments after 5–8 seconds of quiet per shop and thread. A rate-limited message queues or goes to staff.'),
        n('guard','rule','全局红线 · 随时打断','Global interrupt guard','每轮先检查退款、投诉和情绪升级。命中即打断已有工作流，人工决定退款。','Check refunds, complaints and escalation on every turn. A hit interrupts the current workflow and leaves the decision to staff.'),
        n('state','rule','Dify 状态化多轮排障','Dify stateful workflow','保存轮次、意图及已核机型。每次状态转移前重新经过红线守卫。','Carry the turn, intent and verified model forward. Recheck the guard before each transition.'),
        n('identify','model','订单反查 / VLM 锁机型','Order lookup / VLM identification','优先按本店订单锁机型。图像证据不足时保留未知并转人工，避免跨机型指导。','Prefer a shop-scoped order lookup. A weak image leaves the model unknown and transfers the case.'),
        n('orders','rule','固定 SQL / HTTP 查单','Fixed SQL / HTTP lookup','已入库走参数化模板，未入库走既有 HTTP 接口，失败后交人工。','Use fixed parameterised SQL for stored orders and the existing HTTP endpoint otherwise. Failed lookups go to staff.'),
        n('kb','source','问题 × 机型知识与术语','Issue × model & glossary','检索先限定问题和机型，出稿前再核对当地术语、图示和步骤。','Filter by issue and model, then check local terms, illustrations and instructions before release.'),
        n('reply','human','Copilot 草稿 / 标准自动回复','Copilot draft / standard reply','只有已验证的高频标准问题自动回复，证据不足或触发红线时仅供人工参考。','Verified routine questions may receive an automatic answer. Uncertain or sensitive cases produce a staff-only draft.')
      ],[['shops'],['redis'],['guard'],['state'],['identify'],['orders','kb'],['reply']],
      [['shops','redis'],['redis','guard'],['guard','state'],['state','identify'],['identify','orders'],['identify','kb'],['orders','reply'],['kb','reply']])]},
    {id:'documents',project:'project-docs',title:['多模态物流单据与人工复核','Multimodal freight document review'],
      question:['模型读错一位箱号，谁能在写入前发现？','How do you catch a one-digit container error before writing it back?'],
      action:['对照提单修正并放行','Reconcile a bill and release the write'],graphs:[graph(['单据解析与复核','Document review path'],[
        n('paper','source','多版式提单与托书','Bills & booking forms','印章、歪斜、跨页和不同客户的版式会改变字段位置，输入保留原图坐标。','Stamps, skew, page breaks and customer layouts move fields. Keep source coordinates.'),
        n('queue','rule','批量异步队列与印章弱化','Queue & stamp attenuation','异步拆票处理，弱化红蓝色印章通道只用于解析。复核仍显示带章原文。','Process documents asynchronously. Attenuate red and blue ink for parsing and retain the stamped source for review.'),
        n('parse','model','OCR / 版面与 VLM 分流','OCR / layout & regional VLM','常规区域走 OCR 与版面，遮挡和复杂字段走多模态；两路候选连同来源一起保留。','Use OCR and layout for regular areas, VLM for complex regions. Preserve both candidates with their sources.'),
        n('flags','rule','格式、双路冲突与红线标疑','Checks, conflicts & red flags','校验 ISO 箱号、件重尺加总。双路值不一致标红，目的港等业务红线即便一致仍须确认。','Check container digits and quantity, weight or volume totals. Flag route disagreements. Sensitive fields still require review.'),
        n('review','human','左图右表 · 人工复核门禁','Source-linked review gate','点字段定位原文。所有冲突须修正，红线字段逐一签认，才能进入写入步骤。','Select a field to locate its source. Resolve every conflict and individually confirm sensitive fields.'),
        n('write','rule','标准 Schema → 客户映射 → API','Standard schema → customer API','先输出通用物流结构，再按客户字段适配。演示只预览映射结果，不发送业务请求。','Normalise freight fields first, then map them to a customer schema. The demo previews the payload locally.')
      ])]}
  ];
}
