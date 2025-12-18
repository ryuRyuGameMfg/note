'use client';

import React from 'react';
import { Check, X, TrendingUp, TrendingDown } from 'lucide-react';
import { parseMarkdownText } from '@/lib/parseMarkdownText';

// ==========================================
// カラーパレット定義（REGULATIONS.md準拠）
// ==========================================
const COLORS = {
  // 成功・メリット
  success: {
    dark: { bg: 'bg-green-900/20', border: 'border-green-500/30', text: 'text-green-400', icon: 'text-green-400' },
    light: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: 'text-green-600' }
  },
  // エラー・デメリット
  error: {
    dark: { bg: 'bg-red-900/20', border: 'border-red-500/30', text: 'text-red-400', icon: 'text-red-400' },
    light: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'text-red-600' }
  },
  // チェックマーク
  check: { success: 'text-green-500', error: 'text-red-500' },
  // 統計データデフォルトカラー
  stats: ['#3b82f6', '#22c55e', '#f97316', '#a855f7', '#22d3ee', '#2563eb']
} as const;

// ==========================================
// 統一余白・サイズ定義
// ==========================================
const LAYOUT = {
  width: 'w-[800px]',
  minHeight: 'min-h-[600px]',
  padding: 'p-12',
  gap: 'gap-6',
  titleSize: 'text-3xl',
  textSize: 'text-base',
  iconSize: 'w-6 h-6'
} as const;

