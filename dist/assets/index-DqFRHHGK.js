(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function n(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(i){if(i.ep)return;i.ep=!0;const r=n(i);fetch(i.href,r)}})();function E(t){const e=t.split(`
`),n=[];let o="",i="",r="",l=null;for(const u of e){const a=u.trim();if(!a)continue;const f=a.match(/^##\s+(.+)/i);if(f){i=f[1].trim(),o=k(i),r="",l=null;continue}const m=a.match(/^\*\*(.+?)\s*(?:\((``?([^`]+)``?\)))?\s*:\*\*$/);if(m&&i){r=m[1].trim();const c=a.match(/`([^`]+)`/);c?l=c[1].trim():l=null;continue}const p=a.match(/^\*\*(.+?)\s*\((``([^`]+)``)\)\s*:\*\*$/);if(p&&i){r=p[1].trim(),l=p[3].trim();continue}const v=a.match(/^`([^`]+)`:\s*(.+)$/);if(v&&i){const c=v[1].trim(),h=v[2].trim(),L=A(h)||l,g=P(h);n.push({brand:o,series:i,subSeries:r||g,code:c,name:g,alias:L});continue}}return n}function k(t){const e={HUAWEI:/华为|HUAWEI/i,华为:/^华为/,Apple:/Apple|苹果/i,小米:/^小米/,OPPO:/OPPO/i,vivo:/vivo/i,三星:/三星|Samsung/i,荣耀:/荣耀|HONOR/i,魅族:/魅族|MEIZU/i,中兴:/中兴|ZTE/i,联想:/联想|Lenovo/i,一加:/一加|OnePlus/i,realme:/realme/i,iQOO:/iQOO/i};for(const[n,o]of Object.entries(e))if(o.test(t))return n==="HUAWEI"?"华为":n==="Apple"?"苹果":n==="小米"?"小米":n==="OPPO"?"OPPO":n==="vivo"?"vivo":n==="三星"?"三星":n==="荣耀"?"荣耀":n==="魅族"?"魅族":n==="中兴"?"中兴":n==="联想"?"联想":n==="一加"?"一加":n==="realme"?"realme":n==="iQOO"?"iQOO":n;return t.substring(0,2)}function A(t){const e=t.match(/`([^`]+)`\s*$/);if(e)return e[1].trim();const n=t.match(/\(([^)]+)\)\s*$/);return n?n[1].trim():null}function P(t){let e=t.replace(/`[^`]+`\s*$/,"").replace(/\s*\([^)]+\)\s*$/,"").trim();return e.includes("/")&&(e=e.split("/")[0].trim()),e}function w(t){const e=[];for(const o of t){const i=E(o.content);e.push(...i)}const n=new Set;return e.filter(o=>n.has(o.code)?!1:(n.add(o.code),!0))}function b(t,e=!0){return JSON.stringify(t,null,e?"  ":void 0)}const s={files:[],models:[],jsonOutput:""},S=1024*1024,y=100;async function B(t){return new Promise((e,n)=>{const o=new FileReader;o.onload=()=>e(o.result),o.onerror=()=>n(o.error),o.readAsText(t)})}async function O(t){if(!t||t.length===0)return;const e=Array.from(t).filter(i=>i.name.endsWith(".md"));if(e.length===0){alert("请上传 .md 文件");return}const n=e.filter(i=>i.size>S);if(n.length>0){alert(`以下文件超过 1MB：${n.map(i=>i.name).join(", ")}`);return}const o=e.filter(i=>!s.files.some(r=>r.name===i.name)).length;if(s.files.length+o>y){alert(`文件数量不能超过 ${y} 个`);return}for(const i of e){const r=await B(i),l=s.files.findIndex(u=>u.name===i.name);l>=0?s.files[l]={name:i.name,content:r}:s.files.push({name:i.name,content:r})}s.models=w(s.files),s.jsonOutput=b(s.models),d()}async function M(t){t.preventDefault(),t.stopPropagation(),document.getElementById("drop-zone")?.classList.remove("drag-over"),await O(t.dataTransfer?.files??null)}function $(t){t.preventDefault(),t.stopPropagation(),document.getElementById("drop-zone")?.classList.add("drag-over")}function x(t){t.preventDefault(),t.stopPropagation(),document.getElementById("drop-zone")?.classList.remove("drag-over")}function j(t){s.files.splice(t,1),s.models=w(s.files),s.jsonOutput=b(s.models),d()}function I(){s.files=[],s.models=[],s.jsonOutput="",d()}function z(){if(s.models.length===0){alert("没有可下载的数据");return}const t=new Blob([s.jsonOutput],{type:"application/json"}),e=URL.createObjectURL(t),n=document.createElement("a");n.href=e,n.download="phone-models.json",document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(e)}function D(){return`
    <div class="tech-bg">
      <div class="grid-lines"></div>
      <div class="connection-lines">
        <div class="connection-line"></div>
        <div class="connection-line"></div>
        <div class="connection-line"></div>
        <div class="connection-line"></div>
        <div class="connection-line"></div>
      </div>
      <div class="particles">
        ${Array.from({length:100},()=>{const e=Math.random()*100,n=Math.random()*100,o=Math.random()*5,i=6+Math.random()*6,r=2+Math.random()*2;return`<div class="particle" style="left: ${e}%; top: ${n}%; animation-delay: ${o}s; animation-duration: ${i}s; width: ${r}px; height: ${r}px;"></div>`}).join("")}
      </div>
    </div>
  `}function F(){return s.files.length===0?"":`
    <div class="file-list">
      ${s.files.map((t,e)=>`
        <div class="file-item">
          <div class="file-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </div>
          <div class="file-info">
            <div class="file-name">${t.name}</div>
            <div class="file-size">${t.content.length} 字符</div>
          </div>
          <button class="btn-remove" onclick="window.removeFile(${e})" title="移除">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `).join("")}
    </div>
  `}function N(t){const e=document.createElement("div");return e.textContent=t,e.innerHTML}function C(){const t=new Set(s.models.map(n=>n.brand)).size,e=new Set(s.models.map(n=>n.series)).size;return`
    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-label">文件:</span>
        <span class="stat-value">${s.files.length}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">机型:</span>
        <span class="stat-value">${s.models.length}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">品牌:</span>
        <span class="stat-value">${t}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">系列:</span>
        <span class="stat-value">${e}</span>
      </div>
    </div>
  `}function H(){return s.jsonOutput?`<pre class="json-preview">${N(s.jsonOutput)}</pre>`:'<div class="empty-hint">上传 MD 文件后显示 JSON 输出</div>'}function d(){const t=document.getElementById("app");if(!t)return;t.innerHTML=`
    ${D()}

    <div class="container">
      <header class="header">
        <div class="header-text">
          <h1>MD 转 JSON</h1>
          <p class="subtitle">机型数据转换工具</p>
        </div>
        <div class="header-actions">
          <a
            href="https://github.com/matomo-org/device-detector?utm_source=chatgpt.com"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-source"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            MD 获取
          </a>
        </div>
      </header>

      <main class="main-content">
        <!-- 左侧：MD 输入 -->
        <section class="panel">
          <div class="panel-header">
            <div class="panel-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              MD 文件输入
            </div>
            ${s.files.length>0?`
              <button class="btn-remove" onclick="window.clearAll()" title="清空全部">
                清空
              </button>
            `:""}
          </div>
          <div class="panel-body">
            <div class="upload-area">
              <div
                id="drop-zone"
                class="drop-zone"
              >
                <div class="drop-zone-content">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <p class="drop-text">拖拽 MD 文件到此处</p>
                  <p class="drop-hint">或点击选择文件（支持批量）</p>
                </div>
                <input
                  type="file"
                  id="file-input"
                  class="file-input"
                  accept=".md"
                  multiple
                />
              </div>
              ${F()}
            </div>
            ${C()}
          </div>
        </section>

        <!-- 右侧：JSON 输出 -->
        <section class="panel">
          <div class="panel-header">
            <div class="panel-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
              JSON 输出
            </div>
          </div>
          <div class="panel-body">
            <div class="json-output">
              ${H()}
            </div>
          </div>
        </section>
      </main>

      <!-- 底部操作栏 -->
      <div class="action-bar">
        <button
          class="btn btn-secondary"
          onclick="window.clearAll()"
          ${s.files.length===0?"disabled":""}
        >
          清空
        </button>
        <button
          class="btn btn-primary"
          onclick="window.downloadJson()"
          ${s.models.length===0?"disabled":""}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          下载 JSON
        </button>
      </div>

      <footer class="footer">
        <span>博远软件内部工具</span>
      </footer>
    </div>
  `;const e=document.getElementById("drop-zone"),n=document.getElementById("file-input");e?.addEventListener("click",()=>n?.click()),e?.addEventListener("drop",o=>M(o)),e?.addEventListener("dragover",$),e?.addEventListener("dragleave",x),n?.addEventListener("change",async o=>{const i=o.target;await O(i.files)})}window.removeFile=j;window.clearAll=I;window.downloadJson=z;window.handleDrop=M;window.handleDragOver=$;window.handleDragLeave=x;function J(){d()}J();
