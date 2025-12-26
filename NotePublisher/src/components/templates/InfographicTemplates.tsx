'use client';

import React from 'react';
import { Check, X, TrendingUp, TrendingDown, Zap, Clock, Code, Layers, ArrowRight, Sparkles, HelpCircle, Lightbulb, Flame, Handshake, Hand } from 'lucide-react';
import { parseMarkdownText } from '@/lib/parseMarkdownText';

/**
 * インフォグラフテンプレート設計指針
 *
 * 【サイズ】
 * - 幅: 1280px固定（サムネイルと同じ）
 * - 高さ: コンテンツにぴったりフィット（従来の1.5倍）
 *
 * 【デザイン原則】
 * - ベントーデザイン統一: 四角カード + グラデーション + 透けるアイコン + 情報
 * - ダイナミックなアイコン表示
 * - 余白は小さめ、情報を大きく
 * - スマホでも読めるフォントサイズ
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

// アイコンマッピング
const HEADING_ICONS: Record<string, React.FC<{ className?: string; strokeWidth?: number }>> = {
  question: HelpCircle,
  lightbulb: Lightbulb,
  fire: Flame,
  handshake: Handshake,
  wave: Hand,
  zap: Zap,
  sparkles: Sparkles,
  trending: TrendingUp,
  code: Code,
  layers: Layers,
};

// ==========================================
// Template 0: 見出しバナー（新規追加）
// ==========================================
export const HeadingBanner: React.FC<{
  title: string;
  subtitle?: string;
  icon?: string;
  darkMode?: boolean;
}> = ({ title, subtitle, icon = 'zap' }) => {
  const IconComponent = HEADING_ICONS[icon] || Zap;

  return (
    <div
      className={`w-[1280px] h-[320px] p-12 bg-gradient-to-br ${COLORS.primary} relative overflow-hidden flex items-center`}
    >
      <div className="absolute -bottom-16 -right-16 opacity-15">
        <Sparkles className="w-80 h-80 text-white" />
      </div>

      {/* アイコン */}
      <div className="flex-shrink-0 mr-10 relative z-10">
        <div className="w-32 h-32 rounded-3xl bg-white/20 flex items-center justify-center">
          <IconComponent className="w-20 h-20 text-white" strokeWidth={2} />
        </div>
      </div>

      {/* テキスト */}
      <div className="relative z-10 flex-1">
        <h2 className="text-5xl font-black text-white leading-tight mb-3">
          {parseMarkdownText(title)}
        </h2>
        {subtitle && (
          <p className="text-2xl font-bold text-white/80">
            {parseMarkdownText(subtitle)}
          </p>
        )}
      </div>
    </div>
  );
};

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
  const itemHeight = 72;
  const headerHeight = 100;
  const titleHeight = 100;
  const padding = 96;
  const cardPadding = 80;
  const calculatedHeight = titleHeight + headerHeight + (maxItems * itemHeight) + cardPadding + padding;

  return (
    <div
      className="w-[1280px] p-12 bg-white"
      style={{ height: `${calculatedHeight}px` }}
    >
      <h2 className="text-4xl font-black mb-8 text-gray-900">
        {parseMarkdownText(title)}
      </h2>

      <div className="grid grid-cols-2 gap-6">
        {/* メリット - ベントーカード */}
        <div className={`rounded-3xl p-10 bg-gradient-to-br ${COLORS.positive} relative overflow-hidden`}>
          <div className="absolute -bottom-12 -right-12 opacity-20">
            <TrendingUp className="w-56 h-56 text-white" />
          </div>
          <div className="flex items-center gap-4 mb-6 text-white relative z-10">
            <TrendingUp className="w-12 h-12" strokeWidth={2.5} />
            <span className="font-black text-3xl">メリット</span>
          </div>
          <ul className="space-y-4 relative z-10">
            {pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-4">
                <Check className="w-9 h-9 mt-0.5 flex-shrink-0 text-white" strokeWidth={3} />
                <span className="text-2xl font-bold leading-snug text-white">
                  {parseMarkdownText(pro)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* デメリット - ベントーカード */}
        <div className={`rounded-3xl p-10 bg-gradient-to-br ${COLORS.negative} relative overflow-hidden`}>
          <div className="absolute -bottom-12 -right-12 opacity-20">
            <TrendingDown className="w-56 h-56 text-white" />
          </div>
          <div className="flex items-center gap-4 mb-6 text-white relative z-10">
            <TrendingDown className="w-12 h-12" strokeWidth={2.5} />
            <span className="font-black text-3xl">デメリット</span>
          </div>
          <ul className="space-y-4 relative z-10">
            {cons.map((con, i) => (
              <li key={i} className="flex items-start gap-4">
                <X className="w-9 h-9 mt-0.5 flex-shrink-0 text-white" strokeWidth={3} />
                <span className="text-2xl font-bold leading-snug text-white">
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

  const cardHeight = 200;
  const titleHeight = 100;
  const padding = 96;
  const gap = 24;
  const calculatedHeight = titleHeight + (rows * cardHeight) + ((rows - 1) * gap) + padding;

  return (
    <div
      className="w-[1280px] p-12 bg-white"
      style={{ height: `${calculatedHeight}px` }}
    >
      <h2 className="text-4xl font-black mb-8 text-gray-900">
        {parseMarkdownText(title)}
      </h2>

      <div className="gap-6" style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {displayStats.map((stat, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div
              key={i}
              className={`rounded-3xl p-8 bg-gradient-to-br ${STAT_GRADIENTS[i % STAT_GRADIENTS.length]} relative overflow-hidden`}
            >
              <div className="absolute -bottom-8 -right-8 opacity-20">
                <Icon className="w-40 h-40 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-3 relative z-10">
                {parseMarkdownText(stat.label)}
              </div>
              <div className="text-6xl font-black text-white relative z-10">
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
  const rowHeight = 100;
  const headerHeight = 100;
  const titleHeight = 100;
  const padding = 140;
  const calculatedHeight = titleHeight + headerHeight + (displayRows.length * rowHeight) + padding;

  return (
    <div
      className="w-[1280px] p-12 bg-white"
      style={{ height: `${calculatedHeight}px` }}
    >
      <h2 className="text-4xl font-black mb-8 text-gray-900">
        {parseMarkdownText(title)}
      </h2>

      <div className="rounded-3xl overflow-hidden shadow-sm">
        {/* ヘッダー - ベントーカードスタイル */}
        <div
          className={`grid bg-gradient-to-r ${COLORS.primary} relative overflow-hidden`}
          style={{ gridTemplateColumns: `280px repeat(${headers.length}, 1fr)` }}
        >
          <div className="absolute -bottom-8 -right-8 opacity-15">
            <Layers className="w-48 h-48 text-white" />
          </div>
          <div className="p-6" />
          {headers.map((h, i) => (
            <div key={i} className="p-6 font-black text-center text-3xl text-white relative z-10">
              {parseMarkdownText(h)}
            </div>
          ))}
        </div>

        {/* データ行 */}
        {displayRows.map((row, i) => (
          <div
            key={i}
            className={`grid ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
            style={{ gridTemplateColumns: `280px repeat(${headers.length}, 1fr)` }}
          >
            <div className="p-6 font-bold text-2xl text-gray-800 border-r border-gray-100 flex items-center">
              {parseMarkdownText(row.label)}
            </div>
            {row.values.map((v, j) => (
              <div key={j} className="p-6 flex items-center justify-center">
                {typeof v === 'boolean' ? (
                  v ? (
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check className="w-10 h-10 text-emerald-600" strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                      <X className="w-10 h-10 text-gray-400" strokeWidth={3} />
                    </div>
                  )
                ) : (
                  <span className="text-2xl font-bold text-gray-700">
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

  const cardHeight = 180;
  const titleHeight = title ? 90 : 0;
  const padding = 96;
  const calculatedHeight = titleHeight + cardHeight + padding;

  return (
    <div
      className="w-[1280px] p-12 bg-white"
      style={{ height: `${calculatedHeight}px` }}
    >
      {title && (
        <h2 className="text-3xl font-black mb-6 text-gray-900">
          {parseMarkdownText(title)}
        </h2>
      )}

      <div className="grid grid-cols-4 gap-6">
        {displayStats.map((stat, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div
              key={i}
              className={`rounded-3xl p-8 bg-gradient-to-br ${STAT_GRADIENTS[i % STAT_GRADIENTS.length]} relative overflow-hidden`}
            >
              <div className="absolute -bottom-6 -right-6 opacity-20">
                <Icon className="w-32 h-32 text-white" />
              </div>
              <div className="text-xl font-bold text-white mb-3 relative z-10">
                {parseMarkdownText(stat.label)}
              </div>
              <div className="text-5xl font-black text-white relative z-10">
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
  const itemHeight = 120;
  const titleHeight = 100;
  const headerHeight = 70;
  const padding = 96;
  const gap = 16;
  const calculatedHeight = titleHeight + headerHeight + (displayItems.length * itemHeight) + ((displayItems.length - 1) * gap) + padding;

  return (
    <div
      className="w-[1280px] p-12 bg-white"
      style={{ height: `${calculatedHeight}px` }}
    >
      <h2 className="text-4xl font-black mb-6 text-gray-900 flex items-center gap-4">
        <Zap className="w-12 h-12 text-sky-500" />
        {parseMarkdownText(title)}
      </h2>

      {/* ヘッダーラベル */}
      <div className="grid grid-cols-[280px_1fr_72px_1fr] gap-5 mb-5 text-xl text-gray-500 font-bold">
        <div></div>
        <div className="text-center">BEFORE</div>
        <div></div>
        <div className="text-center">AFTER</div>
      </div>

      <div className="space-y-4">
        {displayItems.map((item, i) => (
          <div key={i} className="grid grid-cols-[280px_1fr_72px_1fr] gap-5 items-center">
            {/* ラベル */}
            <div className="text-2xl text-gray-800 font-bold">
              {parseMarkdownText(item.label)}
            </div>

            {/* Before - ベントーカード */}
            <div className={`rounded-2xl px-8 py-6 bg-gradient-to-br ${COLORS.negative} relative overflow-hidden`}>
              <div className="absolute -bottom-4 -right-4 opacity-20">
                <X className="w-20 h-20 text-white" />
              </div>
              <div className="text-center text-white font-black text-4xl relative z-10">
                {parseMarkdownText(item.before)}
              </div>
            </div>

            {/* 矢印 */}
            <div className={`rounded-xl py-5 bg-gradient-to-br ${COLORS.primary} flex items-center justify-center`}>
              <ArrowRight className="w-10 h-10 text-white" strokeWidth={3} />
            </div>

            {/* After - ベントーカード */}
            <div className={`rounded-2xl px-8 py-6 bg-gradient-to-br ${COLORS.positive} relative overflow-hidden`}>
              <div className="absolute -bottom-4 -right-4 opacity-20">
                <Check className="w-20 h-20 text-white" />
              </div>
              <div className="text-center text-white font-black text-4xl relative z-10">
                {parseMarkdownText(item.after)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// Template 6: CTAバナー
// ==========================================
export const CtaBanner: React.FC<{
  title: string;
  subtitle?: string;
  url?: string;
  darkMode?: boolean;
}> = ({ title, subtitle, url }) => {
  return (
    <div
      className={`w-[1280px] h-[240px] p-12 bg-gradient-to-r ${COLORS.accent} relative overflow-hidden flex items-center justify-between`}
    >
      <div className="absolute -bottom-12 -left-12 opacity-20">
        <Zap className="w-56 h-56 text-white" />
      </div>
      <div className="relative z-10">
        <h3 className="text-4xl font-black text-white mb-2">
          {parseMarkdownText(title)}
        </h3>
        {subtitle && (
          <p className="text-2xl font-bold text-white/80">
            {parseMarkdownText(subtitle)}
          </p>
        )}
      </div>
      <div className="relative z-10 flex items-center gap-6">
        {url && (
          <div className="text-white/70 text-lg">{url}</div>
        )}
        <div className="bg-white/20 rounded-full p-5">
          <ArrowRight className="w-10 h-10 text-white" strokeWidth={3} />
        </div>
      </div>
    </div>
  );
};

// テンプレート一覧
export const infographicTemplates = [
  { id: 'heading-banner', name: '見出し', component: HeadingBanner },
  { id: 'glass-proscons', name: 'メリデメ', component: GlassProsCons },
  { id: 'minimal-stats', name: '統計', component: MinimalStats },
  { id: 'floating-comparison', name: '比較表', component: FloatingComparison },
  { id: 'horizontal-bento', name: '横ベントー', component: HorizontalBentoStats },
  { id: 'before-after', name: 'ビフォアフ', component: BeforeAfterStats },
  { id: 'cta-banner', name: 'CTAバナー', component: CtaBanner },
];