// ==========================================
// インフォグラフィック: 比較表
// ==========================================
export const ComparisonTable: React.FC<{
  title: string;
  headers: string[];
  rows: { label: string; values: (string | boolean)[] }[];
  darkMode?: boolean;
}> = ({ title, headers, rows, darkMode = true }) => (
  <div className={`${LAYOUT.width} ${LAYOUT.minHeight} ${LAYOUT.padding} flex flex-col ${
    darkMode ? 'bg-gray-900' : 'bg-white'
  }`}>
    <h2 className={`${LAYOUT.titleSize} font-bold mb-6 ${
      darkMode ? 'text-white' : 'text-gray-800'
    }`}>{parseMarkdownText(title)}</h2>
    
    <div className={`border rounded-xl overflow-hidden flex-1 ${
      darkMode ? 'border-gray-700' : 'border-gray-200'
    }`}>
      {/* ヘッダー */}
      <div className={`grid ${
        darkMode ? 'bg-gray-800' : 'bg-gray-100'
      }`} style={{ gridTemplateColumns: `180px repeat(${headers.length}, 1fr)` }}>
        <div className={`p-4 font-bold border-b border-r ${
          darkMode ? 'text-gray-400 border-gray-700' : 'text-gray-600 border-gray-200'
        }`}></div>
        {headers.map((h, i) => (
          <div key={i} className={`p-4 font-bold text-center border-b text-lg ${
            darkMode ? 'text-white border-gray-700' : 'text-gray-800 border-gray-200'
          }`}>
            {parseMarkdownText(h)}
          </div>
        ))}
      </div>
      
      {/* データ行 */}
      {rows.map((row, i) => (
        <div
          key={i}
          className="grid"
          style={{ gridTemplateColumns: `180px repeat(${headers.length}, 1fr)` }}
        >
          <div className={`p-4 font-medium border-r ${i < rows.length - 1 ? 'border-b' : ''} ${LAYOUT.textSize} ${
            darkMode ? 'text-gray-300 border-gray-700' : 'text-gray-700 border-gray-200'
          }`}>
            {parseMarkdownText(row.label)}
          </div>
          {row.values.map((v, j) => (
            <div key={j} className={`p-4 flex items-center justify-center ${i < rows.length - 1 ? 'border-b' : ''} ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              {typeof v === 'boolean' ? (
                v ? (
                  <Check className={`${LAYOUT.iconSize} ${COLORS.check.success}`} strokeWidth={3} />
                ) : (
                  <X className={`${LAYOUT.iconSize} ${COLORS.check.error}`} strokeWidth={3} />
                )
              ) : (
                <span className={`${LAYOUT.textSize} ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>{parseMarkdownText(v)}</span>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

// ==========================================
// インフォグラフィック: メリット・デメリット
// ==========================================
export const ProsCons: React.FC<{
  title: string;
  pros: string[];
  cons: string[];
  darkMode?: boolean;
}> = ({ title, pros, cons, darkMode = true }) => (
  <div className={`${LAYOUT.width} ${LAYOUT.minHeight} ${LAYOUT.padding} flex flex-col ${
    darkMode ? 'bg-gray-900' : 'bg-gray-50'
  }`}>
    <h2 className={`${LAYOUT.titleSize} font-bold mb-8 text-center ${
      darkMode ? 'text-white' : 'text-gray-800'
    }`}>{parseMarkdownText(title)}</h2>
    
    <div className={`flex ${LAYOUT.gap} flex-1`}>
      {/* メリット */}
      <div className={`flex-1 rounded-xl p-6 border-2 flex flex-col ${
        darkMode 
          ? `${COLORS.success.dark.bg} ${COLORS.success.dark.border}` 
          : `${COLORS.success.light.bg} ${COLORS.success.light.border}`
      }`}>
        <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
          darkMode ? COLORS.success.dark.text : COLORS.success.light.text
        }`}>
          <TrendingUp className={LAYOUT.iconSize} />
          メリット
        </h3>
        <ul className="space-y-3 flex-1">
          {pros.map((pro, i) => (
            <li key={i} className={`flex items-start gap-2 ${LAYOUT.textSize} ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                darkMode ? COLORS.success.dark.icon : COLORS.success.light.icon
              }`} strokeWidth={2} />
              <span>{parseMarkdownText(pro)}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* デメリット */}
      <div className={`flex-1 rounded-xl p-6 border-2 flex flex-col ${
        darkMode 
          ? `${COLORS.error.dark.bg} ${COLORS.error.dark.border}` 
          : `${COLORS.error.light.bg} ${COLORS.error.light.border}`
      }`}>
        <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
          darkMode ? COLORS.error.dark.text : COLORS.error.light.text
        }`}>
          <TrendingDown className={LAYOUT.iconSize} />
          デメリット
        </h3>
        <ul className="space-y-3 flex-1">
          {cons.map((con, i) => (
            <li key={i} className={`flex items-start gap-2 ${LAYOUT.textSize} ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              <X className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                darkMode ? COLORS.error.dark.icon : COLORS.error.light.icon
              }`} strokeWidth={2} />
              <span>{parseMarkdownText(con)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

// ==========================================
// インフォグラフィック: 統計データ
// ==========================================
export const StatsInfographic: React.FC<{
  title: string;
  stats: { value: string; label: string; subtext?: string; color?: string }[];
  darkMode?: boolean;
}> = ({ title, stats, darkMode = true }) => (
  <div className={`${LAYOUT.width} ${LAYOUT.minHeight} ${LAYOUT.padding} flex flex-col ${
    darkMode ? 'bg-gray-900' : 'bg-white'
  }`}>
    <h2 className={`${LAYOUT.titleSize} font-bold mb-8 ${
      darkMode ? 'text-white' : 'text-gray-800'
    }`}>{parseMarkdownText(title)}</h2>
    
    <div className="grid grid-cols-3 gap-6 flex-1 content-start">
      {stats.map((stat, i) => {
        const color = stat.color || COLORS.stats[i % COLORS.stats.length];
        return (
          <div
            key={i}
            className={`rounded-xl p-6 text-center flex flex-col justify-center ${
              darkMode ? 'bg-gray-800' : 'bg-gray-50'
            }`}
            style={{ borderTop: `4px solid ${color}` }}
          >
            <div
              className="text-4xl font-black mb-3"
              style={{ color }}
            >
              {parseMarkdownText(stat.value)}
            </div>
            <div className={`text-lg font-semibold ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>{parseMarkdownText(stat.label)}</div>
            {stat.subtext && (
              <div className={`text-sm mt-2 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>{parseMarkdownText(stat.subtext)}</div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

// ==========================================
// インフォグラフィック: バーチャート
// ==========================================
export const BarChart: React.FC<{
  title: string;
  bars: { label: string; value: number; color?: string }[];
  maxValue?: number;
  darkMode?: boolean;
}> = ({ title, bars, maxValue, darkMode = true }) => {
  const max = maxValue || Math.max(...bars.map((b) => b.value));
  
  return (
    <div className={`${LAYOUT.width} ${LAYOUT.minHeight} ${LAYOUT.padding} flex flex-col ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <h2 className={`${LAYOUT.titleSize} font-bold mb-8 ${
        darkMode ? 'text-white' : 'text-gray-800'
      }`}>{parseMarkdownText(title)}</h2>
      
      <div className="space-y-5 flex-1 flex flex-col justify-center">
        {bars.map((bar, i) => {
          const color = bar.color || COLORS.stats[i % COLORS.stats.length];
          return (
            <div key={i} className="flex items-center gap-5">
              <div className={`w-32 text-right ${LAYOUT.textSize} font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {parseMarkdownText(bar.label)}
              </div>
              <div className={`flex-1 rounded-full h-8 overflow-hidden ${
                darkMode ? 'bg-gray-800' : 'bg-gray-200'
              }`}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(bar.value / max) * 100}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
              <div className={`w-16 ${LAYOUT.textSize} font-bold ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>{bar.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const infographicTemplates = [
  { id: 'comparison-table', name: '比較表', component: ComparisonTable },
  { id: 'pros-cons', name: 'メリット・デメリット', component: ProsCons },
  { id: 'stats', name: '統計データ', component: StatsInfographic },
  { id: 'bar-chart', name: '棒グラフ', component: BarChart },
];
