'use client';

import React from 'react';

interface TemplateProps {
  title: string;
  subtitle?: string;
  category?: string;
  accentColor?: string;
}

// Template 1: グラデーション + 中央タイトル
export const GradientCenter: React.FC<TemplateProps> = ({ title, subtitle }) => (
  <div className="thumbnail-container gradient-blue-purple flex flex-col items-center justify-center p-16 pattern-dots">
    <h1 className="text-6xl font-bold text-white text-center leading-tight drop-shadow-lg">
      {title}
    </h1>
    {subtitle && (
      <p className="text-2xl text-white/80 mt-6 text-center">{subtitle}</p>
    )}
  </div>
);

// Template 2: 左右分割
export const SplitLayout: React.FC<TemplateProps> = ({ title, subtitle, accentColor = '#2563eb' }) => {
  return (
    <div className="thumbnail-container flex">
      <div className="w-1/3 flex items-center justify-center" style={{ backgroundColor: accentColor }}>
        {/* SVGアイコン（Smartphone） */}
        <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
          <path d="M12 18h.01" />
        </svg>
      </div>
      <div className="w-2/3 bg-white flex flex-col justify-center px-16">
        <h1 className="text-5xl font-bold text-gray-800 leading-tight">{title}</h1>
        {subtitle && <p className="text-2xl text-gray-500 mt-4">{subtitle}</p>}
      </div>
    </div>
  );
};

// Template 3: カード型
export const CardStyle: React.FC<TemplateProps> = ({ title, subtitle }) => (
  <div className="thumbnail-container gradient-sunset flex items-center justify-center p-12">
    <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-4xl">
      <h1 className="text-5xl font-bold text-gray-800 text-center leading-tight">{title}</h1>
      {subtitle && <p className="text-2xl text-gray-500 mt-6 text-center">{subtitle}</p>}
    </div>
  </div>
);

// Template 4: ダークモード風
export const DarkMode: React.FC<TemplateProps> = ({ title, subtitle }) => {
  // タイトルを【】で改行処理
  const formattedTitle = title.replace(/】/g, '】\n');
  
  return (
    <div className="thumbnail-container gradient-dark flex flex-col items-center justify-center p-16 pattern-grid">
      <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-center leading-tight whitespace-pre-line">
        {formattedTitle}
      </h1>
      {subtitle && <p className="text-2xl text-gray-400 mt-6 text-center">{subtitle}</p>}
    </div>
  );
};

// Template 5: アイコン + タイトル
export const IconTitle: React.FC<TemplateProps> = ({ title, subtitle, category }) => {
  return (
    <div className="thumbnail-container bg-white flex items-center p-16">
      <div className="w-1/4 flex items-center justify-center">
        <div className="w-48 h-48 rounded-full gradient-green-teal flex items-center justify-center">
          {/* SVGアイコン（Rocket） */}
          <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
          </svg>
        </div>
      </div>
      <div className="w-3/4 pl-12">
        {category && <p className="text-xl text-blue-500 font-semibold mb-2">{category}</p>}
        <h1 className="text-5xl font-bold text-gray-800 leading-tight">{title}</h1>
        {subtitle && <p className="text-2xl text-gray-500 mt-4">{subtitle}</p>}
      </div>
    </div>
  );
};

// Template 6: 数字強調
export const NumberHighlight: React.FC<TemplateProps & { number: string }> = ({ title, number }) => (
  <div className="thumbnail-container gradient-fire flex items-center justify-center p-16">
    <div className="text-center">
      <div className="text-[180px] font-black text-white leading-none drop-shadow-lg">{number}</div>
      <h1 className="text-4xl font-bold text-white mt-4">{title}</h1>
    </div>
  </div>
);

// Template 7: ミニマル
export const Minimal: React.FC<TemplateProps> = ({ title, category }) => (
  <div className="thumbnail-container bg-gray-50 flex flex-col items-center justify-center p-16">
    {category && (
      <span className="px-6 py-2 bg-black text-white text-lg font-semibold rounded-full mb-8">
        {category}
      </span>
    )}
    <h1 className="text-6xl font-bold text-gray-900 text-center leading-tight max-w-5xl">
      {title}
    </h1>
  </div>
);

// Template 8: 斜めストライプ
export const DiagonalStripe: React.FC<TemplateProps> = ({ title, subtitle }) => (
  <div className="thumbnail-container relative overflow-hidden">
    <div className="absolute inset-0 gradient-purple-pink" />
    <div className="absolute inset-0 pattern-diagonal" />
    <div className="relative z-10 h-full flex flex-col items-center justify-center p-16">
      <h1 className="text-6xl font-bold text-white text-center leading-tight drop-shadow-lg">
        {title}
      </h1>
      {subtitle && <p className="text-2xl text-white/80 mt-6 text-center">{subtitle}</p>}
    </div>
  </div>
);

