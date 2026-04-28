/**
 * MD 文件解析器 - 将机型 MD 文件转换为 JSON 结构
 */

// 解析后的单个机型数据
export interface PhoneModel {
  brand: string;        // 品牌（从系列名提取，如 "华为"）
  series: string;        // 系列（如 "HUAWEI Mate 系列"）
  subSeries: string;     // 子系列（如 "华为 Ascend Mate"、"华为 Ascend Mate 2"）
  code: string;          // 型号代码（如 "HUAWEI MT1-T00"）
  name: string;          // 完整名称（如 "华为 Ascend Mate 移动版"）
  alias: string | null;  // 别名（如 "Jazz"）
}

/**
 * 解析单个 MD 文件内容
 */
export function parseMdContent(content: string): PhoneModel[] {
  const lines = content.split('\n');
  const result: PhoneModel[] = [];

  let currentBrand = '';
  let currentSeries = '';
  let currentSubSeries = '';
  let currentAlias: string | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // 跳过空行
    if (!trimmedLine) continue;

    // 匹配系列标题 ## HUAWEI xxx 系列
    const seriesMatch = trimmedLine.match(/^##\s+(.+)/i);
    if (seriesMatch) {
      currentSeries = seriesMatch[1].trim();
      currentBrand = extractBrand(currentSeries);
      currentSubSeries = '';
      currentAlias = null;
      continue;
    }

    // 匹配子系列标题 **华为 Ascend Mate:** 或 **华为 Ascend Mate 2:**
    // 支持格式: **名称:** 或 **名称 (`别名`):** 或 **名称 (别名):**
    const subSeriesMatch = trimmedLine.match(/^\*\*(.+?)\s*(?:\((``?([^`]+)``?\)))?\s*:\*\*$/);
    if (subSeriesMatch && currentSeries) {
      currentSubSeries = subSeriesMatch[1].trim();
      // 从子系列标题中提取别名（如 `Jazz` 或 (Jazz)）
      const aliasMatch = trimmedLine.match(/`([^`]+)`/);
      if (aliasMatch) {
        currentAlias = aliasMatch[1].trim();
      } else {
        currentAlias = null;
      }
      continue;
    }

    // 匹配子系列标题带别名 **华为 Ascend Mate 7 (`Jazz`):**
    const subSeriesWithAliasMatch = trimmedLine.match(/^\*\*(.+?)\s*\((``([^`]+)``)\)\s*:\*\*$/);
    if (subSeriesWithAliasMatch && currentSeries) {
      currentSubSeries = subSeriesWithAliasMatch[1].trim();
      currentAlias = subSeriesWithAliasMatch[3].trim();
      continue;
    }

    // 匹配型号行 `HUAWEI MT1-T00`: 华为 Ascend Mate 移动版
    const modelMatch = trimmedLine.match(/^`([^`]+)`:\s*(.+)$/);
    if (modelMatch && currentSeries) {
      const code = modelMatch[1].trim();
      const fullName = modelMatch[2].trim();
      const alias = extractAliasFromName(fullName) || currentAlias;
      const cleanName = cleanModelName(fullName);

      result.push({
        brand: currentBrand,
        series: currentSeries,
        subSeries: currentSubSeries || cleanName,
        code,
        name: cleanName,
        alias
      });
      continue;
    }
  }

  return result;
}

/**
 * 从系列名中提取品牌
 */
function extractBrand(series: string): string {
  // 常见品牌映射
  const brandPatterns: Record<string, RegExp> = {
    'HUAWEI': /华为|HUAWEI/i,
    '华为': /^华为/,
    'Apple': /Apple|苹果/i,
    '小米': /^小米/,
    'OPPO': /OPPO/i,
    'vivo': /vivo/i,
    '三星': /三星|Samsung/i,
    '荣耀': /荣耀|HONOR/i,
    '魅族': /魅族|MEIZU/i,
    '中兴': /中兴|ZTE/i,
    '联想': /联想|Lenovo/i,
    '一加': /一加|OnePlus/i,
    'realme': /realme/i,
    'iQOO': /iQOO/i,
  };

  for (const [brand, pattern] of Object.entries(brandPatterns)) {
    if (pattern.test(series)) {
      // 统一品牌名称
      if (brand === 'HUAWEI') return '华为';
      if (brand === 'Apple') return '苹果';
      if (brand === '小米') return '小米';
      if (brand === 'OPPO') return 'OPPO';
      if (brand === 'vivo') return 'vivo';
      if (brand === '三星') return '三星';
      if (brand === '荣耀') return '荣耀';
      if (brand === '魅族') return '魅族';
      if (brand === '中兴') return '中兴';
      if (brand === '联想') return '联想';
      if (brand === '一加') return '一加';
      if (brand === 'realme') return 'realme';
      if (brand === 'iQOO') return 'iQOO';
      return brand;
    }
  }

  // 默认取系列名的前两个字作为品牌
  return series.substring(0, 2);
}

/**
 * 从名称中提取别名（如 `Jazz` 或 (Jazz)）
 */
function extractAliasFromName(name: string): string | null {
  // 先尝试匹配反引号包裹的别名
  const backtickMatch = name.match(/`([^`]+)`\s*$/);
  if (backtickMatch) return backtickMatch[1].trim();

  // 再尝试匹配圆括号包裹的别名
  const parenMatch = name.match(/\(([^)]+)\)\s*$/);
  if (parenMatch) return parenMatch[1].trim();

  return null;
}

/**
 * 从名称中移除别名，并处理多个名称的情况（只保留第一个）
 * 例如："荣耀畅玩 40 5G / 荣耀畅玩 40C 5G / 荣耀畅玩 40S 5G" → "荣耀畅玩 40 5G"
 */
function cleanModelName(name: string): string {
  // 先移除别名
  let result = name.replace(/`[^`]+`\s*$/, '').replace(/\s*\([^)]+\)\s*$/, '').trim();

  // 如果有多个名称（用 "/" 分隔），只保留第一个
  if (result.includes('/')) {
    result = result.split('/')[0].trim();
  }

  return result;
}

/**
 * 解析多个 MD 文件并合并
 */
export function parseMultipleMdFiles(files: { name: string; content: string }[]): PhoneModel[] {
  const allModels: PhoneModel[] = [];

  for (const file of files) {
    const models = parseMdContent(file.content);
    allModels.push(...models);
  }

  // 去重（基于 code）
  const seen = new Set<string>();
  return allModels.filter(model => {
    if (seen.has(model.code)) {
      return false;
    }
    seen.add(model.code);
    return true;
  });
}

/**
 * 将解析结果转换为 JSON 字符串
 */
export function toJson(models: PhoneModel[], pretty = true): string {
  return JSON.stringify(models, null, pretty ? '  ' : undefined);
}
