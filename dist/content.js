let m=!1,h=!1,p=null,b=[];const z=`
  .scrapeflow-highlight {
    outline: 3px solid #3b82f6 !important;
    outline-offset: 2px !important;
    cursor: crosshair !important;
    position: relative;
    background: rgba(59, 130, 246, 0.1) !important;
  }
  
  .scrapeflow-similar {
    outline: 2px dashed #10b981 !important;
    outline-offset: 2px !important;
    position: relative;
  }
  
  .scrapeflow-pagination-highlight {
    outline: 3px solid #f59e0b !important;
    outline-offset: 2px !important;
    cursor: pointer !important;
    position: relative;
    background: rgba(245, 158, 11, 0.1) !important;
  }
  
  .scrapeflow-tooltip {
    position: fixed;
    background: #1e293b;
    color: white;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-family: system-ui, sans-serif;
    z-index: 2147483647;
    pointer-events: none;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    max-width: 350px;
    border: 1px solid #334155;
  }
  
  .scrapeflow-tooltip-tag {
    color: #60a5fa;
    font-weight: 600;
  }
  
  .scrapeflow-preview-panel {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #1e293b;
    color: white;
    padding: 20px;
    border-radius: 12px;
    font-family: system-ui, sans-serif;
    z-index: 2147483647;
    box-shadow: 0 12px 32px rgba(0,0,0,0.5);
    width: 380px;
    max-height: 500px;
    overflow-y: auto;
    border: 1px solid #334155;
  }
  
  .scrapeflow-preview-panel h3 {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .scrapeflow-preview-panel .count {
    color: #10b981;
    font-weight: 700;
    font-size: 18px;
  }
  
  .scrapeflow-preview-list {
    max-height: 180px;
    overflow-y: auto;
    margin: 12px 0;
    padding: 0;
    list-style: none;
    font-size: 12px;
    background: #0f172a;
    border-radius: 6px;
    padding: 8px;
  }
  
  .scrapeflow-preview-list li {
    padding: 6px 8px;
    border-bottom: 1px solid #1e293b;
    color: #94a3b8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .scrapeflow-preview-list li:last-child {
    border-bottom: none;
  }
  
  .scrapeflow-preview-actions {
    display: flex;
    gap: 10px;
    margin-top: 16px;
  }
  
  .scrapeflow-btn {
    flex: 1;
    padding: 10px 14px;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .scrapeflow-btn-primary {
    background: #3b82f6;
    color: white;
  }
  
  .scrapeflow-btn-primary:hover {
    background: #2563eb;
  }
  
  .scrapeflow-btn-secondary {
    background: #334155;
    color: #e2e8f0;
  }
  
  .scrapeflow-btn-secondary:hover {
    background: #475569;
  }
  
  .scrapeflow-selector-info {
    font-size: 12px;
    color: #64748b;
    margin-top: 12px;
    padding: 12px;
    border-top: 1px solid #334155;
    font-family: monospace;
    word-break: break-all;
    background: #0f172a;
    border-radius: 6px;
  }
  
  .scrapeflow-progress {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #1e293b;
    color: white;
    padding: 16px 20px;
    border-radius: 8px;
    font-family: system-ui, sans-serif;
    z-index: 2147483647;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    border: 1px solid #334155;
    min-width: 250px;
  }
  
  .scrapeflow-progress-bar {
    height: 4px;
    background: #334155;
    border-radius: 2px;
    margin-top: 10px;
    overflow: hidden;
  }
  
  .scrapeflow-progress-fill {
    height: 100%;
    background: #3b82f6;
    transition: width 0.3s ease;
  }
  
  .scrapeflow-pagination-detected {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #f59e0b;
    color: #1e293b;
    padding: 10px 20px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 13px;
    z-index: 2147483646;
    animation: scrapeflow-pulse 2s infinite;
  }
  
  @keyframes scrapeflow-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`,P=document.createElement("style");P.textContent=z;document.head.appendChild(P);const u=document.createElement("div");u.className="scrapeflow-tooltip";u.style.display="none";document.body.appendChild(u);let c=null,d=null;chrome.runtime.onMessage.addListener((e,t,o)=>{switch(e.type){case"START_SELECTION":_(),o({success:!0});break;case"START_PAGINATION_SELECTION":j(),o({success:!0});break;case"STOP_SELECTION":x(),o({success:!0});break;case"EXTRACT_DATA":return V(e.payload).then(r=>o(r)).catch(r=>o({success:!1,error:r.message})),!0;case"PING":o({pong:!0,url:window.location.href,title:document.title});break}return!0});function _(){m=!0,h=!1,b=[],document.body.style.cursor="crosshair",document.addEventListener("mouseover",T,!0),document.addEventListener("mouseout",M,!0),document.addEventListener("click",H,!0),document.addEventListener("mousedown",w,!0),document.addEventListener("mouseup",w,!0)}function j(){m=!0,h=!0,document.body.style.cursor="pointer",F(),document.addEventListener("mouseover",C,!0),document.addEventListener("mouseout",A,!0),document.addEventListener("click",q,!0),document.addEventListener("mousedown",w,!0),document.addEventListener("mouseup",w,!0)}function F(){const e=document.createElement("div");e.className="scrapeflow-pagination-detected",e.id="scrapeflow-pagination-helper",e.textContent='👆 Click the "Next" button or page link',document.body.appendChild(e)}function x(){m=!1,h=!1,document.body.style.cursor="",document.removeEventListener("mouseover",T,!0),document.removeEventListener("mouseout",M,!0),document.removeEventListener("click",H,!0),document.removeEventListener("mouseover",C,!0),document.removeEventListener("mouseout",A,!0),document.removeEventListener("click",q,!0),document.removeEventListener("mousedown",w,!0),document.removeEventListener("mouseup",w,!0),p&&(p.classList.remove("scrapeflow-highlight"),p.classList.remove("scrapeflow-pagination-highlight"),p=null),y(),c&&(c.remove(),c=null);const e=document.getElementById("scrapeflow-pagination-helper");e&&e.remove(),u.style.display="none"}function T(e){if(!m||h)return;const t=e.target;!t||t===document.body||t===document.documentElement||t.closest(".scrapeflow-preview-panel")||t.classList.contains("scrapeflow-tooltip")||(p&&p.classList.remove("scrapeflow-highlight"),p=t,t.classList.add("scrapeflow-highlight"),W(t,e))}function C(e){var o;if(!m||!h)return;const t=e.target;!t||t===document.body||t===document.documentElement||(p&&p.classList.remove("scrapeflow-pagination-highlight"),p=t,t.classList.add("scrapeflow-pagination-highlight"),u.innerHTML=`<span class="scrapeflow-tooltip-tag">${((o=t.textContent)==null?void 0:o.trim().slice(0,30))||"No text"}</span><br>Click to use as pagination button`,u.style.display="block",u.style.left=`${e.clientX+10}px`,u.style.top=`${e.clientY+10}px`)}function A(e){if(!m||!h)return;const t=e.target;t===p&&(t.classList.remove("scrapeflow-pagination-highlight"),p=null,u.style.display="none")}function M(e){if(!m||h)return;const t=e.target;t===p&&(t.classList.remove("scrapeflow-highlight"),p=null,u.style.display="none")}function W(e,t){var s;const o=e.tagName.toLowerCase(),r=e.className?`.${e.className.split(" ").slice(0,2).join(".")}`:"",n=e.id?`#${e.id}`:"";u.innerHTML=`
    <span class="scrapeflow-tooltip-tag">&lt;${o}${n}${r.slice(0,20)}&gt;&lt;/${o}&gt;</span><br>
    ${((s=e.textContent)==null?void 0:s.slice(0,60).trim())||"(no text)"}
  `,u.style.display="block",u.style.left=`${t.clientX+10}px`,u.style.top=`${t.clientY+10}px`}function H(e){if(!m||h)return;e.preventDefault(),e.stopPropagation();const t=e.target;if(!t||t.closest(".scrapeflow-preview-panel"))return;const o=X(t);b=o,G(o),R(t,o)}function q(e){var r;if(!m||!h)return;e.preventDefault(),e.stopPropagation();const t=e.target;if(!t)return;const o=O(t);chrome.runtime.sendMessage({type:"PAGINATION_SELECTED",payload:{selector:o,text:(r=t.textContent)==null?void 0:r.trim(),tag:t.tagName.toLowerCase()}}),x()}function w(e){m&&e.preventDefault()}function X(e){if(typeof e=="string")try{return Array.from(document.querySelectorAll(e))}catch{return[]}const t=D(e);for(const o of t)try{const r=document.querySelectorAll(o);if(r.length>=2)return Array.from(r)}catch{continue}return[e]}function D(e){const t=[],o=e.tagName.toLowerCase();if(e.className){const s=e.className.split(" ").filter(a=>a.length>0&&!a.startsWith("scrapeflow"));s.length>0&&(t.push(`${o}.${s.join(".")}`),s.length>1&&t.push(`${o}.${s[0]}`))}const r=e.parentElement;if(r&&e.className){const s=r.tagName.toLowerCase(),a=e.className.split(" ").filter(i=>i.length>0&&!i.startsWith("scrapeflow"));a.length>0&&t.push(`${s} > ${o}.${a[0]}`),r.id&&t.push(`#${r.id} > ${o}`)}for(const s of e.attributes)s.name.startsWith("data-")&&(t.push(`${o}[${s.name}]`),s.value&&t.push(`${o}[${s.name}="${s.value}"]`));r&&Array.from(r.children).filter(a=>a.tagName===e.tagName).length>1&&t.push(`${r.tagName.toLowerCase()} > ${o}`);const n=e.getAttribute("role");return n&&t.push(`${o}[role="${n}"]`),t}function B(e,t){const o=D(e);for(const r of o)try{if(document.querySelectorAll(r).length===t.length)return r}catch{continue}return O(e)}function G(e){y(),e.forEach((t,o)=>{t.classList.add("scrapeflow-similar"),t.setAttribute("data-scrapeflow-index",String(o+1))})}function y(){document.querySelectorAll(".scrapeflow-similar").forEach(e=>{e.classList.remove("scrapeflow-similar"),e.removeAttribute("data-scrapeflow-index")})}function R(e,t){var n,s;c&&c.remove();const o=B(e,t),r=t.slice(0,5).map(a=>{var l;const i=((l=a.textContent)==null?void 0:l.trim().slice(0,60))||"(no text)";return i.length>60?i+"...":i});c=document.createElement("div"),c.className="scrapeflow-preview-panel",c.innerHTML=`
    <h3>✨ Found <span class="count">${t.length}</span> similar elements</h3>
    <ul class="scrapeflow-preview-list">
      ${r.map(a=>`<li>${a}</li>`).join("")}
      ${t.length>5?`<li style="color: #64748b; font-style: italic;">... and ${t.length-5} more</li>`:""}
    </ul>
    <div class="scrapeflow-selector-info">
      ${o}
    </div>
    <div class="scrapeflow-preview-actions">
      <button class="scrapeflow-btn scrapeflow-btn-primary" id="scrapeflow-confirm">✓ Use This Selector</button>
      <button class="scrapeflow-btn scrapeflow-btn-secondary" id="scrapeflow-cancel">✕ Try Again</button>
    </div>
  `,document.body.appendChild(c),(n=c.querySelector("#scrapeflow-confirm"))==null||n.addEventListener("click",a=>{a.stopPropagation(),U(e,o,t.length)}),(s=c.querySelector("#scrapeflow-cancel"))==null||s.addEventListener("click",a=>{a.stopPropagation(),Y()})}function U(e,t,o){var n;const r={tag:e.tagName.toLowerCase(),id:e.id||void 0,className:e.className||void 0,text:((n=e.textContent)==null?void 0:n.trim())||"",selector:t,xpath:ee(e),attributes:te(e)};chrome.runtime.sendMessage({type:"ELEMENT_SELECTED",payload:{...r,similarCount:o,previewTexts:b.slice(0,3).map(s=>{var a;return((a=s.textContent)==null?void 0:a.trim().slice(0,50))||""})}}),x()}function Y(){y(),c&&(c.remove(),c=null)}async function V({config:e}){const t=[];let o=0;Z();try{if(e.pagination.enabled){const r=e.pagination.maxPages||10;for(let n=1;n<=r;n++){const s=S(e,n);if(s.length===0)break;if(t.push(...s),o=n,$(n,r,t.length),n<r){if(!await K(e.pagination))break;await I(e.pagination.delay||1e3)}}}else{const r=S(e);t.push(...r),o=1,$(1,1,r.length)}return k(),{success:!0,rows:t,pageCount:o}}catch(r){return k(),{success:!1,rows:t,pageCount:o,error:String(r)}}}function S(e,t){const o=[];if(e.selectors.length===0)return o;const r=e.selectors[0].selector;return document.querySelectorAll(r).forEach((s,a)=>{const i={};e.selectors.forEach(l=>{var v,E;let f=null;l.selector===r?f=s:(f=s.querySelector(l.selector),f||(f=document.querySelectorAll(l.selector)[a]||null));let g="";if(f){switch(l.dataType){case"text":g=((v=f.textContent)==null?void 0:v.trim())||"";break;case"html":g=f.innerHTML||"";break;case"attribute":g=l.attribute&&f.getAttribute(l.attribute)||"";break;case"number":const N=((E=f.textContent)==null?void 0:E.trim())||"",L=parseFloat(N.replace(/[^\d.-]/g,""));g=isNaN(L)?null:L;break}l.transform&&(g=J(g,l.transform))}i[l.columnName]=g}),t&&(i._page=t),i._url=window.location.href,i._scrapedAt=new Date().toISOString(),o.push(i)}),o}function J(e,t){var r,n,s,a;if(e===null)return null;let o=String(e);switch(t.type){case"trim":return o.trim();case"number":const i=parseFloat(o.replace(/[^\d.-]/g,""));return isNaN(i)?null:i;case"currency":const l=parseFloat(o.replace(/[^\d.-]/g,""));return isNaN(l)?null:`${((r=t.options)==null?void 0:r.currencySymbol)||"$"}${l.toFixed(2)}`;case"regex":if((n=t.options)!=null&&n.regex){const f=new RegExp(t.options.regex),g=o.match(f);return g?g[0]:""}return o;case"replace":return(s=t.options)!=null&&s.regex&&((a=t.options)==null?void 0:a.replacement)!==void 0?o.replace(new RegExp(t.options.regex,"g"),t.options.replacement):o;default:return e}}async function K(e){switch(e.type){case"click":if(e.selector){const r=document.querySelector(e.selector);if(r)return r.hasAttribute("disabled")||r.classList.contains("disabled")||r.getAttribute("aria-disabled")==="true"?!1:(r.click(),!0)}return!1;case"scroll":return window.scrollTo(0,document.body.scrollHeight),!0;case"url":if(e.urlPattern){const r=Q(),n=e.urlPattern.replace("{n}",String(r+1));return window.location.href=n,!0}return!1;case"infinite":const t=document.body.scrollHeight;return window.scrollTo(0,document.body.scrollHeight),await I(1e3),document.body.scrollHeight>t;default:return!1}}function Q(){const t=new URL(window.location.href).searchParams.get("page");if(t){const r=parseInt(t,10);return isNaN(r)?1:r}const o=window.location.pathname.match(/page[/-](\d+)/i);return o?parseInt(o[1],10):1}function Z(){d||(d=document.createElement("div"),d.className="scrapeflow-progress",d.innerHTML=`
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span style="font-weight: 600;">⏳ Scraping in progress...</span>
      <span id="scrapeflow-progress-text">Page 1</span>
    </div>
    <div class="scrapeflow-progress-bar">
      <div class="scrapeflow-progress-fill" id="scrapeflow-progress-fill" style="width: 0%;"></div>
    </div>
    <div id="scrapeflow-rows-count" style="margin-top: 8px; font-size: 12px; color: #94a3b8;">0 rows collected</div>
  `,document.body.appendChild(d))}function $(e,t,o){if(!d)return;const r=Math.min(e/t*100,100),n=d.querySelector("#scrapeflow-progress-fill"),s=d.querySelector("#scrapeflow-progress-text"),a=d.querySelector("#scrapeflow-rows-count");n&&(n.style.width=`${r}%`),s&&(s.textContent=`Page ${e}`),a&&(a.textContent=`${o} rows collected`)}function k(){d&&(d.remove(),d=null)}function I(e){return new Promise(t=>setTimeout(t,e))}function O(e){var r;if(e.id)return`#${e.id}`;if(e.className){const n=e.className.split(" ").filter(s=>s.length>0);if(n.length>0){const s=`.${n.join(".")}`;if(document.querySelectorAll(s).length===1)return s}}const t=[];let o=e;for(;o&&o!==document.body;){let n=o.tagName.toLowerCase();if(o.id){n=`#${o.id}`,t.unshift(n);break}if(o.className){const i=o.className.split(" ").filter(l=>l.length>0).slice(0,2);i.length>0&&(n+=`.${i.join(".")}`)}const a=Array.from(((r=o.parentElement)==null?void 0:r.children)||[]).filter(i=>i.tagName===o.tagName);if(a.length>1){const i=a.indexOf(o)+1;n+=`:nth-of-type(${i})`}t.unshift(n),o=o.parentElement}return t.join(" > ")}function ee(e){const t=[];let o=e;for(;o&&o.nodeType===Node.ELEMENT_NODE;){let r=1,n=o.previousElementSibling;for(;n;)n.nodeName===o.nodeName&&r++,n=n.previousElementSibling;const s=o.nodeName.toLowerCase(),a=r>1?`${s}[${r}]`:s;t.unshift(a),o=o.parentElement}return"/"+t.join("/")}function te(e){const t=["href","src","alt","title","data-*"],o={};for(const r of e.attributes)t.some(n=>r.name===n||n.endsWith("*")&&r.name.startsWith(n.slice(0,-1)))&&(o[r.name]=r.value);return o}console.log("ScrapeFlow content script loaded on",window.location.href);