// Template 9: 比較型
export const ComparisonStyle: React.FC<{ leftTitle: string; rightTitle: string; vsText?: string }> = ({
  leftTitle,
  rightTitle,
  vsText = 'VS'
}) => (
  <div className="thumbnail-container flex">
    <div className="w-5/12 gradient-blue-purple flex items-center justify-center p-8">
      <h2 className="text-4xl font-bold text-white text-center">{leftTitle}</h2>
    </div>
    <div className="w-2/12 bg-gray-900 flex items-center justify-center">
      <span className="text-5xl font-black text-white">{vsText}</span>
    </div>
    <div className="w-5/12 gradient-orange-red flex items-center justify-center p-8">
      <h2 className="text-4xl font-bold text-white text-center">{rightTitle}</h2>
    </div>
  </div>
);

// Template 10: ニュース速報
export const NewsFlash: React.FC<TemplateProps> = ({ title, category = '速報' }) => (
  <div className="thumbnail-container bg-red-600 flex flex-col p-16">
    <div className="flex items-center mb-8">
      <span className="px-6 py-3 bg-yellow-400 text-red-600 text-2xl font-black rounded">
        {category}
      </span>
    </div>
    <h1 className="text-6xl font-bold text-white leading-tight flex-1 flex items-center">
      {title}
    </h1>
  </div>
);

