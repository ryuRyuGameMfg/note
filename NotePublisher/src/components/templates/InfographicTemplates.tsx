'use client';

import React from 'react';
import { Check, X, TrendingUp, TrendingDown, Zap, Clock, Code, Layers, ArrowRight } from 'lucide-react';
import { parseMarkdownText } from '@/lib/parseMarkdownText';

/**
 * インフォグラフテンプレート設計指針
 *
 * 【サイズ】
 * - 幅: 1280px固定（サムネイルと同じ）
 * - 高さ: コンテンツにぴったりフィット
 *
 * 【デザイン原則】
 * - ベントーデザイン統一: 四角カード + グラデーション + 透けるアイコン + 情報
 * - ライトモード専用（白背景）
 *
 * 【カラーパレット（6色固定）】
 * 1. Primary (青系): from-sky-500 to-blue-600
 * 2. Secondary (ティール): from-teal-500 to-cyan-600
 * 3. Neutral (スレート): from-slate-500 to-slate-600
 * 4. Negative (コーラル): from-rose-400 to-rose-500
 * 5. Positive (ミント): from-emerald-400 to-teal-500
 * 6. Accent (アンバー): from-amber-400 to-orange-500
 */

// カラーパレット定義（6色固定）
const COLORS = {
  primary: 'from-sky-500 to-blue-600',
  secondary: 'from-teal-500 to-cyan-600',
  neutral: 'from-slate-500 to-slate-600',
  negative: 'from-rose-400 to-rose-500',
  positive: 'from-emerald-400 to-teal-500',
  accent: 'from-amber-400 to-orange-500',
};

// グラデーション配列（統計カード用）
const STAT_GRADIENTS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.accent,
  COLORS.neutral,
  COLORS.positive,
  COLORS.negative,
];

