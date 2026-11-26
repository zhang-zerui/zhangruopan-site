/* The original diagrams use the same locally hosted React runtime as the portfolio. */
(() => {
  'use strict';

  /** @type {(...args: any[]) => any} */
  const h = (...args) => {
    const runtime = /** @type {Window & {React: {createElement: (...args: any[]) => any}}} */ (window);
    return runtime.React.createElement(...args);
  };
  const sans = 'var(--rp-sans, system-ui, sans-serif)';
  const serif = 'var(--rp-serif, Georgia, serif)';
  const ink = '#35352f';
  const rule = '#c6c5b7';
  const selectedInk = '#674a96';

  /** @param {number} x @param {number} y @param {string} value @param {object} [props] */
  function textAt(x, y, value, props = {}) {
    return h('text', {x, y, ...props}, value);
  }

  /** @param {number} y @param {string} value */
  function billSection(y, value) {
    return h('g', {fill: '#57584e', fontFamily: sans, fontSize: 10, fontWeight: 600, letterSpacing: 1.25},
      textAt(34, y, value));
  }

  /** @typedef {{key: string, label: string, en: string, source: string, box: number[]}} BillField */
  /** @param {BillField} field @param {boolean} active @param {(key: string) => void} onSelect @param {boolean} english */
  function billField(field, active, onSelect, english) {
    const [x, y, w, height] = field.box;
    const available = w - 22;
    const fontSize = Math.max(13, Math.min(19, Math.floor(available / (Math.max(1, field.source.length) * 0.61))));
    const fit = field.source.length * fontSize * 0.61 > available
      ? {textLength: available, lengthAdjust: 'spacingAndGlyphs'} : {};
    const select = () => onSelect(field.key);
    return h('g', {
      key: field.key, id: 'demo-source-' + field.key, className: 'demo-bill-field',
      role: 'button', tabIndex: 0, 'aria-pressed': active,
      'aria-label': `${english ? field.en : field.label} — ${field.source}`,
      onClick: select,
      /** @param {KeyboardEvent} event */
      onKeyDown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          select();
        }
      },
      style: {cursor: 'pointer'}
    },
    h('rect', {className: 'demo-bill-edge', x, y, width: w, height, rx: 2,
      fill: active ? '#f1ebfa' : '#fffef9', stroke: active ? selectedInk : rule,
      strokeWidth: active ? 2.6 : 1, vectorEffect: 'non-scaling-stroke'}),
    textAt(x + 11, y + 17, field.en.toUpperCase(), {
      fill: '#56584f', fontSize: 10.5, fontFamily: sans, fontWeight: 600, letterSpacing: 0.55}),
    textAt(x + 11, y + height - 12, field.source, {
      fill: active ? selectedInk : ink, fontFamily: 'ui-monospace, Menlo, monospace', fontSize, ...fit})
    );
  }

  function demoStamp() {
    return h('g', {'aria-hidden': true, pointerEvents: 'none', transform: 'translate(467 287) rotate(-16)', opacity: 0.36,
      stroke: '#ab413b', fill: 'none', strokeWidth: 2},
      h('circle', {r: 69, strokeWidth: 3.5}), h('circle', {r: 62, strokeWidth: 1.3}),
      h('path', {d: 'M-48 -15 H48 M-48 16 H48'}),
      h('g', {fill: '#ab413b', stroke: 'none', fontFamily: sans, textAnchor: 'middle', fontWeight: 700},
        textAt(0, -28, 'SYNTHETIC', {fontSize: 10.5, letterSpacing: 1.7}),
        textAt(0, 9, 'DEMO', {fontSize: 28, letterSpacing: 2}),
        textAt(0, 38, 'COPY', {fontSize: 12, letterSpacing: 2.5})
      )
    );
  }

  /** @param {{fields: BillField[], selected: string, onSelect: (key: string) => void, lang?: string}} props */
  function BillDrawing({fields, selected, onSelect, lang = 'zh-CN'}) {
    const english = /^en/i.test(lang);
    return h('svg', {
      'data-demo-bill-art': '', viewBox: '0 0 580 680', xmlns: 'http://www.w3.org/2000/svg',
      width: '100%', role: 'group',
      'aria-label': english ? 'Synthetic ocean bill of lading. Select a source field.' : '模拟海运提单。可选择框内的原文字段。',
      style: {display: 'block', height: 'auto', maxWidth: '100%'}
    },
    h('style', null, '[data-demo-bill-art] .demo-bill-field:hover .demo-bill-edge{stroke:#795e99;stroke-width:1.7px}' +
      '[data-demo-bill-art] .demo-bill-field:focus-visible .demo-bill-edge{stroke:#583d83;stroke-width:3px;stroke-dasharray:6 2}' +
      '[data-demo-bill-art] .demo-bill-field:focus:not(:focus-visible){outline:none}'),
    h('path', {d: 'M19 23 542 19 565 42 568 656 26 664Z', fill: 'var(--rp-edge, #ded9ce)'}),
    h('path', {d: 'M17 18 539 14 561 36 564 651 22 659Z', fill: '#fffdf3', stroke: '#b5b3a2', strokeWidth: 1.2}),
    h('path', {d: 'm539 14 1 23 21-1', fill: '#ece9db', stroke: '#b5b3a2', strokeWidth: 1}),
    h('g', {fill: ink, fontFamily: sans},
      h('rect', {x: 34, y: 34, width: 47, height: 19, rx: 2, fill: '#e8e0f1', stroke: '#b4a4c4'}),
      textAt(57.5, 47, 'DEMO', {fontSize: 11, fontWeight: 700, textAnchor: 'middle', fill: '#5e457c'}),
      textAt(91, 47, 'SYNTHETIC SHIPPING FORM', {fontSize: 10.5, letterSpacing: 1.15, fontWeight: 600}),
      textAt(34, 85, 'Ocean Bill of Lading', {fontFamily: serif, fontWeight: 600, fontSize: 34}),
      textAt(546, 81, 'NOT NEGOTIABLE', {textAnchor: 'end', fontWeight: 700, fontSize: 12, letterSpacing: 0.9}),
      h('path', {d: 'M34 99H546 M34 588H546', stroke: ink, fill: 'none', strokeWidth: 1.5}),
      billSection(118, 'DOCUMENT IDENTIFICATION'), billSection(196, 'PORTS'), billSection(293, 'CARGO'),
      billSection(412, 'ITEMIZED WEIGHTS'), billSection(502, 'DECLARED TOTAL'),
      h('path', {d: 'M34 385H546', stroke: rule}),
      textAt(34, 617, 'Source fields', {fontFamily: serif, fontSize: 18, fontStyle: 'italic'}),
      textAt(34, 636, 'Select a box to trace its extracted value.', {fontSize: 12, fill: '#56584f'}),
      textAt(546, 636, 'DEMO COPY', {fontSize: 11, letterSpacing: 1.2, textAnchor: 'end', fill: '#56584f'})
    ),
    fields.map(field => billField(field, selected === field.key, onSelect, english)),
    demoStamp());
  }

  const guideInk = 'var(--rp-fg, #22211f)';
  const guideAccent = 'var(--rp-purple, #7057ae)';
  const guidePaper = 'var(--rp-paper, #fffdf7)';
  const guideWash = 'var(--rp-wash, #f2eee4)';

  /** @param {string} d @param {object} [props] */
  function line(d, props = {}) {
    return h('path', {d, fill: 'none', ...props});
  }

  function printerCase() {
    return h('g', null,
      h('path', {d: 'M19 64 29 57H84L94 64V79L88 85H24L19 79Z', fill: guideWash}),
      line('M20 65 26 70H88L93 65 M27 75H86', {strokeWidth: 1.3}),
      line('M26 85v3h7v-3 M80 85v3h7v-3', {strokeWidth: 1.6})
    );
  }

  function liftCover() {
    return h('g', null, printerCase(),
      h('path', {d: 'M28 58 41 26Q42 22 47 22H87Q91 22 90 27L80 58Z', fill: guidePaper}),
      line('M35 54 46 30H83L75 54Z', {strokeWidth: 1.3}),
      line('M19 48Q14 35 27 26 M19 27l9-2-1 9', {stroke: guideAccent, strokeWidth: 2.7})
    );
  }

  function centerRoll() {
    return h('g', null, printerCase(),
      h('path', {d: 'M33 56 38 36Q39 32 44 32H79Q83 32 82 37L76 56Z', fill: guidePaper, strokeWidth: 1.5}),
      h('path', {d: 'M40 46c0-6 4-12 10-12h18c5 0 8 5 8 11s-4 12-10 12H50c-6 0-10-5-10-11Z', fill: guideWash}),
      h('ellipse', {cx: 50, cy: 45.5, rx: 8.5, ry: 11, fill: guidePaper}),
      h('ellipse', {cx: 50, cy: 45.5, rx: 2.4, ry: 3.4, strokeWidth: 1.4}),
      h('path', {d: 'M54 53h18l-7 11H46Z', fill: guidePaper}),
      line('M33 51v9h7 M80 51v9h-7', {stroke: guideAccent, strokeWidth: 2.5}),
      line('M19 45h12m-5-4 5 4-5 4 M95 45H83m5-4-5 4 5 4', {stroke: guideAccent, strokeWidth: 2})
    );
  }

  function feedLabel() {
    return h('g', null, printerCase(),
      h('path', {d: 'M23 61 32 40Q33 37 38 37H78Q82 37 84 40l8 21-6 6H29Z', fill: guideWash}),
      line('M32 61h49', {strokeWidth: 2.4}),
      h('path', {d: 'M39 61h32l-11 18H28Z', fill: guidePaper}),
      line('m38 69 23 0', {stroke: guideAccent, strokeWidth: 1.5, strokeDasharray: '3 2'}),
      h('ellipse', {cx: 73, cy: 47, rx: 5.2, ry: 3, fill: guideAccent, stroke: 'none'}),
      line('M73 20v18m-5-6 5 6 5-6', {stroke: guideAccent, strokeWidth: 2.7})
    );
  }

  /** @param {{lang?: string}} [props] */
  function PaperGuide({lang = 'zh-CN'} = {}) {
    const english = /^en/i.test(lang);
    const steps = [
      {draw: liftCover, title: english ? 'Open the cover' : '打开上盖', detail: english ? 'Lift both latches' : '松开两侧卡扣'},
      {draw: centerRoll, title: english ? 'Center the roll' : '居中放纸', detail: english ? 'Slide guides inward' : '导纸夹贴住两边'},
      {draw: feedLabel, title: english ? 'Close and feed' : '合盖走纸', detail: english ? 'Press FEED once' : '按一次走纸键'}
    ];
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 368 180', width: '100%', role: 'img',
      'aria-label': english ? 'P-DEMO-M1 loading guide. Lift the cover, center the roll between guides, close and press FEED once.' : 'P-DEMO-M1 装纸图解。打开上盖，纸卷居中放入导纸夹，合上盖子并按一次走纸键。',
      style: {display: 'block', height: 'auto', maxWidth: '100%'}
    },
    h('rect', {x: 0.7, y: 0.7, width: 366.6, height: 178.6, rx: 9, fill: guidePaper, stroke: 'var(--rp-edge, #ded9ce)'}),
    textAt(12, 23, 'P-DEMO-M1', {fontFamily: 'ui-monospace, monospace', fontWeight: 600, fontSize: 12.5, fill: guideAccent}),
    textAt(356, 23, english ? 'Media loading' : '标签纸装载', {fontFamily: sans, fontSize: 13, fontWeight: 600, textAnchor: 'end', fill: guideInk}),
    h('path', {d: 'M12 33H356 M124 43V166 M244 43V166', fill: 'none', stroke: 'var(--rp-edge, #ded9ce)'}),
    steps.map((step, i) => h('g', {key: step.title, transform: `translate(${9 + i * 120} 36)`},
      h('g', {fill: 'none', stroke: guideInk, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round'}, step.draw()),
      textAt(54, 110, step.title, {fontFamily: sans, fontSize: 13.1, fontWeight: 600, textAnchor: 'middle', fill: guideInk}),
      textAt(54, 128, step.detail, {fontFamily: sans, fontSize: 10.8, textAnchor: 'middle', fill: 'var(--rp-muted, #666258)'})
    )));
  }

  Object.assign(window, {RuopanDemoArt: {BillDrawing, PaperGuide}});
})();