// Template 11: チュートリアル風
export const Tutorial: React.FC<TemplateProps & { steps?: string[] }> = ({ title, steps }) => (
  <div className="thumbnail-container bg-indigo-600 p-16">
    <h1 className="text-5xl font-bold text-white mb-12">{title}</h1>
    {steps && (
      <div className="flex gap-6">
        {steps.slice(0, 3).map((step, i) => (
          <div key={i} className="flex items-center gap-4 bg-white/20 rounded-2xl px-8 py-4">
            <span className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">
              {i + 1}
            </span>
            <span className="text-xl text-white font-medium">{step}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

// Template 12: 引用風
export const Quote: React.FC<{ quote: string; author?: string }> = ({ quote, author }) => (
  <div className="thumbnail-container gradient-ocean flex items-center justify-center p-20">
    <div className="text-center">
      <span className="text-9xl text-gray-400/50">"</span>
      <p className="text-4xl font-medium text-gray-800 -mt-12 leading-relaxed max-w-4xl">
        {quote}
      </p>
      {author && <p className="text-2xl text-gray-600 mt-8">— {author}</p>}
    </div>
  </div>
);

// Template 13: テック系グリッド
export const TechGrid: React.FC<TemplateProps & { tags?: string[] }> = ({ title, tags }) => (
  <div className="thumbnail-container gradient-night p-16 pattern-grid">
    <h1 className="text-5xl font-bold text-white mb-12">{title}</h1>
    {tags && (
      <div className="flex flex-wrap gap-4">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="px-6 py-3 bg-white/10 border border-white/30 rounded-lg text-xl text-white"
          >
            {tag}
          </span>
        ))}
      </div>
    )}
  </div>
);

// Template 14: 円形アクセント
export const CircleAccent: React.FC<TemplateProps> = ({ title, subtitle }) => (
  <div className="thumbnail-container bg-gray-900 relative overflow-hidden">
    <div className="absolute -right-32 -top-32 w-[500px] h-[500px] rounded-full gradient-purple-pink opacity-50" />
    <div className="absolute -left-20 -bottom-20 w-[300px] h-[300px] rounded-full gradient-green-teal opacity-30" />
    <div className="relative z-10 h-full flex flex-col justify-center p-16">
      <h1 className="text-6xl font-bold text-white leading-tight">{title}</h1>
      {subtitle && <p className="text-2xl text-gray-400 mt-6">{subtitle}</p>}
    </div>
  </div>
);

// Template 15: ステップ表示
export const StepDisplay: React.FC<{ title: string; stepNumber: number; totalSteps: number }> = ({
  title,
  stepNumber,
  totalSteps
}) => (
  <div className="thumbnail-container gradient-mint flex items-center p-16">
    <div className="w-1/4">
      <div className="text-8xl font-black text-gray-800">
        {stepNumber}<span className="text-4xl text-gray-500">/{totalSteps}</span>
      </div>
    </div>
    <div className="w-3/4 pl-12 border-l-4 border-gray-800">
      <h1 className="text-5xl font-bold text-gray-800 leading-tight">{title}</h1>
    </div>
  </div>
);

// Template 16: バナー風
export const Banner: React.FC<TemplateProps & { badge?: string }> = ({ title, subtitle, badge }) => (
  <div className="thumbnail-container bg-gradient-to-r from-blue-600 to-blue-800 p-16 relative">
    {badge && (
      <div className="absolute top-8 right-8 px-6 py-2 bg-yellow-400 text-blue-900 font-bold text-xl rounded-full">
        {badge}
      </div>
    )}
    <div className="h-full flex flex-col justify-center">
      <h1 className="text-6xl font-bold text-white leading-tight">{title}</h1>
      {subtitle && <p className="text-2xl text-blue-200 mt-6">{subtitle}</p>}
    </div>
  </div>
);

// Template 17: リスト型
export const ListStyle: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <div className="thumbnail-container bg-white p-16">
    <h1 className="text-4xl font-bold text-gray-800 mb-8">{title}</h1>
    <div className="grid grid-cols-2 gap-4">
      {items.slice(0, 6).map((item, i) => (
        <div key={i} className="flex items-center gap-4">
          <span className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
            {i + 1}
          </span>
          <span className="text-2xl text-gray-700">{item}</span>
        </div>
      ))}
    </div>
  </div>
);

// Template 18: グラデーションボーダー
export const GradientBorder: React.FC<TemplateProps> = ({ title, subtitle }) => (
  <div className="thumbnail-container gradient-purple-pink p-4">
    <div className="w-full h-full bg-white rounded-2xl flex flex-col items-center justify-center p-12">
      <h1 className="text-5xl font-bold text-gray-800 text-center leading-tight">{title}</h1>
      {subtitle && <p className="text-2xl text-gray-500 mt-6 text-center">{subtitle}</p>}
    </div>
  </div>
);

// Template 19: 統計データ風
export const StatsStyle: React.FC<{ title: string; stats: { value: string; label: string }[] }> = ({
  title,
  stats
}) => (
  <div className="thumbnail-container gradient-dark p-16">
    <h1 className="text-4xl font-bold text-white mb-12">{title}</h1>
    <div className="flex justify-between">
      {stats.slice(0, 4).map((stat, i) => (
        <div key={i} className="text-center">
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            {stat.value}
          </div>
          <div className="text-xl text-gray-400 mt-2">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>
);

// Template 20: シンプルボックス
export const SimpleBox: React.FC<TemplateProps> = ({ title, category }) => (
  <div className="thumbnail-container bg-black flex items-center justify-center p-16">
    <div className="border-4 border-white p-12 max-w-4xl">
      {category && <p className="text-xl text-gray-400 mb-4">{category}</p>}
      <h1 className="text-5xl font-bold text-white text-center leading-tight">{title}</h1>
    </div>
  </div>
);

export const templates = [
  { id: 'gradient-center', name: 'グラデーション中央', component: GradientCenter, category: 'tech' },
  { id: 'split-layout', name: '左右分割', component: SplitLayout, category: 'tech' },
  { id: 'card-style', name: 'カード型', component: CardStyle, category: 'business' },
  { id: 'dark-mode', name: 'ダークモード', component: DarkMode, category: 'tech' },
  { id: 'icon-title', name: 'アイコン+タイトル', component: IconTitle, category: 'tutorial' },
  { id: 'number-highlight', name: '数字強調', component: NumberHighlight, category: 'business' },
  { id: 'minimal', name: 'ミニマル', component: Minimal, category: 'business' },
  { id: 'diagonal-stripe', name: '斜めストライプ', component: DiagonalStripe, category: 'tech' },
  { id: 'comparison', name: '比較型', component: ComparisonStyle, category: 'comparison' },
  { id: 'news-flash', name: 'ニュース速報', component: NewsFlash, category: 'news' },
  { id: 'tutorial', name: 'チュートリアル', component: Tutorial, category: 'tutorial' },
  { id: 'quote', name: '引用風', component: Quote, category: 'business' },
  { id: 'tech-grid', name: 'テックグリッド', component: TechGrid, category: 'tech' },
  { id: 'circle-accent', name: '円形アクセント', component: CircleAccent, category: 'tech' },
  { id: 'step-display', name: 'ステップ表示', component: StepDisplay, category: 'tutorial' },
  { id: 'banner', name: 'バナー風', component: Banner, category: 'business' },
  { id: 'list-style', name: 'リスト型', component: ListStyle, category: 'tutorial' },
  { id: 'gradient-border', name: 'グラデーションボーダー', component: GradientBorder, category: 'business' },
  { id: 'stats-style', name: '統計データ風', component: StatsStyle, category: 'infographic' },
  { id: 'simple-box', name: 'シンプルボックス', component: SimpleBox, category: 'business' },
];