// ==========================================
// Template 1: ベントー型メリデメ
// ==========================================
export const GlassProsCons: React.FC<{
  title: string;
  pros: string[];
  cons: string[];
  darkMode?: boolean;
}> = ({ title, pros, cons }) => {
  const maxItems = Math.max(pros.length, cons.length);
  const itemHeight = 52;
  const headerHeight = 76;
  const titleHeight = 70;
  const padding = 76;
  const cardPadding = 64;
  const calculatedHeight = titleHeight + headerHeight + (maxItems * itemHeight) + cardPadding + padding;

  return (
    <div
      className="w-[1280px] p-10 bg-white"
      style={{ height: `${calculatedHeight}px` }}
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-900">
        {parseMarkdownText(title)}
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {/* メリット - ベントーカード */}
        <div className={`rounded-3xl p-8 bg-gradient-to-br ${COLORS.positive} relative overflow-hidden`}>
          <div className="absolute -bottom-10 -right-10 opacity-10">
            <TrendingUp className="w-44 h-44 text-white" />
          </div>
          <div className="flex items-center gap-3 mb-5 text-white relative z-10">
            <TrendingUp className="w-8 h-8" />
            <span className="font-bold text-xl">メリット</span>
          </div>
          <ul className="space-y-3 relative z-10">
            {pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className="w-6 h-6 mt-0.5 flex-shrink-0 text-white/80" strokeWidth={2.5} />
                <span className="text-lg leading-snug text-white/90">
                  {parseMarkdownText(pro)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* デメリット - ベントーカード */}
        <div className={`rounded-3xl p-8 bg-gradient-to-br ${COLORS.negative} relative overflow-hidden`}>
          <div className="absolute -bottom-10 -right-10 opacity-10">
            <TrendingDown className="w-44 h-44 text-white" />
          </div>
          <div className="flex items-center gap-3 mb-5 text-white relative z-10">
            <TrendingDown className="w-8 h-8" />
            <span className="font-bold text-xl">デメリット</span>
          </div>
          <ul className="space-y-3 relative z-10">
            {cons.map((con, i) => (
              <li key={i} className="flex items-start gap-3">
                <X className="w-6 h-6 mt-0.5 flex-shrink-0 text-white/80" strokeWidth={2.5} />
                <span className="text-lg leading-snug text-white/90">
                  {parseMarkdownText(con)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Template 2: ベントー型統計データ
// ==========================================
export const MinimalStats: React.FC<{
  title: string;
  stats: { value: string; label: string; color?: string }[];
  darkMode?: boolean;
}> = ({ title, stats }) => {
  const icons = [Zap, Clock, Code, Layers, TrendingUp, Check];
  const displayStats = stats.slice(0, 6);
  const cols = Math.min(displayStats.length, 3);
  const rows = Math.ceil(displayStats.length / 3);

  const cardHeight = 140;
  const titleHeight = 70;
  const padding = 76;
  const gap = 20;
  const calculatedHeight = titleHeight + (rows * cardHeight) + ((rows - 1) * gap) + padding;

  return (
    <div
      className="w-[1280px] p-10 bg-white"
      style={{ height: `${calculatedHeight}px` }}
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-900">
        {parseMarkdownText(title)}
      </h2>

      <div className="gap-5" style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {displayStats.map((stat, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div
              key={i}
              className={`rounded-3xl p-6 bg-gradient-to-br ${STAT_GRADIENTS[i % STAT_GRADIENTS.length]} relative overflow-hidden`}
            >
              <div className="absolute -bottom-5 -right-5 opacity-10">
                <Icon className="w-24 h-24 text-white" />
              </div>
              <div className="text-base text-white/70 mb-2 relative z-10">
                {parseMarkdownText(stat.label)}
              </div>
              <div className="text-4xl font-black text-white relative z-10">
                {parseMarkdownText(stat.value)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// Template 3: ベントー型比較表
// ==========================================
export const FloatingComparison: React.FC<{
  title: string;
  headers: string[];
  rows: { label: string; values: (string | boolean)[] }[];
  darkMode?: boolean;
}> = ({ title, headers, rows }) => {
  const displayRows = rows.slice(0, 8);
  const rowHeight = 70;
  const headerHeight = 70;
  const titleHeight = 70;
  const padding = 116;
  const calculatedHeight = titleHeight + headerHeight + (displayRows.length * rowHeight) + padding;

  return (
    <div
      className="w-[1280px] p-10 bg-white"
      style={{ height: `${calculatedHeight}px` }}
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-900">
        {parseMarkdownText(title)}
      </h2>

      <div className="rounded-3xl overflow-hidden shadow-sm">
        {/* ヘッダー - ベントーカードスタイル */}
        <div
          className={`grid bg-gradient-to-r ${COLORS.primary} relative overflow-hidden`}
          style={{ gridTemplateColumns: `220px repeat(${headers.length}, 1fr)` }}
        >
          <div className="absolute -bottom-6 -right-6 opacity-10">
            <Layers className="w-32 h-32 text-white" />
          </div>
          <div className="p-5" />
          {headers.map((h, i) => (
            <div key={i} className="p-5 font-bold text-center text-xl text-white relative z-10">
              {parseMarkdownText(h)}
            </div>
          ))}
        </div>

        {/* データ行 */}
        {displayRows.map((row, i) => (
          <div
            key={i}
            className={`grid ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
            style={{ gridTemplateColumns: `220px repeat(${headers.length}, 1fr)` }}
          >
            <div className="p-5 font-medium text-lg text-gray-700 border-r border-gray-100">
              {parseMarkdownText(row.label)}
            </div>
            {row.values.map((v, j) => (
              <div key={j} className="p-5 flex items-center justify-center">
                {typeof v === 'boolean' ? (
                  v ? (
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check className="w-6 h-6 text-emerald-600" strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <X className="w-6 h-6 text-gray-400" strokeWidth={3} />
                    </div>
                  )
                ) : (
                  <span className="text-lg text-gray-700">
                    {parseMarkdownText(v)}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// Template 4: 横長ベントー型統計カード
// ==========================================
export const HorizontalBentoStats: React.FC<{
  title?: string;
  stats: { value: string; label: string; color?: string }[];
  darkMode?: boolean;
}> = ({ title, stats }) => {
  const icons = [Layers, Code, Zap, TrendingUp];
  const displayStats = stats.slice(0, 4);

  const cardHeight = 128;
  const titleHeight = title ? 64 : 0;
  const padding = 76;
  const calculatedHeight = titleHeight + cardHeight + padding;

  return (
    <div
      className="w-[1280px] p-10 bg-white"
      style={{ height: `${calculatedHeight}px` }}
    >
      {title && (
        <h2 className="text-2xl font-bold mb-5 text-gray-900">
          {parseMarkdownText(title)}
        </h2>
      )}

      <div className="grid grid-cols-4 gap-5">
        {displayStats.map((stat, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div
              key={i}
              className={`rounded-2xl p-6 bg-gradient-to-br ${STAT_GRADIENTS[i % STAT_GRADIENTS.length]} relative overflow-hidden`}
            >
              <div className="absolute -bottom-3 -right-3 opacity-10">
                <Icon className="w-20 h-20 text-white" />
              </div>
              <div className="text-base text-white/70 mb-2 relative z-10">
                {parseMarkdownText(stat.label)}
              </div>
              <div className="text-3xl font-black text-white relative z-10">
                {parseMarkdownText(stat.value)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// Template 5: ビフォーアフター（改善版）
// ==========================================
export const BeforeAfterStats: React.FC<{
  title: string;
  items: { label: string; before: string; after: string }[];
  darkMode?: boolean;
}> = ({ title, items }) => {
  const displayItems = items.slice(0, 4);
  const itemHeight = 90;
  const titleHeight = 70;
  const headerHeight = 52;
  const padding = 76;
  const gap = 12;
  const calculatedHeight = titleHeight + headerHeight + (displayItems.length * itemHeight) + ((displayItems.length - 1) * gap) + padding;

  return (
    <div
      className="w-[1280px] p-10 bg-white"
      style={{ height: `${calculatedHeight}px` }}
    >
      <h2 className="text-3xl font-bold mb-5 text-gray-900 flex items-center gap-3">
        <Zap className="w-8 h-8 text-sky-500" />
        {parseMarkdownText(title)}
      </h2>

      {/* ヘッダーラベル */}
      <div className="grid grid-cols-[220px_1fr_52px_1fr] gap-4 mb-4 text-base text-gray-500 font-medium">
        <div></div>
        <div className="text-center">BEFORE</div>
        <div></div>
        <div className="text-center">AFTER</div>
      </div>

      <div className="space-y-3">
        {displayItems.map((item, i) => (
          <div key={i} className="grid grid-cols-[220px_1fr_52px_1fr] gap-4 items-center">
            {/* ラベル */}
            <div className="text-lg text-gray-700 font-medium">
              {parseMarkdownText(item.label)}
            </div>

            {/* Before - ベントーカード */}
            <div className={`rounded-2xl px-6 py-5 bg-gradient-to-br ${COLORS.negative} relative overflow-hidden`}>
              <div className="absolute -bottom-2 -right-2 opacity-10">
                <X className="w-12 h-12 text-white" />
              </div>
              <div className="text-center text-white font-bold text-2xl relative z-10">
                {parseMarkdownText(item.before)}
              </div>
            </div>

            {/* 矢印 */}
            <div className={`rounded-xl py-4 bg-gradient-to-br ${COLORS.primary} flex items-center justify-center`}>
              <ArrowRight className="w-6 h-6 text-white" />
            </div>

            {/* After - ベントーカード */}
            <div className={`rounded-2xl px-6 py-5 bg-gradient-to-br ${COLORS.positive} relative overflow-hidden`}>
              <div className="absolute -bottom-2 -right-2 opacity-10">
                <Check className="w-12 h-12 text-white" />
              </div>
              <div className="text-center text-white font-bold text-2xl relative z-10">
                {parseMarkdownText(item.after)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// テンプレート一覧
export const infographicTemplates = [
  { id: 'glass-proscons', name: 'メリデメ', component: GlassProsCons },
  { id: 'minimal-stats', name: '統計', component: MinimalStats },
  { id: 'floating-comparison', name: '比較表', component: FloatingComparison },
  { id: 'horizontal-bento', name: '横ベントー', component: HorizontalBentoStats },
  { id: 'before-after', name: 'ビフォアフ', component: BeforeAfterStats },
];
