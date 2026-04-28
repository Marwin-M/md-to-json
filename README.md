# MD 转 JSON 工具

机型数据转换工具，将 Markdown 格式的机型数据文件批量转换为 JSON 格式。

## 功能特性

- 批量上传 MD 文件（最多 100 个，单个最大 1MB）
- 自动解析机型数据（品牌、系列、型号代码、名称、别名）
- 多个名称只保留第一个
- JSON 实时预览
- 一键下载 JSON 文件
- 响应式设计，支持手机端

## MD 文件格式

```markdown
## HUAWEI Mate 系列

**华为 Ascend Mate:**

`HUAWEI MT1-T00`: 华为 Ascend Mate 移动版

`HUAWEI MT1-U06`: 华为 Ascend Mate 联通版

**华为 Ascend Mate 7 (`Jazz`):**

`HUAWEI MT7-TL00`: 华为 Ascend Mate 7 移动版
```

## 输出 JSON 格式

```json
[
  {
    "brand": "华为",
    "series": "HUAWEI Mate 系列",
    "subSeries": "华为 Ascend Mate",
    "code": "HUAWEI MT1-T00",
    "name": "华为 Ascend Mate 移动版",
    "alias": null
  },
  {
    "brand": "华为",
    "series": "HUAWEI Mate 系列",
    "subSeries": "华为 Ascend Mate 7",
    "code": "HUAWEI MT7-TL00",
    "name": "华为 Ascend Mate 7 移动版",
    "alias": "Jazz"
  }
]
```

## 在线使用

访问在线版本：https://md-to-json.vercel.app/

## 部署到 Vercel

### 方法一：直接导入

1. Fork 本仓库
2. 登录 [Vercel](https://vercel.com)
3. Import 本仓库
4. Deploy

### 方法二：拖拽部署

1. 构建项目：`pnpm build`
2. 将 `dist` 文件夹内容拖拽到 [Vercel](https://vercel.com) 新建项目

## 本地开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建生产版本
pnpm build
```

## 技术栈

- Vite 7
- TypeScript
- Tailwind CSS

## 字段说明

| 字段 | 说明 | 示例 |
|------|------|------|
| brand | 品牌 | 华为、苹果、小米 |
| series | 系列 | HUAWEI Mate 系列 |
| subSeries | 子系列 | 华为 Ascend Mate |
| code | 型号代码 | HUAWEI MT7-TL00 |
| name | 名称 | 华为 Ascend Mate 7 移动版 |
| alias | 别名 | Jazz、Carrera |

## 协议

博远软件内部工具
