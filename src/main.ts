import './index.css';
import { parseMultipleMdFiles, toJson, PhoneModel } from './parser';

// 全局状态
interface AppState {
  files: { name: string; content: string }[];
  models: PhoneModel[];
  jsonOutput: string;
}

const state: AppState = {
  files: [],
  models: [],
  jsonOutput: ''
};

// 文件读取工具
async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

// 处理文件上传
async function handleFileUpload(files: FileList | null) {
  if (!files || files.length === 0) return;

  const mdFiles = Array.from(files).filter(f => f.name.endsWith('.md'));

  if (mdFiles.length === 0) {
    alert('请上传 .md 文件');
    return;
  }

  for (const file of mdFiles) {
    const content = await readFileAsText(file);
    const existingIndex = state.files.findIndex(f => f.name === file.name);
    if (existingIndex >= 0) {
      state.files[existingIndex] = { name: file.name, content };
    } else {
      state.files.push({ name: file.name, content });
    }
  }

  state.models = parseMultipleMdFiles(state.files);
  state.jsonOutput = toJson(state.models);
  render();
}

// 处理文件拖放
async function handleDrop(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();
  const dropZone = document.getElementById('drop-zone');
  dropZone?.classList.remove('drag-over');
  await handleFileUpload(e.dataTransfer?.files ?? null);
}

// 处理拖放悬停效果
function handleDragOver(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();
  const dropZone = document.getElementById('drop-zone');
  dropZone?.classList.add('drag-over');
}

function handleDragLeave(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();
  const dropZone = document.getElementById('drop-zone');
  dropZone?.classList.remove('drag-over');
}

// 删除已上传的文件
function removeFile(index: number) {
  state.files.splice(index, 1);
  state.models = parseMultipleMdFiles(state.files);
  state.jsonOutput = toJson(state.models);
  render();
}

// 清除所有文件
function clearAll() {
  state.files = [];
  state.models = [];
  state.jsonOutput = '';
  render();
}

// 下载 JSON 文件
function downloadJson() {
  if (state.models.length === 0) {
    alert('没有可下载的数据');
    return;
  }

  const blob = new Blob([state.jsonOutput], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'phone-models.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 渲染科技感背景
function renderTechBackground() {
  // 生成100个粒子，随机位置和动画参数
  const particles = Array.from({ length: 100 }, () => {
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = 6 + Math.random() * 6;
    const size = 2 + Math.random() * 2;
    return `<div class="particle" style="left: ${left}%; top: ${top}%; animation-delay: ${delay}s; animation-duration: ${duration}s; width: ${size}px; height: ${size}px;"></div>`;
  }).join('');

  return `
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
        ${particles}
      </div>
    </div>
  `;
}

// 渲染文件列表
function renderFileList() {
  if (state.files.length === 0) {
    return '';
  }

  return `
    <div class="file-list">
      ${state.files.map((file, index) => `
        <div class="file-item">
          <div class="file-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </div>
          <div class="file-info">
            <div class="file-name">${file.name}</div>
            <div class="file-size">${file.content.length} 字符</div>
          </div>
          <button class="btn-remove" onclick="window.removeFile(${index})" title="移除">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

// HTML 转义
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 渲染统计信息
function renderStats() {
  const brands = new Set(state.models.map(m => m.brand)).size;
  const series = new Set(state.models.map(m => m.series)).size;

  return `
    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-label">文件:</span>
        <span class="stat-value">${state.files.length}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">机型:</span>
        <span class="stat-value">${state.models.length}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">品牌:</span>
        <span class="stat-value">${brands}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">系列:</span>
        <span class="stat-value">${series}</span>
      </div>
    </div>
  `;
}

// 渲染 JSON 预览
function renderJsonPreview() {
  if (!state.jsonOutput) {
    return '<div class="empty-hint">上传 MD 文件后显示 JSON 输出</div>';
  }
  return `<pre class="json-preview">${escapeHtml(state.jsonOutput)}</pre>`;
}

// 主渲染函数
function render() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    ${renderTechBackground()}

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
            ${state.files.length > 0 ? `
              <button class="btn-remove" onclick="window.clearAll()" title="清空全部">
                清空
              </button>
            ` : ''}
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
              ${renderFileList()}
            </div>
            ${renderStats()}
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
              ${renderJsonPreview()}
            </div>
          </div>
        </section>
      </main>

      <!-- 底部操作栏 -->
      <div class="action-bar">
        <button
          class="btn btn-secondary"
          onclick="window.clearAll()"
          ${state.files.length === 0 ? 'disabled' : ''}
        >
          清空
        </button>
        <button
          class="btn btn-primary"
          onclick="window.downloadJson()"
          ${state.models.length === 0 ? 'disabled' : ''}
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
  `;

  // 绑定事件
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input') as HTMLInputElement;

  dropZone?.addEventListener('click', () => fileInput?.click());
  dropZone?.addEventListener('drop', (e) => handleDrop(e as DragEvent));
  dropZone?.addEventListener('dragover', handleDragOver);
  dropZone?.addEventListener('dragleave', handleDragLeave);
  fileInput?.addEventListener('change', async (e) => {
    const input = e.target as HTMLInputElement;
    await handleFileUpload(input.files);
  });
}

// 导出全局函数
(window as unknown as { [key: string]: unknown }).removeFile = removeFile;
(window as unknown as { [key: string]: unknown }).clearAll = clearAll;
(window as unknown as { [key: string]: unknown }).downloadJson = downloadJson;
(window as unknown as { [key: string]: unknown }).handleDrop = handleDrop;
(window as unknown as { [key: string]: unknown }).handleDragOver = handleDragOver;
(window as unknown as { [key: string]: unknown }).handleDragLeave = handleDragLeave;

// 初始化
export function initApp() {
  render();
}
