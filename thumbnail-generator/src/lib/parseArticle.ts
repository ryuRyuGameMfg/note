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
  suggestedTemplates: {
    thumbnails: string[];
    infographics: string[];
  };
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
  const prosIndex = lines.findIndex(l => 
    l.includes('メリット') || l.includes('強み') || l.includes('良い点') || l.includes('Manusの強み')
  );
  const consIndex = lines.findIndex(l => 
    l.includes('デメリット') || l.includes('注意点') || l.includes('弱み') || l.includes('制約')
  );
  
  if (prosIndex >= 0 || consIndex >= 0) {
    const pros: string[] = [];
    const cons: string[] = [];
    let prosTitle = 'メリット・デメリット';
    
    // メリット抽出
    if (prosIndex >= 0) {
      const prosLine = lines[prosIndex];
      if (prosLine.startsWith('## ') || prosLine.startsWith('### ')) {
        prosTitle = prosLine.replace(/^#+\s*/, '');
      }
      for (let i = prosIndex + 1; i < lines.length && i < prosIndex + 15; i++) {
        const line = lines[i].trim();
        if (line.startsWith('-') || line.startsWith('・') || line.startsWith('✓')) {
          const text = line.replace(/^[-・✓]\s*/, '').replace(/\*\*/g, '');
          if (text.length > 0 && text.length < 50) {
            pros.push(text);
          }
        }
        if (line.startsWith('## ') || line.startsWith('### ')) break;
      }
    }
    
    // デメリット抽出
    if (consIndex >= 0) {
      for (let i = consIndex + 1; i < lines.length && i < consIndex + 15; i++) {
        const line = lines[i].trim();
        if (line.startsWith('-') || line.startsWith('・') || line.startsWith('▼')) {
          const text = line.replace(/^[-・▼]\s*/, '').replace(/\*\*/g, '');
          if (text.length > 0 && text.length < 50) {
            cons.push(text);
          }
        }
        if (line.startsWith('## ') || line.startsWith('### ')) break;
      }
    }
    
    if (pros.length > 0 || cons.length > 0) {
      proscons = { 
        title: prosTitle,
        pros: pros.slice(0, 5), 
        cons: cons.slice(0, 5) 
      };
    }
  }
  
  // 統計データの検出（数字+単位のパターン）
  const statsPatterns = content.match(/(\d+[\d,]*)(件|万円?|年|%|個|回|時間|日|倍|本|円)/g);
  let stats: ParsedArticle['stats'] | undefined;
  if (statsPatterns && statsPatterns.length >= 2) {
    const colors = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899'];
    const uniqueStats = [...new Set(statsPatterns)];
    stats = uniqueStats.slice(0, 4).map((match, i) => {
      // ラベルを推測
      let label = '指標';
      if (match.includes('件')) label = '実績';
      else if (match.includes('万') || match.includes('円')) label = '収入';
      else if (match.includes('年')) label = '経験';
      else if (match.includes('%')) label = '達成率';
      
      return {
        value: match,
        label,
        color: colors[i % colors.length]
      };
    });
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
  if (comparisonData) {
    suggestedTemplates.infographics.push('comparison-table');
  }
  if (proscons && (proscons.pros.length > 0 || proscons.cons.length > 0)) {
    suggestedTemplates.infographics.push('pros-cons');
  }
  if (stats && stats.length >= 2) {
    suggestedTemplates.infographics.push('stats', 'bar-chart');
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
    suggestedTemplates,
  };
}
