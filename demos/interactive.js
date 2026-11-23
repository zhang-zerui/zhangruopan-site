"use strict";
var RuopanDemo;
(function (RuopanDemo) {
    RuopanDemo.badge = '脱敏逻辑复原 · 模拟演示数据（Synthetic Demo）';
    RuopanDemo.roles = {
        source: ['数据来源', 'Source'], rule: ['确定性规则', 'Rule'], model: ['模型', 'Model'], human: ['人工', 'Human']
    };
    const n = (id, kind, zh, en, note, english) => ({ id, kind, label: [zh, en], note: [note, english] });
    function graph(title, nodes, rows, edges) {
        return { title, nodes, rows: rows || nodes.map(node => [node.id]),
            edges: edges || nodes.slice(1).map((node, i) => [nodes[i].id, node.id]) };
    }
    RuopanDemo.studies = [
        { id: 'ads', project: 'project-ads', title: ['广告与库存联合决策 Agent', 'Ad spend & sellable stock'],
            question: ['投放回报很好，什么时候仍要拦住加预算建议？', 'When should strong ad returns still hold back a budget recommendation?'],
            action: ['切换三种库存与归因状态', 'Compare three decision scenarios'], graphs: [graph(['决策链路', 'Decision path'], [
                    n('sources', 'source', '广告平台与 ERP 只读数据', 'Ad platforms & read-only ERP', '按店铺、站点、币种和归因口径取数。账面在库量与可售量分开保存。', 'Scope inputs by shop, site, currency and attribution. Keep on-hand and sellable units separate.'),
                    n('readiness', 'rule', '数据就绪与组合 SKU 映射', 'Freshness & bundle mapping', '检查两期同步水位和 T+1 回刷窗口。每个组合 SKU 必须映射到本站点的可售组件。', 'Check both sync watermarks and the T+1 revision window. A bundle needs a verified mapping to sellable components at this site.'),
                    n('query', 'rule', '固定 SQL / API · 两期汇总', 'Fixed SQL / API · period totals', '模板锁定过滤条件和分母，避免 Text-to-SQL 改写口径。TikTok 按期汇总归因收入÷花费；Shopee 按站点单列 ROAS。', 'Fixed queries preserve filters and denominators. TikTok divides period revenue by period spend. Shopee uses its own site-level ROAS.'),
                    n('grade', 'rule', '工程置信度 · 高 / 中 / 低', 'Engineering confidence', '同步、回刷期与库存核验直接决定评级。这里的高、中、低来自工程规则，不是模型自评。', 'Freshness, the revision window and inventory checks set the grade. The model cannot raise it.'),
                    n('stock', 'rule', '可售库存 · 建议层拦截', 'Sellable stock · advice gate', '可售量不足或映射缺失时，隐藏加预算动作。系统提供建议，预算执行权仍由运营持有。', 'Low or unverified sellable stock removes the increase action. The operator retains budget execution authority.'),
                    n('gateway', 'model', '多模型网关 · 归因解释', 'Model gateway · explanation', '模型只接收已核准的指标、等级和允许的建议类型，负责组织解释。模型异常时仍可读原始规则结果。', 'Models receive verified totals, grade and allowed actions. The rule result remains available if explanation generation fails.'),
                    n('owner', 'human', '人工执行与绕过留痕', 'Human execution & audit', '采纳与实际调整分开记录。绕过写入周复盘记录，保留站点、SKU 和原因，供运营与 IT 核对。', 'Adoption and execution are distinct. A bypass records the site, SKU and reason for weekly operations and IT review.')
                ])] },
        { id: 'rules', project: 'project-notifications', title: ['ERP 对话式规则与 Dify 管控台', 'Conversational ERP rules & Dify controls'],
            question: ['一句话催付款，怎样避免催到已经付清的单？', 'How do you prevent a reminder after the final payment clears?'],
            action: ['试跑规则并核对原单', 'Dry-run a rule against its documents'], graphs: [
                graph(['NL2Rule 规则链路', 'NL2Rule pipeline'], [
                    n('form', 'human', '手动配置表单', 'Manual form', '表单规定字段、运算符和接收人。自然语言入口与表单共用同一份结构。', 'The form defines fields, operators and recipients. Both entry paths use the same structure.'),
                    n('prefill', 'model', '一句话预填', 'Language prefill', '模型只起草条件。不能新建字段、执行 SQL 或直接发出通知。', 'The model drafts conditions. It cannot invent fields, execute SQL or send a notification.'),
                    n('dsl', 'rule', '受控 JSON DSL 校验', 'Validate JSON DSL', '只接受白名单事件、状态、时间条件和接收人。无法表达的指令留给人修改。', 'Validate events, states, time constraints and recipients against an allowlist. Ask for revision when a rule cannot be expressed.'),
                    n('trial', 'rule', '中文反译与试跑原单', 'Read-back & dry run', '从结构化条件反译，列出命中单据和来源，供业务核对“且 / 或”及时间边界。', 'Render the rule back from its structure. Source previews expose AND / OR and time boundaries.'),
                    n('confirm', 'human', '人工确认落库', 'Human confirmation', '只有人工确认才保存。修改草稿会使上一次试跑失效。', 'Only a person can confirm a rule. Editing the draft invalidates its previous trial.'),
                    n('scan', 'rule', '从库扫描 · 资金发前复核', 'Replica scan & primary check', '定时从只读从库扫描。付款提醒发出前再查主库，期间已全额付款的单据跳过。', 'Scan a read replica on schedule. Recheck payment on the primary immediately before sending and skip settled bills.'),
                    n('push', 'rule', '按风险分级推送', 'Risk-based delivery', 'PMC 汇总可按周推送，付款催办采用更高检查频率。接收人仍由业务角色映射确定。', 'PMC summaries can run weekly. Payment rules check more frequently. Business roles determine recipients.'),
                    n('monitor', 'rule', '回执、重试与静默告警', 'Receipts, retries & silence', '记录发送结果、失败重试和单条评价。有预期命中却持续为零时发监控告警。', 'Track receipts, retries and per-message feedback. Flag unexpected zero hits on a monitored run.')
                ], [['form', 'prefill'], ['dsl'], ['trial'], ['confirm'], ['scan'], ['push'], ['monitor']], [['form', 'dsl'], ['prefill', 'dsl'], ['dsl', 'trial'], ['trial', 'confirm'], ['confirm', 'scan'], ['scan', 'push'], ['push', 'monitor']]),
                graph(['Dify 管控台与权限', 'Dify control plane'], [
                    n('org', 'source', '飞书组织架构', 'Feishu organisation', '用组织成员与岗位识别身份，变更沿 ERP 既有权限关系生效。', 'Resolve people and roles through the organisation and its existing ERP grants.'),
                    n('erp', 'rule', '复用 ERP 权限底座', 'Reuse ERP permissions', '权限直接读取既有底座，避免两套授权表双写和回收延迟。', 'Read the existing entitlement source to avoid duplicate writes and stale revocations.'),
                    n('auth', 'rule', '统一鉴权网关', 'Shared access gateway', '把身份、角色和额度交给网关核验。工作流调用也需同样授权。', 'The gateway checks identity, role and quota, including calls originating in a workflow.'),
                    n('mcp', 'rule', 'MCP 过滤与审计', 'MCP filter & audit', '按用户先过滤工具再允许调用，授权及回收都有记录。', 'Filter the tool list per user before invocation and audit grants and revocations.'),
                    n('image', 'model', '外部生图与费用托管', 'Image API & spend controls', '示例 Nano Banana 先过额度检查，再提交轻量生图流程，费用记在网关。', 'A sample Nano Banana workflow checks quota before generation and attributes usage at the gateway.'),
                    n('ops', 'human', '运营问数端', 'Operations workspace', '运营只能访问授权工具和业务结果。工作流配置保留在开发端。', 'Operators see approved tools and business results. Workflow configuration stays in the developer workspace.'),
                    n('dev', 'human', '开发配置端', 'Developer workspace', '研发可以维护工作流、账户额度和工具配置，变更进入回归。', 'Developers maintain workflows, quotas and tools, then run regression checks.'),
                    n('assert', 'rule', 'PRD 断言与 Mock 快照回归', 'Assertions & mock snapshots', '用原问题核对工具可见性、拒绝原因与输出字段。一键回归使用固定模拟快照。', 'Replay a fixed mock snapshot against PRD assertions for tool visibility, denials and output fields.')
                ], [['org'], ['erp'], ['auth'], ['mcp', 'image'], ['ops', 'dev'], ['assert']], [['org', 'erp'], ['erp', 'auth'], ['auth', 'mcp'], ['auth', 'image'], ['mcp', 'ops'], ['image', 'ops'], ['mcp', 'dev'], ['image', 'dev'], ['dev', 'assert']])
            ] },
        { id: 'support', project: 'project-support', title: ['Shopee 硬件客服与售后 Agent', 'Shopee hardware support'],
            question: ['买家突然要求退款时，正在进行的排障会怎样？', 'What happens when a refund request interrupts troubleshooting?'],
            action: ['运行三段买家对话', 'Play three buyer conversations'], graphs: [graph(['售后消息链路', 'After-sales workflow'], [
                    n('shops', 'source', 'Shopee Chat API · 分店授权', 'Shopee Chat API · per shop', '多品牌多店铺各自持有 shop_id OAuth 授权和会话空间，避免串店查单和凭据混用。', 'Each shop has its own OAuth grant and conversation scope to avoid cross-shop lookups or credential reuse.'),
                    n('redis', 'rule', 'Redis 防抖与令牌桶', 'Redis debounce & rate limit', '同店同会话碎片等候 5–8 秒静默后合并。令牌桶限流时排队或交人工。', 'Combine fragments after 5–8 seconds of quiet per shop and thread. A rate-limited message queues or goes to staff.'),
                    n('guard', 'rule', '全局红线 · 随时打断', 'Global interrupt guard', '每轮先检查退款、投诉和情绪升级。命中即打断已有工作流，人工决定退款。', 'Check refunds, complaints and escalation on every turn. A hit interrupts the current workflow and leaves the decision to staff.'),
                    n('state', 'rule', 'Dify 状态化多轮排障', 'Dify stateful workflow', '保存轮次、意图及已核机型。每次状态转移前重新经过红线守卫。', 'Carry the turn, intent and verified model forward. Recheck the guard before each transition.'),
                    n('identify', 'model', '订单反查 / VLM 锁机型', 'Order lookup / VLM identification', '优先按本店订单锁机型。图像证据不足时保留未知并转人工，避免跨机型指导。', 'Prefer a shop-scoped order lookup. A weak image leaves the model unknown and transfers the case.'),
                    n('orders', 'rule', '固定 SQL / HTTP 查单', 'Fixed SQL / HTTP lookup', '已入库走参数化模板，未入库走既有 HTTP 接口，失败后交人工。', 'Use fixed parameterised SQL for stored orders and the existing HTTP endpoint otherwise. Failed lookups go to staff.'),
                    n('kb', 'source', '问题 × 机型知识与术语', 'Issue × model & glossary', '检索先限定问题和机型，出稿前再核对当地术语、图示和步骤。', 'Filter by issue and model, then check local terms, illustrations and instructions before release.'),
                    n('reply', 'human', 'Copilot 草稿 / 标准自动回复', 'Copilot draft / standard reply', '只有已验证的高频标准问题自动回复，证据不足或触发红线时仅供人工参考。', 'Verified routine questions may receive an automatic answer. Uncertain or sensitive cases produce a staff-only draft.')
                ], [['shops'], ['redis'], ['guard'], ['state'], ['identify'], ['orders', 'kb'], ['reply']], [['shops', 'redis'], ['redis', 'guard'], ['guard', 'state'], ['state', 'identify'], ['identify', 'orders'], ['identify', 'kb'], ['orders', 'reply'], ['kb', 'reply']])] },
        { id: 'documents', project: 'project-docs', title: ['多模态物流单据与人工复核', 'Multimodal freight document review'],
            question: ['模型读错一位箱号，谁能在写入前发现？', 'How do you catch a one-digit container error before writing it back?'],
            action: ['对照提单修正并放行', 'Reconcile a bill and release the write'], graphs: [graph(['单据解析与复核', 'Document review path'], [
                    n('paper', 'source', '多版式提单与托书', 'Bills & booking forms', '印章、歪斜、跨页和不同客户的版式会改变字段位置，输入保留原图坐标。', 'Stamps, skew, page breaks and customer layouts move fields. Keep source coordinates.'),
                    n('queue', 'rule', '批量异步队列与印章弱化', 'Queue & stamp attenuation', '异步拆票处理，弱化红蓝色印章通道只用于解析。复核仍显示带章原文。', 'Process documents asynchronously. Attenuate red and blue ink for parsing and retain the stamped source for review.'),
                    n('parse', 'model', 'OCR / 版面与 VLM 分流', 'OCR / layout & regional VLM', '常规区域走 OCR 与版面，遮挡和复杂字段走多模态；两路候选连同来源一起保留。', 'Use OCR and layout for regular areas, VLM for complex regions. Preserve both candidates with their sources.'),
                    n('flags', 'rule', '格式、双路冲突与红线标疑', 'Checks, conflicts & red flags', '校验 ISO 箱号、件重尺加总。双路值不一致标红，目的港等业务红线即便一致仍须确认。', 'Check container digits and quantity, weight or volume totals. Flag route disagreements. Sensitive fields still require review.'),
                    n('review', 'human', '左图右表 · 人工复核门禁', 'Source-linked review gate', '点字段定位原文。所有冲突须修正，红线字段逐一签认，才能进入写入步骤。', 'Select a field to locate its source. Resolve every conflict and individually confirm sensitive fields.'),
                    n('write', 'rule', '标准 Schema → 客户映射 → API', 'Standard schema → customer API', '先输出通用物流结构，再按客户字段适配。演示只预览映射结果，不发送业务请求。', 'Normalise freight fields first, then map them to a customer schema. The demo previews the payload locally.')
                ])] }
    ];
})(RuopanDemo || (RuopanDemo = {}));
var RuopanDemo;
(function (RuopanDemo) {
    // Each row contains prior spend/revenue, then current spend/revenue in THB.
    RuopanDemo.adScenarios = [
        { id: 'A', name: ['高可信 · 建议放量', 'High · eligible to scale'], site: 'SHOP-DEMO-TH-01', sku: 'SKU-DEMO-001', synced: true, revised: true, mapped: true, available: 560, velocity: 20, book: 700,
            figures: { tiktok: [[1000, 2800, 1200, 4200], [500, 1400, 800, 3800]], shopee: [[900, 2400, 1100, 3400], [600, 1500, 700, 2900]] } },
        { id: 'B', name: ['中可信 · T+1 回刷', 'Medium · T+1 revisions'], site: 'SHOP-DEMO-TH-01', sku: 'SKU-DEMO-002', synced: true, revised: false, mapped: true, available: 360, velocity: 18, book: 390,
            figures: { tiktok: [[1000, 2500, 1200, 3600], [500, 1550, 800, 2800]], shopee: [[700, 1750, 900, 2700], [500, 1250, 650, 2080]] } },
        { id: 'C', name: ['低可信 · 库存拦截', 'Low · stock hold'], site: 'SHOP-DEMO-TH-02', sku: 'SKU-DEMO-SET-003', synced: true, revised: true, mapped: false, available: null, velocity: 30, book: 840,
            figures: { tiktok: [[1000, 3400, 1200, 6000], [500, 2000, 800, 4400]], shopee: [[850, 2975, 1000, 5000], [500, 1600, 700, 3710]] } }
    ];
    RuopanDemo.channelLabels = { tiktok: 'TikTok Shop · GMV Max ROI', shopee: 'Shopee · ROAS' };
    RuopanDemo.adPeriods = ['2026-04-06 – 04-12', '2026-04-13 – 04-19'];
    RuopanDemo.ruleExamples = {
        approval: ['东南亚新品审批超 24 小时未审提醒对应负责人并带单号直达', 'Remind the owner about Southeast Asian new-product approvals pending over 24 hours, with a direct document link.'],
        payment: ['跨境物流尾款未付款及部分付款超期催付，排除已全额付款单据', 'Chase overdue cross-border logistics balances that are unpaid or partially paid. Exclude fully paid bills.']
    };
    RuopanDemo.billStates = { PENDING: ['未审批', 'Pending'], APPROVED: ['已审批', 'Approved'], UNPAID: ['未付款', 'Unpaid'], PARTIAL: ['部分付款', 'Partly paid'], PAID: ['已全额付款', 'Fully paid'] };
    RuopanDemo.trialDocs = [
        { id: 'APR-DEMO-SEA-001', kind: 'approval', replica: 'PENDING', primary: 'PENDING', hours: 49, owner: 'OWNER-DEMO-TH', region: 'SEA' },
        { id: 'APR-DEMO-SEA-002', kind: 'approval', replica: 'PENDING', primary: 'PENDING', hours: 31, owner: 'OWNER-DEMO-MY', region: 'SEA' },
        { id: 'APR-DEMO-SEA-003', kind: 'approval', replica: 'PENDING', primary: 'PENDING', hours: 25, owner: 'OWNER-DEMO-PH', region: 'SEA' },
        { id: 'APR-DEMO-SEA-004', kind: 'approval', replica: 'PENDING', primary: 'PENDING', hours: 24, owner: 'OWNER-DEMO-TH', region: 'SEA' },
        { id: 'APR-DEMO-SEA-005', kind: 'approval', replica: 'APPROVED', primary: 'APPROVED', hours: 51, owner: 'OWNER-DEMO-MY', region: 'SEA' },
        { id: 'PAY-DEMO-SEA-001', kind: 'payment', replica: 'UNPAID', primary: 'UNPAID', hours: 36, owner: 'FIN-DEMO-TH', region: 'SEA' },
        { id: 'PAY-DEMO-SEA-002', kind: 'payment', replica: 'PARTIAL', primary: 'PARTIAL', hours: 18, owner: 'FIN-DEMO-MY', region: 'SEA' },
        { id: 'PAY-DEMO-SEA-003', kind: 'payment', replica: 'PARTIAL', primary: 'PAID', hours: 6, owner: 'FIN-DEMO-PH', region: 'SEA' },
        { id: 'PAY-DEMO-SEA-004', kind: 'payment', replica: 'PAID', primary: 'PAID', hours: 48, owner: 'FIN-DEMO-TH', region: 'SEA' },
        { id: 'PAY-DEMO-SEA-005', kind: 'payment', replica: 'UNPAID', primary: 'UNPAID', hours: 0, owner: 'FIN-DEMO-TH', region: 'SEA' }
    ];
    const msg = (who, time, zh, en, art) => ({ who, time, text: [zh, en], art });
    const waitTerms = ['待核对', 'Pending'];
    const step = (node, model, risk, tool, glossary, ...messages) => ({ node, model, risk, tool, glossary, messages });
    RuopanDemo.chatScripts = [
        { name: ['订单反查与装纸排障', 'Order lookup & paper loading'], shop: 'SHOP-DEMO-TH-01', steps: [
                step(['接收碎片 1/3', 'Receive fragment 1/3'], null, 'clear', 'Shopee Chat · OAuth', waitTerms, msg('buyer', '00:00', 'สวัสดีค่ะ · 你好', 'สวัสดีค่ะ · Hello')),
                step(['接收碎片 2/3', 'Receive fragment 2/3'], null, 'clear', 'Redis · buffer', waitTerms, msg('buyer', '00:01', 'กระดาษไม่ออก · 打印机不出纸', 'กระดาษไม่ออก · No paper comes out')),
                step(['接收碎片 3/3', 'Receive fragment 3/3'], null, 'clear', 'Redis · buffer', waitTerms, msg('buyer', '00:03', '订单 ORD-DEMO-SEA-202604，怎么装纸？', 'My order is ORD-DEMO-SEA-202604. How do I load the roll?')),
                step(['防抖合并 · 红线检查通过', 'Merge fragments · guard clear'], null, 'clear', 'Redis · 6 s', waitTerms, msg('system', '00:09', '静默 6 秒，3 条碎片合并为 1 次处理。', 'After 6 quiet seconds, three fragments enter one workflow.')),
                step(['订单反查锁定机型', 'Identify model from order'], 'P-DEMO-M1', 'clear', 'Fixed SQL · ORD-DEMO-SEA-202604', waitTerms, msg('system', '00:10', '本店已入库订单命中标签打印机 P-DEMO-M1。', 'The stored order in this shop identifies label printer P-DEMO-M1.')),
                step(['二维知识库 · 标准回复', 'Model-specific answer'], 'P-DEMO-M1', 'clear', 'KB · paper-feed × P-DEMO-M1', ['泰语「进纸键」已核对', 'Thai feed-button term verified'], msg('agent', '00:11', '请打开上盖，按图放入标签卷，再合盖按一次进纸键（ปุ่มป้อนกระดาษ）。', 'Open the cover, insert the roll as shown, then close it and press feed (ปุ่มป้อนกระดาษ) once.', 'guide')),
                step(['买家确认 · 排障完成', 'Buyer confirms resolution'], 'P-DEMO-M1', 'clear', 'Shopee Chat · closed', ['图示与机型相符', 'Guide matches model'], msg('buyer', '00:20', 'พิมพ์ได้แล้ว · 已经可以打印了。', 'พิมพ์ได้แล้ว · It prints now.'))
            ] },
        { name: ['模糊机身图转人工', 'Unclear photo → staff'], shop: 'SHOP-DEMO-MY-02', steps: [
                step(['接收机身照片', 'Receive device photo'], null, 'clear', 'Shopee Chat · OAuth', waitTerms, msg('buyer', '00:00', 'Label dah pudar. 机身标签模糊，能认出型号吗？', 'Label dah pudar. Can you identify the printer from this photo?', 'blur')),
                step(['实时查单未匹配', 'Live order lookup: no match'], null, 'clear', 'HTTP · shop-scoped lookup', waitTerms, msg('system', '00:03', '已入库查询无匹配，HTTP 直查也未找到可核对的机型。', 'No stored match. A live HTTP lookup also returns no verifiable model.')),
                step(['VLM 证据不足', 'VLM evidence insufficient'], null, 'uncertain', 'VLM · 0.42 / 0.80', waitTerms, msg('system', '00:05', '识图分数 0.42，低于演示阈值 0.80。保留机型未知，停止检索机型手册。', 'Image score 0.42 is below the demo threshold of 0.80. Keep model unknown and stop manual retrieval.')),
                step(['转人工 · 草稿辅助', 'Transfer with a draft'], null, 'uncertain', 'Copilot · staff only', ['马来语铭牌用词已核对', 'Malay label term verified'], msg('draft', '00:06', '请人工索取清晰铭牌或订单号。当前证据不足以给出对应机型的安装步骤。', 'Ask for a clear device label or order number. The evidence does not support model-specific instructions.'))
            ] },
        { name: ['第二轮退款红线打断', 'Refund interrupts turn two'], shop: 'SHOP-DEMO-TH-01', steps: [
                step(['第一轮 · 订单锁机型', 'Turn one · identify model'], 'P-DEMO-M1', 'clear', 'Fixed SQL · ORD-DEMO-SEA-202605', waitTerms, msg('buyer', '00:00', '订单 ORD-DEMO-SEA-202605，标签卷卡住了。', 'Order ORD-DEMO-SEA-202605. The label roll is stuck.')),
                step(['第一轮 · 排障中', 'Turn one · troubleshoot'], 'P-DEMO-M1', 'clear', 'KB · paper-feed × P-DEMO-M1', ['步骤已核对', 'Steps verified'], msg('agent', '00:05', '可以先描述一下进纸键的指示灯吗？', 'What does the feed-button indicator show?')),
                step(['第二轮 · 全局红线触发', 'Turn two · global interrupt'], 'P-DEMO-M1', 'red', 'Global guard · refund + rating', ['停止生成回复', 'Reply generation stopped'], msg('buyer', '00:10', '机器坏了快退钱否则给 1 星', 'This machine is broken. Refund me now or I will give one star.'), msg('system', '00:10', '退款诉求和差评威胁命中，立即中止排障。', 'Refund demand and review threat detected. Troubleshooting stops immediately.')),
                step(['高危转人工 · 禁止退款承诺', 'High-risk handoff'], 'P-DEMO-M1', 'red', 'Handoff · staff only', ['人工判责', 'Staff decision'], msg('draft', '00:11', '高危原因：退款诉求及一星威胁。请人工核对订单与售后政策，尚未承诺退款。', 'Refund demand and one-star threat. Staff should review the order and returns policy. No refund commitment has been made.'))
            ] }
    ];
    RuopanDemo.docFields = [
        { key: 'blNo', label: '提单号', en: 'Bill of lading', source: 'BL-DEMO-089', initial: 'BL-DEMO-089', box: [34, 126, 255, 54] },
        { key: 'vessel', label: '船名 / 航次', en: 'Vessel / voyage', source: 'DEMO STAR / V089', initial: 'DEMO STAR / V089', box: [300, 126, 246, 54] },
        { key: 'loading', label: '起运港', en: 'Port of loading', source: 'SHENZHEN', initial: 'SHENZHEN', box: [34, 204, 255, 64] },
        { key: 'discharge', label: '目的港', en: 'Port of discharge', source: 'BANGKOK', initial: 'BANGKOK', requiredReview: true, box: [300, 204, 246, 64] },
        { key: 'container', label: '集装箱号', en: 'Container number', source: 'DEMU0000891', initial: 'DEMU0000898', box: [34, 302, 255, 62] },
        { key: 'packages', label: '总件数', en: 'Package count', source: '160', initial: '160', requiredReview: true, box: [300, 302, 246, 62] },
        { key: 'weightA', label: '明细 A 毛重（kg）', en: 'Line A gross (kg)', source: '4,800', initial: '4800', box: [34, 424, 255, 56] },
        { key: 'weightB', label: '明细 B 毛重（kg）', en: 'Line B gross (kg)', source: '3,200', initial: '3200', box: [300, 424, 246, 56] },
        { key: 'gross', label: '总毛重（kg）', en: 'Total gross (kg)', source: '8,000', initial: '8800', box: [34, 512, 512, 60] }
    ];
})(RuopanDemo || (RuopanDemo = {}));
var RuopanDemo;
(function (RuopanDemo) {
    function periodTotals(rows, offset) {
        const spend = rows.reduce((sum, row) => sum + row[offset], 0);
        const revenue = rows.reduce((sum, row) => sum + row[offset + 1], 0);
        return { spend, revenue, ratio: spend > 0 ? revenue / spend : null };
    }
    RuopanDemo.periodTotals = periodTotals;
    function assessAd(s) {
        const days = s.available !== null && s.velocity > 0 ? s.available / s.velocity : null;
        const blocked = !s.synced || !s.mapped || days === null || days < 7;
        const grade = blocked ? 'bad' : s.revised ? 'good' : 'warn';
        return { days, grade, mayAdopt: grade === 'good' };
    }
    RuopanDemo.assessAd = assessAd;
    function translateRule(text) {
        const normalized = text.trim().replace(/\s+/g, ' ').toLowerCase();
        const isPayment = RuopanDemo.ruleExamples.payment.some(s => s.toLowerCase() === normalized);
        if (isPayment)
            return { event: 'logistics_balance', states: ['UNPAID', 'PARTIAL'], elapsed: { field: 'overdue_hours', op: 'gt', value: 0 }, recipient: 'payment_owner', link: 'source_document', primaryRecheck: true };
        for (const example of RuopanDemo.ruleExamples.approval) {
            const shape = example.toLowerCase().replace('24', '{hours}');
            const digits = normalized.match(/\d+/g);
            if (digits?.length !== 1 || normalized.replace(digits[0], '{hours}') !== shape)
                continue;
            const hours = Number(digits[0]);
            if (!Number.isSafeInteger(hours) || hours < 1 || hours > 720)
                return null;
            return { event: 'new_product_approval', region: 'SEA', states: ['PENDING'], elapsed: { field: 'pending_hours', op: 'gt', value: hours }, recipient: 'approval_owner', link: 'source_document', primaryRecheck: false };
        }
        return null;
    }
    RuopanDemo.translateRule = translateRule;
    function readBack(r) {
        return r.event === 'logistics_balance'
            ? ['仅当物流尾款已逾期且付款状态为未付款或部分付款，才提醒付款负责人。发前按主库排除已全额付款的单据，消息附原单链接。', 'Notify the payment owner only for overdue balances that are unpaid or partly paid. Recheck the primary before delivery, exclude fully paid bills and attach a source link.']
            : ['仅当东南亚新品仍待审批且等待超过 ' + r.elapsed.value + ' 小时，才通知该单审批负责人，并附单号及原单链接。', 'Notify the document owner only for pending Southeast Asian new-product approvals waiting strictly longer than ' + r.elapsed.value + ' hours. Include the document ID and link.'];
    }
    RuopanDemo.readBack = readBack;
    function runTrial(rule, source = RuopanDemo.trialDocs) {
        return source.filter(doc => doc.kind === (rule.event === 'new_product_approval' ? 'approval' : 'payment') && (!rule.region || doc.region === rule.region) && rule.states.includes(doc.replica) && doc.hours > rule.elapsed.value);
    }
    RuopanDemo.runTrial = runTrial;
    function deliveryPlan(rule, hits) {
        return { send: hits.filter(d => !rule.primaryRecheck || rule.states.includes(d.primary)), skip: hits.filter(d => rule.primaryRecheck && !rule.states.includes(d.primary)) };
    }
    RuopanDemo.deliveryPlan = deliveryPlan;
    function isoDigit(prefix) {
        if (!/^[A-Z]{3}[UJZ]\d{6}$/.test(prefix))
            return null;
        const table = '0123456789A BCDEFGHIJK LMNOPQRSTU VWXYZ';
        const total = Array.from(prefix).reduce((sum, c, i) => sum + table.indexOf(c) * 2 ** i, 0);
        return (total % 11) % 10;
    }
    RuopanDemo.isoDigit = isoDigit;
    function validContainer(value) {
        return /^[A-Z]{3}[UJZ]\d{7}$/.test(value) && isoDigit(value.slice(0, 10)) === Number(value[10]);
    }
    RuopanDemo.validContainer = validContainer;
    function initialFields() {
        return Object.fromEntries(RuopanDemo.docFields.map(f => [f.key, f.initial]));
    }
    RuopanDemo.initialFields = initialFields;
    const numericFields = ['packages', 'weightA', 'weightB', 'gross'];
    function numeric(value) {
        if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value.trim()))
            return NaN;
        return Number(value.trim().replace(/,/g, ''));
    }
    RuopanDemo.numeric = numeric;
    function checkField(f, values, checked) {
        const raw = values[f.key].trim();
        if (f.key === 'container' && !validContainer(raw))
            return { tone: 'bad', reason: ['ISO 校验位异常', 'Invalid ISO check digit'] };
        if (f.key === 'gross' && numeric(raw) !== numeric(values.weightA) + numeric(values.weightB))
            return { tone: 'bad', reason: ['明细加总与总毛重不一致', 'Line weights do not equal the total'] };
        const match = numericFields.includes(f.key) ? numeric(raw) === numeric(f.source) : raw === f.source;
        if (!match)
            return { tone: 'bad', reason: ['与原文不符，请对照框选位置', 'Does not match the highlighted source'] };
        if (f.requiredReview && !checked[f.key])
            return { tone: 'warn', reason: f.key === 'discharge' ? ['印章遮挡 · 待人工确认', 'Stamp overlap · review required'] : ['红线字段 · 待人工确认', 'Sensitive field · review required'] };
        return { tone: 'good', reason: f.requiredReview ? ['已人工复核', 'Reviewed by a person'] : ['校验通过', 'Verified'] };
    }
    RuopanDemo.checkField = checkField;
    function reviewStatus(values, checked) {
        const results = RuopanDemo.docFields.map(f => checkField(f, values, checked));
        const conflicts = results.filter(s => s.tone === 'bad').length;
        const pending = results.filter(s => s.tone === 'warn').length;
        return { results, conflicts, pending, ready: conflicts === 0 && pending === 0 };
    }
    RuopanDemo.reviewStatus = reviewStatus;
    function mappingPreview(v, checked) {
        if (!reviewStatus(v, checked).ready)
            return null;
        const standard = { billId: v.blNo, vesselVoyage: v.vessel, loadingPort: v.loading, dischargePort: v.discharge, containerNo: v.container, packages: numeric(v.packages), lineWeightsKg: [numeric(v.weightA), numeric(v.weightB)], grossWeightKg: numeric(v.gross) };
        const customer = { reference: standard.billId, voyage: standard.vesselVoyage, origin: standard.loadingPort, destination: standard.dischargePort, equipment: standard.containerNo, pieces: standard.packages, weights_kg: standard.lineWeightsKg, weight_kg: standard.grossWeightKg };
        return { standard, customer };
    }
    RuopanDemo.mappingPreview = mappingPreview;
})(RuopanDemo || (RuopanDemo = {}));
var RuopanDemo;
(function (RuopanDemo) {
    RuopanDemo.Locale = React.createContext('zh');
    function useWords() { const lang = React.useContext(RuopanDemo.Locale); return (zh, en) => lang === 'zh' ? zh : en; }
    RuopanDemo.useWords = useWords;
    function Badge() { return React.createElement("span", { className: "dx-badge" }, RuopanDemo.badge); }
    RuopanDemo.Badge = Badge;
    function Status({ tone, children }) { return React.createElement("span", { className: 'dx-status dx-' + tone },
        React.createElement("i", { "aria-hidden": "true" }),
        children); }
    RuopanDemo.Status = Status;
    function Panel({ title, children }) { return React.createElement("section", { className: "dx-panel" },
        React.createElement("h3", null, title),
        children); }
    RuopanDemo.Panel = Panel;
    function Modal({ title, children, close }) {
        const ref = React.useRef(null);
        const id = React.useId();
        const t = useWords();
        React.useEffect(() => {
            const dialog = ref.current;
            const previous = document.activeElement;
            if (typeof dialog.showModal === 'function')
                dialog.showModal();
            else
                dialog.setAttribute('open', '');
            return () => { if (dialog.open && typeof dialog.close === 'function')
                dialog.close(); previous?.focus?.({ preventScroll: true }); };
        }, []);
        return React.createElement("dialog", { className: "dx-dialog", ref: ref, "aria-labelledby": id, onCancel: e => { e.preventDefault(); close(); }, onClick: e => { if (e.target === e.currentTarget)
                close(); }, onKeyDown: e => { if (e.key === 'Escape') {
                e.preventDefault();
                close();
            } } },
            React.createElement("div", { className: "dx-dialog-inner" },
                React.createElement("div", { className: "dx-dialog-head" },
                    React.createElement("h3", { id: id }, title),
                    React.createElement("button", { type: "button", className: "dx-close", onClick: close, "aria-label": t('关闭', 'Close') }, "\u00D7")),
                children));
    }
    RuopanDemo.Modal = Modal;
    function textUnits(s) { return Array.from(s).reduce((sum, c) => sum + (/[\u3000-\uffef]/.test(c) ? 1 : 0.58), 0); }
    function wrapLabel(text, limit) {
        const parts = text.match(/[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*|\s+|./gu) || [];
        const lines = [];
        let current = '';
        for (const part of parts) {
            if (current.trim() && textUnits(current + part) > limit) {
                lines.push(current.trim());
                current = part.trimStart();
            }
            else
                current += part;
        }
        if (current.trim())
            lines.push(current.trim());
        return lines;
    }
    RuopanDemo.wrapLabel = wrapLabel;
    function Diagram({ graph }) {
        const t = useWords();
        const [selected, select] = React.useState(graph.nodes[0].id);
        const [opened, open] = React.useState(null);
        const holder = React.useRef(null);
        const [size, setSize] = React.useState(440);
        const marker = 'dx-arrow-' + React.useId().replace(/:/g, '');
        React.useLayoutEffect(() => {
            const el = holder.current;
            const measure = () => { const w = el.getBoundingClientRect().width; if (w > 0)
                setSize(Math.min(640, Math.max(230, Math.floor(w)))); };
            measure();
            if (typeof ResizeObserver === 'undefined') {
                window.addEventListener('resize', measure);
                return () => window.removeEventListener('resize', measure);
            }
            const observer = new ResizeObserver(measure);
            observer.observe(el);
            return () => observer.disconnect();
        }, []);
        const gap = size < 360 ? 10 : 18, pad = 4, maxSingle = 390, vertical = 22;
        const boxes = {};
        let bottom = pad;
        for (const row of graph.rows) {
            const w = Math.min(row.length === 1 ? maxSingle : 300, (size - 2 * pad - gap * (row.length - 1)) / row.length);
            const labels = row.map(id => wrapLabel(t(...graph.nodes.find(n => n.id === id).label), (w - 18) / 13));
            const h = Math.max(42, Math.max(...labels.map(a => a.length)) * 16 + 18);
            const start = (size - (row.length * w + (row.length - 1) * gap)) / 2;
            row.forEach((id, i) => boxes[id] = { x: start + i * (w + gap), y: bottom, w, h, lines: labels[i] });
            bottom += h + vertical;
        }
        const node = graph.nodes.find(n => n.id === selected) || graph.nodes[0];
        const dialogNode = graph.nodes.find(n => n.id === opened);
        return React.createElement("div", { className: "dx-architecture" },
            React.createElement("div", { className: "dx-diagram", ref: holder },
                React.createElement("svg", { viewBox: '0 0 ' + size + ' ' + (bottom - vertical + pad), role: "group", "aria-label": t(...graph.title) },
                    React.createElement("defs", null,
                        React.createElement("marker", { id: marker, viewBox: "0 0 8 8", refX: "7", refY: "4", markerWidth: "6", markerHeight: "6", orient: "auto" },
                            React.createElement("path", { d: "M1 1 L7 4 L1 7", fill: "none", stroke: "currentColor" }))),
                    graph.edges.map(([from, to]) => {
                        const a = boxes[from], b = boxes[to];
                        const x = a.x + a.w / 2, y = a.y + a.h, x2 = b.x + b.w / 2, y2 = b.y - 3, mid = (y + y2) / 2;
                        return React.createElement("path", { key: from + to, className: "dx-edge", d: 'M ' + x + ' ' + y + ' C ' + x + ' ' + mid + ' ' + x2 + ' ' + mid + ' ' + x2 + ' ' + y2, markerEnd: 'url(#' + marker + ')' });
                    }),
                    graph.nodes.map(n => {
                        const b = boxes[n.id], active = n.id === node.id;
                        const activate = () => { select(n.id); open(n.id); };
                        return React.createElement("g", { key: n.id, className: 'dx-node dx-role-' + n.kind + (active ? ' dx-selected' : ''), role: "button", tabIndex: 0, "aria-haspopup": "dialog", "aria-label": t(...n.label) + ' · ' + t(...RuopanDemo.roles[n.kind]), onMouseEnter: () => select(n.id), onFocus: () => select(n.id), onClick: activate, onKeyDown: e => { if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                activate();
                            } } },
                            React.createElement("rect", { x: b.x + 0.7, y: b.y + 0.7, width: b.w - 1.4, height: b.h - 1.4, rx: "6" }),
                            React.createElement("path", { className: "dx-role-stripe", d: 'M ' + (b.x + 3) + ' ' + (b.y + 9) + ' v ' + (b.h - 18) }),
                            React.createElement("text", { x: b.x + b.w / 2, y: b.y + (b.h - (b.lines.length - 1) * 16) / 2 + 4.5, textAnchor: "middle" }, b.lines.map((line, i) => React.createElement("tspan", { key: i, x: b.x + b.w / 2, dy: i ? 16 : 0 }, line))));
                    }))),
            React.createElement("aside", { className: "dx-inspection" },
                React.createElement("p", { className: "dx-label" }, t('节点说明', 'Node notes')),
                React.createElement("span", { className: 'dx-role-tag dx-role-' + node.kind }, t(...RuopanDemo.roles[node.kind])),
                React.createElement("h3", null, t(...node.label)),
                React.createElement("p", null, t(...node.note)),
                React.createElement("div", { className: "dx-legend" }, Object.keys(RuopanDemo.roles).map(k => React.createElement("span", { key: k, className: 'dx-role-tag dx-role-' + k }, t(...RuopanDemo.roles[k]))))),
            dialogNode && React.createElement(Modal, { title: t(...dialogNode.label), close: () => open(null) },
                React.createElement("span", { className: 'dx-role-tag dx-role-' + dialogNode.kind }, t(...RuopanDemo.roles[dialogNode.kind])),
                React.createElement("p", null, t(...dialogNode.note))));
    }
    RuopanDemo.Diagram = Diagram;
    function Architecture({ study }) {
        const t = useWords();
        const [index, set] = React.useState(0);
        return React.createElement(React.Fragment, null,
            study.graphs.length > 1 && React.createElement("div", { className: "dx-options", "aria-label": t('选择架构视图', 'Choose architecture view') }, study.graphs.map((g, i) => React.createElement("button", { type: "button", key: i, "aria-pressed": index === i, onClick: () => set(i) }, t(...g.title)))),
            React.createElement(Diagram, { graph: study.graphs[index], key: index }));
    }
    RuopanDemo.Architecture = Architecture;
})(RuopanDemo || (RuopanDemo = {}));
var RuopanDemo;
(function (RuopanDemo) {
    const fmt = (n) => n.toLocaleString('en-US', { maximumFractionDigits: 2 });
    function Advertising() {
        const t = RuopanDemo.useWords();
        const [index, choose] = React.useState(0), [channel, setChannel] = React.useState('tiktok');
        const [logs, setLogs] = React.useState([]);
        const s = RuopanDemo.adScenarios[index], decision = RuopanDemo.assessAd(s), rows = s.figures[channel], metric = channel === 'tiktok' ? 'ROI' : 'ROAS';
        const totals = [RuopanDemo.periodTotals(rows, 0), RuopanDemo.periodTotals(rows, 2)];
        const adopted = logs.some(l => l.sku === s.sku && l.channel === channel && l.event === 'adopt');
        const record = (event) => setLogs(prev => {
            if ((event === 'adopt' && (!decision.mayAdopt || prev.some(l => l.sku === s.sku && l.channel === channel && l.event === event))) || (event === 'bypass' && decision.grade !== 'bad'))
                return prev;
            return [{ id: (prev[0]?.id || 0) + 1, event, sku: s.sku, site: s.site, channel, scenario: s.id }, ...prev];
        });
        return React.createElement("div", { className: "dx-stack" },
            React.createElement("div", { className: "dx-options" }, RuopanDemo.adScenarios.map((item, i) => React.createElement("button", { key: item.id, type: "button", "aria-pressed": i === index, onClick: () => choose(i) },
                item.id,
                " \u00B7 ",
                t(...item.name)))),
            React.createElement("div", { className: "dx-grid" },
                React.createElement("div", { className: "dx-stack" },
                    React.createElement(RuopanDemo.Panel, { title: t('两期投放复盘', 'Two-period ad review') },
                        React.createElement("label", { className: "dx-labelrow" },
                            t('渠道与口径', 'Channel & metric'),
                            React.createElement("select", { value: channel, onChange: e => setChannel(e.target.value) }, Object.entries(RuopanDemo.channelLabels).map(([key, label]) => React.createElement("option", { key: key, value: key }, label)))),
                        React.createElement("p", { className: "dx-id" },
                            s.site,
                            " \u00B7 ",
                            s.sku,
                            " \u00B7 THB"),
                        React.createElement("table", { className: "dx-table" },
                            React.createElement("caption", null, t('每期先汇总归因收入和花费，再相除。金额单位为泰铢。', 'Divide attributed revenue by spend after summing each period. All amounts in THB.')),
                            React.createElement("thead", null,
                                React.createElement("tr", null, [t('周期', 'Period'), t('花费', 'Spend'), t('归因收入', 'Revenue'), metric].map(v => React.createElement("th", { key: v }, v)))),
                            React.createElement("tbody", null, totals.map((p, i) => React.createElement("tr", { key: i },
                                React.createElement("th", null,
                                    t(i ? '本期' : '上期', i ? 'Current' : 'Prior'),
                                    React.createElement("small", null, RuopanDemo.adPeriods[i])),
                                React.createElement("td", null, fmt(p.spend)),
                                React.createElement("td", null, fmt(p.revenue)),
                                React.createElement("td", null, p.ratio?.toFixed(2) ?? '—'))))),
                        React.createElement("details", { className: "dx-details" },
                            React.createElement("summary", null, t('查看两期底层明细', 'Inspect the underlying rows')),
                            React.createElement("table", { className: "dx-table" },
                                React.createElement("thead", null,
                                    React.createElement("tr", null,
                                        React.createElement("th", null, t('明细', 'Line')),
                                        React.createElement("th", null, t('上期花费 / 收入', 'Prior spend / revenue')),
                                        React.createElement("th", null, t('本期花费 / 收入', 'Current spend / revenue')))),
                                React.createElement("tbody", null, rows.map((r, i) => React.createElement("tr", { key: i },
                                    React.createElement("th", null,
                                        "AD-DEMO-0",
                                        i + 1),
                                    React.createElement("td", null,
                                        fmt(r[0]),
                                        " / ",
                                        fmt(r[1])),
                                    React.createElement("td", null,
                                        fmt(r[2]),
                                        " / ",
                                        fmt(r[3])))))))),
                    React.createElement(RuopanDemo.Panel, { title: t('可售库存与建议', 'Stock & recommendation') },
                        React.createElement(RuopanDemo.Status, { tone: decision.grade },
                            t('工程置信度', 'Engineering confidence'),
                            " \u00B7 ",
                            t(...{ good: ['高', 'High'], warn: ['中', 'Medium'], bad: ['低', 'Low'] }[decision.grade])),
                        React.createElement("dl", { className: "dx-facts" },
                            React.createElement("div", null,
                                React.createElement("dt", null, t('在库 / 可售', 'On hand / sellable')),
                                React.createElement("dd", null,
                                    s.book,
                                    " / ",
                                    s.available ?? t('未核准', 'Unverified'))),
                            React.createElement("div", null,
                                React.createElement("dt", null, t('日均销量 / 预计可售', 'Daily sales / cover')),
                                React.createElement("dd", null,
                                    s.velocity,
                                    " / ",
                                    decision.days === null ? '—' : decision.days + ' ' + t('天', 'days')))),
                        decision.grade === 'good' ? React.createElement(React.Fragment, null,
                            React.createElement("p", null, t('数据已同步，T+1 回刷结束，站点库存核验通过。建议小幅增加预算，由运营执行。', 'Data is synced, the T+1 window has closed and site stock is verified. A modest increase is eligible for operator execution.')),
                            React.createElement("button", { className: "dx-primary", disabled: adopted, onClick: () => record('adopt') }, adopted ? t('已采纳', 'Adopted') : t('采纳', 'Adopt'))) :
                            decision.grade === 'warn' ? React.createElement("div", { className: "dx-callout dx-warn" },
                                React.createElement("strong", null, t('T+1 回刷中 · 保守观察', 'T+1 revision window · observe')),
                                React.createElement("p", null,
                                    t('演示假设：本期归因收入可能回刷 ±2%，花费不变。', 'Demo assumption: attributed revenue may revise by ±2% at fixed spend.'),
                                    " ",
                                    metric,
                                    " ",
                                    (totals[1].ratio * 0.98).toFixed(2),
                                    "\u2013",
                                    (totals[1].ratio * 1.02).toFixed(2),
                                    "\u3002")) :
                                React.createElement("div", { className: "dx-callout dx-bad" },
                                    React.createElement("strong", null, t('已拦截 · 组合 SKU 映射缺失', 'On hold · missing bundle mapping')),
                                    React.createElement("p", null, t('本站点可售量尚未核准。即使回报高，也无法生成放量建议。', 'Sellable units for this site are unverified. Higher returns cannot clear this hold.')),
                                    React.createElement("button", { onClick: () => record('bypass') }, t('模拟业务强行绕过（记录周复盘留痕）', 'Simulate an operator bypass · log for review'))))),
                React.createElement(RuopanDemo.Panel, { title: t('周复盘留痕', 'Weekly review log') },
                    React.createElement("p", { className: "dx-muted" }, t('仅记录本次演示中的人工决定。预算不会自动执行。', 'These entries record this demo’s operator decisions. Budget changes are manual.')),
                    React.createElement("div", { "aria-live": "polite" }, logs.length === 0 ? React.createElement("p", { className: "dx-empty" }, t('尚无操作记录', 'No decisions recorded yet.')) : React.createElement("ol", { className: "dx-log" }, logs.map(l => React.createElement("li", { key: l.id },
                        React.createElement("strong", null, l.event === 'bypass' ? t('业务绕过 · 待周复盘', 'Business bypass · review due') : t('建议已采纳 · 待人工执行', 'Adopted · pending execution')),
                        React.createElement("small", null,
                            'LOG-DEMO-' + String(l.id).padStart(3, '0'),
                            " \u00B7 ",
                            l.site,
                            " \u00B7 ",
                            l.sku),
                        React.createElement("small", null,
                            RuopanDemo.channelLabels[l.channel],
                            " \u00B7 ",
                            t('场景', 'Scenario'),
                            " ",
                            l.scenario),
                        l.event === 'bypass' && React.createElement("small", null, t('原因：库存映射未核准，交运营与 IT 复核。', 'Reason: mapping unverified. Operations and IT review required.')))))))));
    }
    RuopanDemo.Advertising = Advertising;
})(RuopanDemo || (RuopanDemo = {}));
var RuopanDemo;
(function (RuopanDemo) {
    function SourcePreview({ doc, close }) {
        const t = RuopanDemo.useWords();
        return React.createElement(RuopanDemo.Modal, { title: t('核对模拟原单', 'Inspect synthetic document'), close: close },
            React.createElement(RuopanDemo.Badge, null),
            React.createElement("h4", null, doc.id),
            React.createElement("dl", { className: "dx-facts" },
                React.createElement("div", null,
                    React.createElement("dt", null, t('负责人', 'Owner')),
                    React.createElement("dd", null, doc.owner)),
                React.createElement("div", null,
                    React.createElement("dt", null, t('从库快照', 'Replica snapshot')),
                    React.createElement("dd", null, t(...RuopanDemo.billStates[doc.replica]))),
                React.createElement("div", null,
                    React.createElement("dt", null, t('主库当前值', 'Current primary')),
                    React.createElement("dd", null, t(...RuopanDemo.billStates[doc.primary]))),
                React.createElement("div", null,
                    React.createElement("dt", null, t('待审 / 逾期时长', 'Pending / overdue for')),
                    React.createElement("dd", null,
                        doc.hours,
                        " h"))));
    }
    function Rules() {
        const t = RuopanDemo.useWords(), lang = React.useContext(RuopanDemo.Locale);
        const [draft, write] = React.useState(t(...RuopanDemo.ruleExamples.approval));
        const [rule, setRule] = React.useState(null), [error, fail] = React.useState(false), [confirmed, confirm] = React.useState(false);
        const [mode, setMode] = React.useState('normal'), [retried, retry] = React.useState(false);
        const [opened, open] = React.useState(null), [votes, vote] = React.useState({});
        const prevLang = React.useRef(lang);
        React.useEffect(() => {
            if (prevLang.current !== lang) {
                write(current => {
                    const known = Object.keys(RuopanDemo.ruleExamples).find(k => RuopanDemo.ruleExamples[k].includes(current));
                    return known ? t(...RuopanDemo.ruleExamples[known]) : current;
                });
                prevLang.current = lang;
            }
        }, [lang]);
        function reset() { setRule(null); fail(false); confirm(false); retry(false); vote({}); open(null); }
        function change(value) { write(value); reset(); }
        function dryRun() { const parsed = RuopanDemo.translateRule(draft); setRule(parsed); fail(!parsed); confirm(false); retry(false); vote({}); open(null); }
        const hits = rule ? RuopanDemo.runTrial(rule, mode === 'zero' ? [] : RuopanDemo.trialDocs) : [];
        const plan = rule ? RuopanDemo.deliveryPlan(rule, hits) : { send: [], skip: [] };
        const failed = confirmed && mode === 'failure' && !retried ? plan.send[0]?.id : null;
        const delivered = confirmed ? plan.send.filter(doc => doc.id !== failed) : [];
        function cast(id, value) { vote(v => ({ ...v, [id]: value })); }
        return React.createElement("div", { className: "dx-stack" },
            React.createElement("div", { className: "dx-options" }, ['approval', 'payment'].map(k => React.createElement("button", { key: k, "aria-pressed": RuopanDemo.ruleExamples[k].includes(draft), onClick: () => change(t(...RuopanDemo.ruleExamples[k])) }, k === 'approval' ? t('示例一 · 新品审批', 'Example 1 · approval') : t('示例二 · 物流尾款', 'Example 2 · freight payment')))),
            React.createElement("div", { className: "dx-panel" },
                React.createElement("label", { className: "dx-block-label", htmlFor: "dx-rule-sentence" }, t('你想在什么情况下提醒谁？', 'Who should be notified, and when?')),
                React.createElement("textarea", { id: "dx-rule-sentence", rows: 2, value: draft, onChange: e => change(e.target.value) }),
                React.createElement("p", { className: "dx-muted" }, t('本地转译器支持上面两种句式。审批等待时长可改为 1–720 小时。', 'The local translator supports these two patterns. The approval threshold accepts 1–720 hours.')),
                React.createElement("div", { className: "dx-controls" },
                    React.createElement("label", null,
                        t('监控样例', 'Monitor sample'),
                        " ",
                        React.createElement("select", { value: mode, onChange: e => { setMode(e.target.value); reset(); } },
                            React.createElement("option", { value: "normal" }, t('正常扫描', 'Normal scan')),
                            React.createElement("option", { value: "zero" }, t('预期有单但 0 命中', 'Unexpected zero hits')),
                            React.createElement("option", { value: "failure" }, t('首条发送失败', 'First delivery fails')))),
                    React.createElement("button", { className: "dx-primary", onClick: dryRun }, t('转译并试跑', 'Translate & dry-run'))),
                error && React.createElement("p", { role: "alert", className: "dx-callout dx-bad" }, t('这句话未通过受控规则校验。请选择一种示例句式后修改；本次未生成规则。', 'This input failed the bounded rule validator. Start from one of the example sentences.'))),
            rule && React.createElement(React.Fragment, null,
                React.createElement("div", { className: "dx-three" },
                    React.createElement(RuopanDemo.Panel, { title: t('受控 JSON DSL', 'Validated JSON DSL') },
                        React.createElement("pre", null, JSON.stringify(rule, null, 2))),
                    React.createElement(RuopanDemo.Panel, { title: t('反译与试跑原单', 'Read-back & evidence') },
                        React.createElement("p", null, t(...RuopanDemo.readBack(rule))),
                        React.createElement("p", { className: "dx-label" },
                            t('从库命中', 'Replica matches'),
                            " \u00B7 ",
                            hits.length),
                        React.createElement("ul", { className: "dx-records" }, hits.map(d => React.createElement("li", { key: d.id },
                            React.createElement("strong", null, d.id),
                            React.createElement("small", null,
                                t(...RuopanDemo.billStates[d.replica]),
                                " \u00B7 ",
                                d.hours,
                                " h"),
                            React.createElement("button", { className: "dx-link", onClick: () => open(d) },
                                t('核对原单', 'Inspect document'),
                                " \u2197")))),
                        React.createElement("button", { className: "dx-primary", disabled: confirmed, onClick: () => confirm(true) }, confirmed ? t('已确认并模拟扫描', 'Confirmed & scanned') : t('确认规则并模拟扫描', 'Confirm rule & simulate scan'))),
                    React.createElement(RuopanDemo.Panel, { title: t('模拟通知卡片', 'Simulated notifications') },
                        !confirmed && React.createElement("p", { className: "dx-muted" }, t('以下是样稿。确认规则后显示模拟发送回执。', 'These are previews. Confirm the rule to simulate delivery receipts.')),
                        (confirmed ? delivered : plan.send).map(d => React.createElement("article", { className: "dx-message-card", key: d.id },
                            React.createElement("span", { className: "dx-label" }, confirmed ? t('模拟已触达', 'Simulated delivery') : t('待确认 · 样稿', 'Unconfirmed preview')),
                            React.createElement("h4", null, rule.primaryRecheck ? t('物流尾款待处理', 'Freight balance due') : t('新品等待审批', 'New product awaiting approval')),
                            React.createElement("p", null,
                                d.owner,
                                " \u00B7 ",
                                d.id),
                            React.createElement("button", { className: "dx-link", onClick: () => open(d) },
                                t('去 ERP 核对原单', 'Review ERP document'),
                                " \u2197"),
                            confirmed && React.createElement("div", { className: "dx-options dx-votes" }, ['up', 'down'].map(v => React.createElement("button", { key: v, "aria-pressed": votes[d.id] === v, onClick: () => cast(d.id, v) }, v === 'up' ? t('有用', 'Useful') : t('不准确', 'Inaccurate')))))),
                        plan.send.length === 0 && React.createElement("p", { className: "dx-empty" }, t('没有可发送的单据。', 'No eligible documents.')))),
                React.createElement("div", { className: "dx-panel", "aria-live": "polite" },
                    React.createElement("h3", null, t('通知监控中心', 'Notification monitor')),
                    React.createElement("div", { className: "dx-monitor" },
                        React.createElement(RuopanDemo.Status, { tone: failed ? 'bad' : 'good' },
                            t('回执触达', 'Receipts'),
                            " \u00B7 ",
                            delivered.length,
                            "/",
                            confirmed ? plan.send.length : 0),
                        React.createElement(RuopanDemo.Status, { tone: hits.length === 0 ? 'warn' : 'good' }, hits.length === 0 ? t('0 命中 · 静默告警', 'Zero hits · silence alert') : t('0 命中告警未触发', 'Zero-hit alarm clear')),
                        React.createElement(RuopanDemo.Status, { tone: rule.primaryRecheck && confirmed ? 'good' : 'warn' }, rule.primaryRecheck ? (confirmed ? t('主库二次核验 · 跳过', 'Primary rechecked · skipped') + ' ' + plan.skip.length : t('资金类 · 发前复核待执行', 'Payment · primary check pending')) : t('审批类 · 无资金复核', 'Approval · no payment check'))),
                    confirmed && plan.skip.map(d => React.createElement("p", { key: d.id },
                        d.id,
                        " \u00B7 ",
                        t('主库已全额付款，跳过发送。', 'Settled on the primary. Delivery skipped.'))),
                    failed && React.createElement("p", null,
                        failed,
                        " \u00B7 ",
                        t('模拟发送失败', 'Simulated delivery failure'),
                        " ",
                        React.createElement("button", { onClick: () => retry(true) }, t('重试失败项', 'Retry failed item'))),
                    retried && React.createElement("p", null, t('重试成功，未重复发送已触达的通知。', 'Retry succeeded. Previous deliveries were not duplicated.')),
                    Object.keys(votes).length > 0 && React.createElement("small", null,
                        t('评价已回流', 'Feedback received'),
                        " \u00B7 ",
                        Object.keys(votes).length))),
            opened && React.createElement(SourcePreview, { doc: opened, close: () => open(null) }));
    }
    RuopanDemo.Rules = Rules;
})(RuopanDemo || (RuopanDemo = {}));
var RuopanDemo;
(function (RuopanDemo) {
    function Support({ active = true }) {
        const t = RuopanDemo.useWords(), lang = React.useContext(RuopanDemo.Locale);
        const [index, select] = React.useState(0), [frame, advance] = React.useState(-1), [playing, play] = React.useState(false);
        const script = RuopanDemo.chatScripts[index], state = frame >= 0 ? script.steps[frame] : null, end = frame >= script.steps.length - 1;
        React.useEffect(() => {
            if (!active || !playing || end)
                return;
            const timer = window.setTimeout(() => advance(v => Math.min(v + 1, script.steps.length - 1)), 830);
            return () => window.clearTimeout(timer);
        }, [active, playing, frame, index, end]);
        function start(i) { select(i); advance(0); play(true); }
        const messages = script.steps.slice(0, frame + 1).flatMap(s => s.messages);
        const rolesText = { buyer: ['买家', 'Buyer'], agent: ['客服 Agent', 'Support agent'], system: ['系统事件', 'Workflow event'], draft: ['仅人工可见的草稿', 'Staff-only draft'] };
        return React.createElement("div", { className: "dx-stack" },
            React.createElement("div", { className: "dx-options" }, RuopanDemo.chatScripts.map((s, i) => React.createElement("button", { key: i, "aria-pressed": i === index && frame >= 0, onClick: () => start(i) },
                i + 1,
                " \u00B7 ",
                t(...s.name)))),
            React.createElement("div", { className: "dx-grid" },
                React.createElement(RuopanDemo.Panel, { title: t('买家对话', 'Buyer conversation') },
                    React.createElement("p", { className: "dx-id" },
                        script.shop,
                        " \u00B7 ",
                        t('演示时钟', 'Demo clock')),
                    frame < 0 ? React.createElement("p", { className: "dx-empty" }, t('选择一个剧本，查看买家消息和状态变化。', 'Pick a script to follow its messages and transitions.')) : React.createElement("ol", { className: "dx-chat" }, messages.map((m, i) => React.createElement("li", { key: index + '-' + i, className: 'dx-who-' + m.who },
                        React.createElement("div", null,
                            React.createElement("strong", null, t(...rolesText[m.who])),
                            React.createElement("time", null, m.time)),
                        React.createElement("p", null, t(...m.text)),
                        m.art === 'guide' && React.createElement(window.RuopanDemoArt.PaperGuide, { lang: lang }),
                        m.art === 'blur' && React.createElement("svg", { viewBox: "0 0 170 52", width: "170", height: "52", role: "img", "aria-label": t('模糊的模拟机身铭牌', 'Blurred synthetic device label') },
                            React.createElement("rect", { x: "1", y: "1", width: "168", height: "50", rx: "5", fill: "var(--rp-wash)", stroke: "var(--rp-edge)" }),
                            React.createElement("g", { fill: "currentColor", opacity: ".28" },
                                React.createElement("rect", { x: "13", y: "13", width: "85", height: "5", rx: "2" }),
                                React.createElement("rect", { x: "13", y: "27", width: "120", height: "8", rx: "4" })),
                            React.createElement("text", { x: "114", y: "17", fontSize: "9", fill: "currentColor" }, "DEMO")))))),
                React.createElement("div", { className: "dx-stack" },
                    React.createElement(RuopanDemo.Panel, { title: t('实时状态面板', 'Live workflow state') },
                        React.createElement("div", { "aria-live": "polite" },
                            React.createElement(RuopanDemo.Status, { tone: !state || state.risk === 'clear' ? 'good' : state.risk === 'red' ? 'bad' : 'warn' }, state ? t(...state.node) : t('等待运行', 'Ready')),
                            React.createElement("dl", { className: "dx-facts" }, [
                                [t('已锁定机型', 'Locked model'), state?.model ?? t('未知', 'Unknown')],
                                [t('风控层级', 'Risk level'), !state ? '—' : state.risk === 'red' ? t('高危 · 退款 / 差评', 'High · refund / rating') : state.risk === 'uncertain' ? t('证据不足 · 人工', 'Uncertain · handoff') : t('常规', 'Routine')],
                                [t('调用工具', 'Current tool'), state?.tool ?? '—'], [t('多语种术语校验', 'Terminology'), state ? t(...state.glossary) : '—']
                            ].map(([k, v]) => React.createElement("div", { key: k },
                                React.createElement("dt", null, k),
                                React.createElement("dd", null, v))))),
                        React.createElement("div", { className: "dx-options" },
                            React.createElement("button", { onClick: () => { if (frame < 0 || end)
                                    start(index);
                                else
                                    play(!playing); } }, frame < 0 ? t('运行剧本', 'Run script') : end ? t('重新运行', 'Replay') : playing ? t('暂停', 'Pause') : t('继续', 'Resume')),
                            React.createElement("button", { disabled: end, onClick: () => { play(false); advance(v => Math.min(v + 1, script.steps.length - 1)); } }, t('下一步', 'Next step'))),
                        React.createElement("p", { className: "dx-muted" },
                            Math.max(frame + 1, 0),
                            " / ",
                            script.steps.length,
                            " \u00B7 ",
                            t('按模拟时间加速播放', 'Accelerated simulation'))))));
    }
    RuopanDemo.Support = Support;
})(RuopanDemo || (RuopanDemo = {}));
var RuopanDemo;
(function (RuopanDemo) {
    function Documents() {
        const t = RuopanDemo.useWords(), lang = React.useContext(RuopanDemo.Locale);
        const [values, edit] = React.useState(RuopanDemo.initialFields), [checked, check] = React.useState({});
        const [selected, select] = React.useState('container'), [written, write] = React.useState(false);
        const pane = React.useRef(null);
        const inputs = React.useRef({});
        const status = RuopanDemo.reviewStatus(values, checked), preview = written ? RuopanDemo.mappingPreview(values, checked) : null;
        function locate(key) {
            select(key);
            const view = pane.current, area = document.getElementById('demo-source-' + key);
            if (!view || !area)
                return;
            const a = area.getBoundingClientRect(), b = view.getBoundingClientRect();
            if (a.top < b.top + 8 || a.bottom > b.bottom - 8)
                view.scrollTop += a.top - b.top - (view.clientHeight - a.height) / 2;
        }
        function change(key, value) { edit(v => ({ ...v, [key]: value })); check(v => ({ ...v, [key]: false })); write(false); }
        return React.createElement("div", { className: "dx-stack" },
            React.createElement("div", { className: "dx-review" },
                React.createElement(RuopanDemo.Panel, { title: t('海运提单原文', 'Source bill of lading') },
                    React.createElement("p", { className: "dx-muted" }, t('点选字段核对原文。红章是演示用遮挡。', 'Select a field to locate its source. The red seal simulates an obstruction.')),
                    React.createElement("div", { className: "dx-scan", ref: pane },
                        React.createElement(window.RuopanDemoArt.BillDrawing, { lang: lang, fields: RuopanDemo.docFields, selected: selected, onSelect: key => { locate(key); inputs.current[key]?.focus({ preventScroll: true }); } }))),
                React.createElement(RuopanDemo.Panel, { title: t('结构化字段复核', 'Structured field review') },
                    React.createElement("div", { className: "dx-fieldlist" }, RuopanDemo.docFields.map((f, i) => {
                        const s = status.results[i];
                        return React.createElement("div", { key: f.key, className: 'dx-review-field' + (selected === f.key ? ' dx-field-selected' : '') },
                            React.createElement("label", { htmlFor: 'dx-field-' + f.key }, lang === 'zh' ? f.label : f.en),
                            React.createElement("input", { id: 'dx-field-' + f.key, ref: el => { if (el)
                                    inputs.current[f.key] = el; }, value: values[f.key], onFocus: () => locate(f.key), onClick: () => locate(f.key), onChange: e => change(f.key, e.target.value), "aria-invalid": s.tone === 'bad', "aria-describedby": 'dx-state-' + f.key, spellCheck: false }),
                            React.createElement("div", { id: 'dx-state-' + f.key },
                                React.createElement(RuopanDemo.Status, { tone: s.tone }, t(...s.reason))),
                            f.requiredReview && React.createElement("label", { className: "dx-check" },
                                React.createElement("input", { type: "checkbox", disabled: s.tone === 'bad', checked: !!checked[f.key], onFocus: () => locate(f.key), onChange: e => { check(v => ({ ...v, [f.key]: e.target.checked })); write(false); } }),
                                t('已对照原文复核', 'Checked against source')));
                    })))),
            React.createElement("div", { className: "dx-panel dx-release" },
                React.createElement("div", { "aria-live": "polite" },
                    React.createElement(RuopanDemo.Status, { tone: status.conflicts ? 'bad' : status.pending ? 'warn' : 'good' },
                        t('冲突', 'Conflicts'),
                        " ",
                        status.conflicts,
                        " \u00B7 ",
                        t('待人工复核', 'Awaiting review'),
                        " ",
                        status.pending),
                    React.createElement("p", null, t('修正冲突并逐项复核后，可查看本次模拟写入的字段映射。', 'Resolve conflicts and sign off each sensitive field to inspect the simulated write mapping.'))),
                React.createElement("div", { className: "dx-options" },
                    React.createElement("button", { className: "dx-primary", disabled: !status.ready || written, onClick: () => { if (status.ready)
                            write(true); } }, written ? t('已生成模拟写入预览', 'Simulated write preview ready') : t('确认经 API 写入系统', 'Confirm API write')),
                    React.createElement("button", { onClick: () => { edit(RuopanDemo.initialFields()); check({}); write(false); locate('container'); } }, t('重置样例', 'Reset sample')))),
            preview && React.createElement("div", { className: "dx-grid" },
                React.createElement(RuopanDemo.Panel, { title: t('通用物流 Schema', 'Standard freight schema') },
                    React.createElement("pre", null, JSON.stringify(preview.standard, null, 2))),
                React.createElement(RuopanDemo.Panel, { title: t('客户字段映射 · 模拟 API 请求体', 'Customer mapping · simulated API body') },
                    React.createElement("pre", null, JSON.stringify(preview.customer, null, 2)))));
    }
    RuopanDemo.Documents = Documents;
})(RuopanDemo || (RuopanDemo = {}));
var RuopanDemo;
(function (RuopanDemo) {
    function Motif({ id }) {
        const style = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
        return React.createElement("svg", { className: 'dx-motif dx-motif-' + id, viewBox: "0 0 92 64", "aria-hidden": "true", ...style }, id === 'ads' ? React.createElement(React.Fragment, null,
            React.createElement("path", { d: "M7 52h75M14 44V30h9v14m7 0V23h9v21m7 0V15h9v29" }),
            React.createElement("path", { d: "m59 24 10-6 11 6v14l-11 6-10-6Zm0 0 10 6 11-6m-11 6v14" })) :
            id === 'rules' ? React.createElement(React.Fragment, null,
                React.createElement("rect", { x: "9", y: "10", width: "41", height: "42", rx: "3" }),
                React.createElement("path", { d: "M17 21h23m-23 8h17m-17 8h9m9 6h21l9-10" }),
                React.createElement("rect", { x: "60", y: "18", width: "22", height: "16", rx: "3" }),
                React.createElement("path", { d: "m65 25 4 4 7-8" })) :
                id === 'support' ? React.createElement(React.Fragment, null,
                    React.createElement("path", { d: "M8 11h48v27H30l-10 9v-9H8zm18 12h15" }),
                    React.createElement("rect", { x: "50", y: "31", width: "33", height: "18", rx: "3" }),
                    React.createElement("path", { d: "M56 31V21h20v10m-19 13h18v12H57zm4 5h9" })) :
                    React.createElement(React.Fragment, null,
                        React.createElement("path", { d: "M18 6h35l9 9v37H18zm35 0v10h9M25 22h28m-28 8h18m-18 8h12" }),
                        React.createElement("circle", { cx: "62", cy: "39", r: "11" }),
                        React.createElement("path", { d: "m70 47 10 9m-23-18 4 4 6-8" })));
    }
    function Hub() {
        const t = RuopanDemo.useWords();
        return React.createElement("div", { className: "dx-hub-list" }, RuopanDemo.studies.map(s => React.createElement("article", { className: "dx-hub-card", key: s.id },
            React.createElement(RuopanDemo.Badge, null),
            React.createElement("div", { className: "dx-hub-body" },
                React.createElement("div", null,
                    React.createElement("h2", null,
                        React.createElement("a", { href: '#demo-' + s.id }, t(...s.title))),
                    React.createElement("p", null, t(...s.question))),
                React.createElement(Motif, { id: s.id })),
            React.createElement("a", { className: "dx-entry", href: '#demo-' + s.id },
                t(...s.action),
                " ",
                React.createElement("span", { "aria-hidden": "true" }, "\u2197")))));
    }
    function CaseView({ study }) {
        const t = RuopanDemo.useWords();
        const [tab, setTab] = React.useState(0), [visited, visit] = React.useState(false);
        const id = 'dx-' + study.id;
        function activate(i) { setTab(i); if (i === 1)
            visit(true); }
        return React.createElement(React.Fragment, null,
            React.createElement("p", { className: "dx-question" }, t(...study.question)),
            React.createElement("div", { className: "dx-tabs", role: "tablist", "aria-label": t('演示内容', 'Demo content') }, [['交互式系统架构图', 'Interactive architecture'], ['可操作核心原型', 'Working prototype']].map((s, i) => React.createElement("button", { key: i, role: "tab", id: id + '-tab-' + i, "aria-controls": id + '-panel-' + i, "aria-selected": tab === i, tabIndex: tab === i ? 0 : -1, onClick: () => activate(i), onKeyDown: e => { if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key))
                    return; e.preventDefault(); const next = e.key === 'Home' ? 0 : e.key === 'End' ? 1 : 1 - i; activate(next); document.getElementById(id + '-tab-' + next)?.focus(); } }, t(...s)))),
            React.createElement("div", { id: id + '-panel-0', role: "tabpanel", "aria-labelledby": id + '-tab-0', hidden: tab !== 0 },
                React.createElement(RuopanDemo.Architecture, { study: study })),
            React.createElement("div", { id: id + '-panel-1', role: "tabpanel", "aria-labelledby": id + '-tab-1', hidden: tab !== 1 }, visited && (study.id === 'ads' ? React.createElement(RuopanDemo.Advertising, null) : study.id === 'rules' ? React.createElement(RuopanDemo.Rules, null) : study.id === 'support' ? React.createElement(RuopanDemo.Support, { active: tab === 1 }) : React.createElement(RuopanDemo.Documents, null))),
            React.createElement("footer", { className: "dx-back" },
                React.createElement("a", { className: "dx-entry", href: "#demos" },
                    "\u2190 ",
                    t('全部交互演示', 'All interactive demos')),
                React.createElement("a", { className: "dx-entry", href: '#' + study.project },
                    t('阅读项目案例', 'Read the case study'),
                    " \u2197")));
    }
    let active = null;
    let root = null;
    function renderPage(el) {
        if (el !== active) {
            root?.unmount();
            active = el;
            root = el ? ReactDOM.createRoot(el) : null;
        }
        if (!el || !root)
            return;
        const lang = document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'zh';
        const study = RuopanDemo.studies.find(s => s.id === el.dataset.dxMount);
        root.render(React.createElement(RuopanDemo.Locale.Provider, { value: lang }, study ? React.createElement(CaseView, { key: study.id, study: study }) : React.createElement(Hub, null)));
    }
    RuopanDemo.renderPage = renderPage;
})(RuopanDemo || (RuopanDemo = {}));
