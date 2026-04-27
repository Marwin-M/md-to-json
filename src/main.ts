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
    // 检查是否已存在同名文件
    const existingIndex = state.files.findIndex(f => f.name === file.name);
    if (existingIndex >= 0) {
      state.files[existingIndex] = { name: file.name, content };
    } else {
      state.files.push({ name: file.name, content });
    }
  }

  // 重新解析所有文件
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

  const files = e.dataTransfer?.files ?? null;
  await handleFileUpload(files);
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

// 渲染统计信息
function renderStats() {
  const statsHtml = `
    <div class="stats">
      <div class="stat-item">
        <span class="stat-value">${state.files.length}</span>
        <span class="stat-label">已上传文件</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${state.models.length}</span>
        <span class="stat-label">解析到机型</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${new Set(state.models.map(m => m.brand)).size}</span>
        <span class="stat-label">品牌数量</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${new Set(state.models.map(m => m.series)).size}</span>
        <span class="stat-label">系列数量</span>
      </div>
    </div>
  `;
  return statsHtml;
}

// 渲染文件列表
function renderFileList() {
  if (state.files.length === 0) {
    return '<div class="empty-hint">尚未上传任何文件</div>';
  }

  return `
    <div class="file-list">
      ${state.files.map((file, index) => `
        <div class="file-item">
          <div class="file-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </div>
          <div class="file-info">
            <div class="file-name">${file.name}</div>
            <div class="file-size">${file.content.length} 字符</div>
          </div>
          <button class="btn-remove" onclick="window.removeFile(${index})" title="移除">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

// 渲染 JSON 预览
function renderJsonPreview() {
  if (!state.jsonOutput) {
    return '<div class="empty-hint">预览区域（上传文件后显示）</div>';
  }

  // 限制预览长度
  const preview = state.jsonOutput.length > 2000
    ? state.jsonOutput.substring(0, 2000) + '\n... (已截断，显示前 2000 字符)'
    : state.jsonOutput;

  return `<pre class="json-preview">${escapeHtml(preview)}</pre>`;
}

// HTML 转义
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 渲染预览表格
function renderPreviewTable() {
  if (state.models.length === 0) {
    return '<div class="empty-hint">暂无解析数据</div>';
  }

  // 显示前 10 条
  const previewModels = state.models.slice(0, 10);

  return `
    <div class="preview-table-wrapper">
      <table class="preview-table">
        <thead>
          <tr>
            <th>品牌</th>
            <th>系列</th>
            <th>型号代码</th>
            <th>名称</th>
            <th>别名</th>
          </tr>
        </thead>
        <tbody>
          ${previewModels.map(model => `
            <tr>
              <td>${escapeHtml(model.brand)}</td>
              <td>${escapeHtml(model.series)}</td>
              <td><code>${escapeHtml(model.code)}</code></td>
              <td>${escapeHtml(model.name)}</td>
              <td>${model.alias ? escapeHtml(model.alias) : '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      ${state.models.length > 10 ? `<div class="table-footer">共 ${state.models.length} 条记录，仅显示前 10 条</div>` : ''}
    </div>
  `;
}

// 主渲染函数
function render() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="container">
      <header class="header">
        <h1>MD 转 JSON 工具</h1>
        <p class="subtitle">将机型 MD 文件批量转换为 JSON 数据格式</p>
      </header>

      <main class="main">
        <section class="upload-section">
          <div
            id="drop-zone"
            class="drop-zone"
            ondrop="window.handleDrop(event)"
            ondragover="window.handleDragOver(event)"
            ondragleave="window.handleDragLeave(event)"
          >
            <div class="drop-zone-content">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <p class="drop-text">拖拽 MD 文件到此处</p>
              <p class="drop-hint">或点击选择文件（支持批量）</p>
              <input
                type="file"
                id="file-input"
                class="file-input"
                accept=".md"
                multiple
                onchange="window.handleFileInput(event)"
              />
            </div>
          </div>

          ${renderStats()}
          ${renderFileList()}

          ${state.files.length > 0 ? `
            <div class="action-buttons">
              <button class="btn btn-secondary" onclick="window.clearAll()">清空全部</button>
            </div>
          ` : ''}
        </section>

        <section class="preview-section">
          <div class="section-header">
            <h2>数据预览</h2>
            ${renderStats()}
          </div>
          ${renderPreviewTable()}
        </section>

        <section class="output-section">
          <div class="section-header">
            <h2>JSON 输出</h2>
            <button
              class="btn btn-primary"
              onclick="window.downloadJson()"
              ${state.models.length === 0 ? 'disabled' : ''}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              下载 JSON
            </button>
          </div>
          ${renderJsonPreview()}
        </section>
      </main>

      <footer class="footer">
        <p>支持格式：MD 文件中的 型号代码: 名称 格式</p>
      </footer>
    </div>
  `;

  // 绑定点击事件
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input') as HTMLInputElement;

  dropZone?.addEventListener('click', () => {
    fileInput?.click();
  });
}

// 初始化全局函数
(window as unknown as { [key: string]: unknown }).handleFileInput = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  await handleFileUpload(input.files);
};

(window as unknown as { [key: string]: unknown }).handleDrop = handleDrop;
(window as unknown as { [key: string]: unknown }).handleDragOver = handleDragOver;
(window as unknown as { [key: string]: unknown }).handleDragLeave = handleDragLeave;
(window as unknown as { [key: string]: unknown }).removeFile = removeFile;
(window as unknown as { [key: string]: unknown }).clearAll = clearAll;
(window as unknown as { [key: string]: unknown }).downloadJson = downloadJson;

// 导出初始化函数
export function initApp() {
  render();
}
