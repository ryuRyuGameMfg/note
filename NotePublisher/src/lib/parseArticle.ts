export interface ParsedArticle {
  title: string;
  subtitle: string;
  hashtags: string[];
  hasComparison: boolean;
  hasProscons: boolean;
  hasStats: boolean;
  isNews: boolean;
  isTutorial: boolean;
  isComparison: boolean;
  comparisonData?: {
    title: string;
    headers: string[];
    rows: { label: string; values: (string | boolean)[] }[];
  };
  proscons?: {
    title: string;
    pros: string[];
    cons: string[]
  };
  stats?: { value: string; label: string; color: string }[];
  beforeAfter?: { label: string; before: string; after: string }[];
  suggestedTemplates: {
    thumbnails: string[];
    infographics: string[];
  };
}

/**
 * タイトルを解析して【】の後に改行を入れる
 */
export function parseTitle(title: string): string {
  // 【】の閉じ括弧の後に改行を入れる
  // ただし、｜（パイプ）の前の【】だけを対象にする
  return title.replace(/】(?!.*】)/g, '】\n');
}

export function parseMarkdown(content: string): ParsedArticle {
  const lines = content.split('\n');
  
  // タイトル抽出
  const titleLine = lines.find(l => l.startsWith('# '));
  const title = titleLine ? titleLine.replace('# ', '').trim() : 'タイトル未設定';
  
  // ハッシュタグ抽出（記事末尾のハッシュタグ行）
  const hashtagLine = lines.find(l => l.match(/^#[A-Za-z\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/) && !l.startsWith('# ') && !l.startsWith('## '));
  const hashtags = hashtagLine 
    ? hashtagLine.split(' ').filter(t => t.startsWith('#')).map(t => t.replace('#', ''))
    : [];
  
  // サブタイトル（最初の段落、CTAやリンクを除く）
  let subtitle = '';
  for (let i = 1; i < Math.min(10, lines.length); i++) {
    const line = lines[i].trim();
    if (line && !line.startsWith('#') && !line.startsWith('|') && 
        !line.startsWith('http') && !line.startsWith('**') && !line.includes('coconala')) {
      subtitle = line.slice(0, 60);
      break;
    }
  }
  
  // 記事タイプ判定
  const isNews = title.includes('速報') || title.includes('発表') || title.includes('NEW') || title.includes('最新');
  const isTutorial = title.includes('方法') || title.includes('手順') || title.includes('ガイド') || title.includes('入門');
  const isComparison = title.includes('比較') || title.includes('VS') || title.includes('vs');
  
  // 比較表の検出
  const tableStart = lines.findIndex(l => l.includes('|') && l.trim().startsWith('|'));
  let comparisonData: ParsedArticle['comparisonData'] | undefined;
  if (tableStart >= 0) {
    // テーブルのタイトルを探す（直前の見出し）
    let tableTitle = '比較表';
    for (let i = tableStart - 1; i >= 0; i--) {
      if (lines[i].startsWith('## ') || lines[i].startsWith('### ')) {
        tableTitle = lines[i].replace(/^#+\s*/, '');
        break;
      }
    }
    
    const headerLine = lines[tableStart];
    const headers = headerLine.split('|').filter(h => h.trim()).slice(1);
    
    // セパレータ行を探す
    const separatorIndex = lines.findIndex((l, i) => i > tableStart && l.includes('---'));
    if (separatorIndex > 0) {
      const rows: { label: string; values: (string | boolean)[] }[] = [];
      for (let i = separatorIndex + 1; i < lines.length && lines[i].includes('|'); i++) {
        const cells = lines[i].split('|').filter(c => c.trim());
        if (cells.length > 1) {
          rows.push({
            label: cells[0].trim(),
            values: cells.slice(1).map(c => {
              const v = c.trim();
              if (v === '✅' || v === '○' || v === '◎' || v.toLowerCase() === 'yes') return true;
              if (v === '❌' || v === '×' || v === '-' || v.toLowerCase() === 'no') return false;
              return v;
            })
          });
        }
      }
      if (headers.length > 0 && rows.length > 0) {
        comparisonData = { title: tableTitle, headers, rows: rows.slice(0, 8) };
      }
    }
  }
  
  // メリット・デメリットの検出
  let proscons: ParsedArticle['proscons'] | undefined;
  
  // 「おすすめな人」「向いている人」セクションを優先的に検出
  const recommendedIndex = lines.findIndex(l => 
    l.includes('おすすめな人') || l.includes('向いている人') || l.includes('こんな人におすすめ')
  );
  
  // 通常のメリット・デメリットセクションを検出
  const prosIndex = lines.findIndex(l => 
    (l.includes('メリット') || l.includes('強み') || l.includes('良い点') || l.includes('Manusの強み')) &&
    !l.includes('デメリット') // デメリットと同じ行にあるものは除外
  );
  const consIndex = lines.findIndex(l => 
    (l.includes('デメリット') || l.includes('注意点') || l.includes('弱み') || l.includes('制約')) &&
    !l.includes('メリット') // メリットと同じ行にあるものは除外
  );
  
  if (prosIndex >= 0 && consIndex >= 0) {
    const pros: string[] = [];
    const cons: string[] = [];
    let prosTitle = 'メリット・デメリット';
    
    // メリット抽出
    if (prosIndex >= 0) {
      const prosLine = lines[prosIndex];
      if (prosLine.startsWith('## ') || prosLine.startsWith('### ')) {
        prosTitle = prosLine.replace(/^#+\s*/, '');
      }
      for (let i = prosIndex + 1; i < lines.length && i < prosIndex + 20; i++) {
        const line = lines[i].trim();
        if (line.startsWith('-') || line.startsWith('・') || line.startsWith('✓')) {
          const text = line.replace(/^[-・✓]\s*/, '').replace(/\*\*/g, '');
          if (text.length > 5 && text.length < 60 && !text.includes('**')) {
            pros.push(text);
          }
        }
        // 次のセクションに到達したら終了
        if ((line.startsWith('## ') || line.startsWith('### ')) && i > prosIndex + 2) break;
      }
    }
    
    // デメリット抽出
    if (consIndex >= 0) {
      for (let i = consIndex + 1; i < lines.length && i < consIndex + 20; i++) {
        const line = lines[i].trim();
        if (line.startsWith('-') || line.startsWith('・') || line.startsWith('▼')) {
          const text = line.replace(/^[-・▼]\s*/, '').replace(/\*\*/g, '');
          if (text.length > 5 && text.length < 60 && !text.includes('**')) {
            cons.push(text);
          }
        }
        // 次のセクションに到達したら終了
        if ((line.startsWith('## ') || line.startsWith('### ')) && i > consIndex + 2) break;
      }
    }
    
    // メリット・デメリットが両方3つ以上ある場合のみ採用
    if (pros.length >= 3 && cons.length >= 3) {
      proscons = { 
        title: prosTitle,
        pros: pros.slice(0, 5), 
        cons: cons.slice(0, 5) 
      };
    }
  }
  
  // 統計データの検出（数字+単位のパターン）
  // より意味のある統計データのみを抽出
  const statsPatterns = content.match(/(\d+[\d,]*)(件|万円|千円|億円|年|%|GB|TB|時間|日|ヶ月|倍)/g);
  let stats: ParsedArticle['stats'] | undefined;
  if (statsPatterns && statsPatterns.length >= 3) {
    // カラーパレット（REGULATIONS.md準拠）
    const colors = ['#3b82f6', '#22c55e', '#f97316', '#a855f7', '#22d3ee', '#2563eb'];
    
    // 重複を排除し、意味のある数値のみを抽出
    const uniqueStats = [...new Set(statsPatterns)]
      .filter(match => {
        // 小さすぎる数値や年号は除外
        const num = parseInt(match.replace(/[^0-9]/g, ''));
        return num >= 10 && num <= 999999;
      });
    
    if (uniqueStats.length >= 3) {
      stats = uniqueStats.slice(0, 6).map((match, i) => {
        // ラベルを推測
        let label = '指標';
        if (match.includes('件')) label = '実績数';
        else if (match.includes('万円') || match.includes('円')) label = '金額';
        else if (match.includes('年') || match.includes('ヶ月')) label = '期間';
        else if (match.includes('%')) label = '割合';
        else if (match.includes('GB') || match.includes('TB')) label = '容量';
        else if (match.includes('時間')) label = '時間';
        else if (match.includes('倍')) label = '倍率';
        
        return {
          value: match,
          label,
          color: colors[i % colors.length]
        };
      });
    }
  }
  
  // ビフォーアフターデータの検出（「A → B」パターン）
  let beforeAfter: ParsedArticle['beforeAfter'] | undefined;
  const beforeAfterPatterns: { label: string; before: string; after: string }[] = [];

  // 数字表記の正規化関数
  const normalizeNumber = (text: string): string => {
    return text
      // 「数十個」→「30+個」
      .replace(/数十個/g, '30+個')
      .replace(/数十/g, '30+')
      // 「数百」→「100+」
      .replace(/数百/g, '100+')
      // 「数千」→「1000+」
      .replace(/数千/g, '1000+')
      // 「3つ」→「3個」（単位統一）
      .replace(/(\d+)つ/g, '$1個')
      // 「3分の1」→「1/3」
      .replace(/(\d+)分の(\d+)/g, '$2/$1')
      // 「〜」→「-」（ハイフン統一）
      .replace(/〜/g, '-');
  };

  // ラベルと値の重複を除去する関数
  const cleanLabel = (label: string, before: string, after: string): string => {
    // 値に含まれる単位がラベルにも含まれている場合、ラベルから除去
    const units = ['時間', '日', '個', '件', '分'];
    let cleanedLabel = label;
    for (const unit of units) {
      if ((before.includes(unit) || after.includes(unit)) && label.endsWith(unit)) {
        cleanedLabel = label.slice(0, -unit.length);
      }
    }
    return cleanedLabel || label;
  };

  // パターン1: 「〇〇：A → B」形式
  const arrowPatterns = content.matchAll(/([^：:\n]+)[：:]([^\n→]+)\s*→\s*([^\n]+)/g);
  for (const match of arrowPatterns) {
    let label = match[1].replace(/\*\*/g, '').trim();
    const before = normalizeNumber(match[2].replace(/\*\*/g, '').trim());
    const after = normalizeNumber(match[3].replace(/\*\*/g, '').trim());
    label = cleanLabel(label, before, after);
    if (label.length < 30 && before.length < 20 && after.length < 20) {
      beforeAfterPatterns.push({ label, before, after });
    }
  }

  // パターン2: 「**A → B**」形式（太字で強調されているもの）
  const boldArrowPatterns = content.matchAll(/\*\*([^*]+)\s*→\s*([^*]+)\*\*/g);
  for (const match of boldArrowPatterns) {
    const before = normalizeNumber(match[1].trim());
    const after = normalizeNumber(match[2].trim());
    // ラベルを推測
    let label = '変化';
    if (before.includes('個') || after.includes('個')) label = '数量';
    else if (before.includes('日') || after.includes('時間') || before.includes('時間')) label = '所要時間';
    else if (before.includes('/')) label = '効率';
    if (before.length < 20 && after.length < 20) {
      beforeAfterPatterns.push({ label, before, after });
    }
  }

  if (beforeAfterPatterns.length >= 2) {
    beforeAfter = beforeAfterPatterns.slice(0, 4);
  }

  // おすすめテンプレートを決定
  const suggestedTemplates = {
    thumbnails: [] as string[],
    infographics: [] as string[]
  };
  
  // サムネイル提案
  if (isNews) {
    suggestedTemplates.thumbnails.push('news-flash', 'gradient-center', 'dark-mode');
  } else if (isComparison) {
    suggestedTemplates.thumbnails.push('comparison', 'dark-mode', 'gradient-center');
  } else if (isTutorial) {
    suggestedTemplates.thumbnails.push('tutorial', 'step-display', 'list-style');
  } else {
    suggestedTemplates.thumbnails.push('gradient-center', 'dark-mode', 'circle-accent');
  }
  
  if (hashtags.length > 0) {
    suggestedTemplates.thumbnails.push('tech-grid');
  }
  
  // インフォグラフィック提案
  // より厳密な条件でインフォグラフを提案
  if (comparisonData && comparisonData.rows.length >= 3) {
    // 比較表は3行以上の場合のみ
    suggestedTemplates.infographics.push('comparison-table');
  }
  if (proscons && (proscons.pros.length >= 3 && proscons.cons.length >= 3)) {
    // メリット・デメリットは両方3つ以上の場合のみ
    suggestedTemplates.infographics.push('pros-cons');
  }
  if (stats && stats.length >= 3) {
    // 統計データは3つ以上の場合のみ
    suggestedTemplates.infographics.push('stats');
    // バーチャートは統計データが4つ以上ある場合のみ
    if (stats.length >= 4) {
      suggestedTemplates.infographics.push('bar-chart');
    }
  }
  
  // インフォグラフが1つもない場合でも、比較記事なら比較表を提案
  if (suggestedTemplates.infographics.length === 0 && isComparison && comparisonData) {
    suggestedTemplates.infographics.push('comparison-table');
  }
  
  return {
    title,
    subtitle,
    hashtags,
    hasComparison: !!comparisonData,
    hasProscons: !!proscons,
    hasStats: !!stats,
    isNews,
    isTutorial,
    isComparison,
    comparisonData,
    proscons,
    stats,
    beforeAfter,
    suggestedTemplates,
  };
}
