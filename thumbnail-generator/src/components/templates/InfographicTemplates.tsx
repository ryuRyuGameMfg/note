'use client';

import React from 'react';

// インフォグラフィック: 比較表
export const ComparisonTable: React.FC<{
  title: string;
  headers: string[];
  rows: { label: string; values: (string | boolean)[] }[];
}> = ({ title, headers, rows }) => (
  <div className="w-[1280px] min-h-[670px] bg-white p-16">
    <h2 className="text-4xl font-bold text-gray-800 mb-8">{title}</h2>
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <div className="grid bg-gray-100" style={{ gridTemplateColumns: `200px repeat(${headers.length}, 1fr)` }}>
        <div className="p-4 font-bold text-gray-600 border-b border-r border-gray-200"></div>
        {headers.map((h, i) => (
          <div key={i} className="p-4 font-bold text-gray-800 text-center border-b border-gray-200 text-xl">
            {h}
          </div>
        ))}
      </div>
      {rows.map((row, i) => (
        <div
          key={i}
          className="grid"
          style={{ gridTemplateColumns: `200px repeat(${headers.length}, 1fr)` }}
        >
          <div className="p-4 font-medium text-gray-700 border-r border-b border-gray-200 text-lg">
            {row.label}
          </div>
          {row.values.map((v, j) => (
            <div key={j} className="p-4 text-center border-b border-gray-200 text-lg">
              {typeof v === 'boolean' ? (
                v ? (
                  <span className="text-green-500 text-2xl">✅</span>
                ) : (
                  <span className="text-red-500 text-2xl">❌</span>
                )
              ) : (
                v
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

// インフォグラフィック: フローチャート
export const FlowChart: React.FC<{
  title: string;
  steps: { label: string; description?: string }[];
}> = ({ title, steps }) => (
  <div className="w-[1280px] min-h-[670px] gradient-blue-purple p-16">
    <h2 className="text-4xl font-bold text-white mb-12">{title}</h2>
    <div className="flex items-center justify-between">
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-lg">
              <span className="text-4xl font-bold text-blue-600">{i + 1}</span>
            </div>
            <p className="text-xl font-bold text-white mt-4 text-center">{step.label}</p>
            {step.description && (
              <p className="text-sm text-white/70 mt-2 text-center max-w-32">{step.description}</p>
            )}
          </div>
          {i < steps.length - 1 && (
            <div className="flex-1 h-1 bg-white/30 mx-4 relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-12 border-t-transparent border-b-transparent border-l-white/50" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
);

// インフォグラフィック: 統計データ
export const StatsInfographic: React.FC<{
  title: string;
  stats: { value: string; label: string; subtext?: string; color?: string }[];
}> = ({ title, stats }) => (
  <div className="w-[1280px] min-h-[670px] bg-gray-900 p-16">
    <h2 className="text-4xl font-bold text-white mb-12">{title}</h2>
    <div className="grid grid-cols-4 gap-8">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-gray-800 rounded-2xl p-8 text-center"
          style={{ borderTop: `4px solid ${stat.color || '#6366f1'}` }}
        >
          <div
            className="text-5xl font-black"
            style={{ color: stat.color || '#6366f1' }}
          >
            {stat.value}
          </div>
          <div className="text-xl text-white mt-4">{stat.label}</div>
          {stat.subtext && <div className="text-sm text-gray-400 mt-2">{stat.subtext}</div>}
        </div>
      ))}
    </div>
  </div>
);

// インフォグラフィック: タイムライン
export const Timeline: React.FC<{
  title: string;
  events: { date: string; title: string; description?: string }[];
}> = ({ title, events }) => (
  <div className="w-[1280px] min-h-[670px] bg-white p-16">
    <h2 className="text-4xl font-bold text-gray-800 mb-12">{title}</h2>
    <div className="relative">
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-blue-200 -translate-x-1/2" />
      <div className="space-y-8">
        {events.map((event, i) => (
          <div key={i} className={`flex items-center ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}>
            <div className={`w-5/12 ${i % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
              <div className="text-blue-500 font-bold text-lg">{event.date}</div>
              <div className="text-2xl font-bold text-gray-800">{event.title}</div>
              {event.description && (
                <div className="text-gray-600 mt-2">{event.description}</div>
              )}
            </div>
            <div className="w-2/12 flex justify-center">
              <div className="w-6 h-6 rounded-full bg-blue-500 border-4 border-white shadow-lg" />
            </div>
            <div className="w-5/12" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// インフォグラフィック: プロコン比較
export const ProsCons: React.FC<{
  title: string;
  pros: string[];
  cons: string[];
}> = ({ title, pros, cons }) => (
  <div className="w-[1280px] min-h-[670px] bg-gray-50 p-16">
    <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">{title}</h2>
    <div className="flex gap-8">
      <div className="flex-1 bg-green-50 rounded-2xl p-8 border-2 border-green-200">
        <h3 className="text-2xl font-bold text-green-600 mb-6 flex items-center gap-2">
          <span className="text-3xl">✅</span> メリット
        </h3>
        <ul className="space-y-4">
          {pros.map((pro, i) => (
            <li key={i} className="flex items-start gap-3 text-lg text-gray-700">
              <span className="text-green-500 mt-1">•</span>
              {pro}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 bg-red-50 rounded-2xl p-8 border-2 border-red-200">
        <h3 className="text-2xl font-bold text-red-600 mb-6 flex items-center gap-2">
          <span className="text-3xl">❌</span> デメリット
        </h3>
        <ul className="space-y-4">
          {cons.map((con, i) => (
            <li key={i} className="flex items-start gap-3 text-lg text-gray-700">
              <span className="text-red-500 mt-1">•</span>
              {con}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

// インフォグラフィック: ランキング
export const Ranking: React.FC<{
  title: string;
  items: { rank: number; name: string; score?: string; description?: string }[];
}> = ({ title, items }) => (
  <div className="w-[1280px] min-h-[670px] gradient-dark p-16">
    <h2 className="text-4xl font-bold text-white mb-12">{title}</h2>
    <div className="space-y-4">
      {items.slice(0, 5).map((item) => (
        <div
          key={item.rank}
          className="flex items-center gap-6 bg-white/10 rounded-xl p-6"
        >
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black ${
              item.rank === 1
                ? 'bg-yellow-400 text-yellow-900'
                : item.rank === 2
                ? 'bg-gray-300 text-gray-700'
                : item.rank === 3
                ? 'bg-orange-400 text-orange-900'
                : 'bg-gray-600 text-white'
            }`}
          >
            {item.rank}
          </div>
          <div className="flex-1">
            <div className="text-2xl font-bold text-white">{item.name}</div>
            {item.description && (
              <div className="text-gray-400 mt-1">{item.description}</div>
            )}
          </div>
          {item.score && (
            <div className="text-3xl font-bold text-cyan-400">{item.score}</div>
          )}
        </div>
      ))}
    </div>
  </div>
);

// インフォグラフィック: 円グラフ風
export const PieChartStyle: React.FC<{
  title: string;
  segments: { label: string; value: number; color: string }[];
}> = ({ title, segments }) => {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  
  return (
    <div className="w-[1280px] min-h-[670px] bg-white p-16 flex">
      <div className="w-1/2 flex items-center justify-center">
        <div className="relative w-80 h-80">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {segments.reduce(
              (acc, segment, i) => {
                const percentage = (segment.value / total) * 100;
                const strokeDasharray = `${percentage} ${100 - percentage}`;
                const strokeDashoffset = -acc.offset;
                acc.elements.push(
                  <circle
                    key={i}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={segment.color}
                    strokeWidth="20"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                  />
                );
                acc.offset += percentage;
                return acc;
              },
              { elements: [] as React.ReactNode[], offset: 0 }
            ).elements}
          </svg>
        </div>
      </div>
      <div className="w-1/2 flex flex-col justify-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">{title}</h2>
        <div className="space-y-4">
          {segments.map((segment, i) => (
            <div key={i} className="flex items-center gap-4">
              <div
                className="w-6 h-6 rounded"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-xl text-gray-700 flex-1">{segment.label}</span>
              <span className="text-xl font-bold text-gray-800">
                {Math.round((segment.value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// インフォグラフィック: バーチャート
export const BarChart: React.FC<{
  title: string;
  bars: { label: string; value: number; color?: string }[];
  maxValue?: number;
}> = ({ title, bars, maxValue }) => {
  const max = maxValue || Math.max(...bars.map((b) => b.value));
  
  return (
    <div className="w-[1280px] min-h-[670px] bg-gray-50 p-16">
      <h2 className="text-4xl font-bold text-gray-800 mb-12">{title}</h2>
      <div className="space-y-6">
        {bars.map((bar, i) => (
          <div key={i} className="flex items-center gap-6">
            <div className="w-40 text-right text-lg text-gray-700 font-medium">
              {bar.label}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(bar.value / max) * 100}%`,
                  backgroundColor: bar.color || '#6366f1',
                }}
              />
            </div>
            <div className="w-20 text-lg font-bold text-gray-800">{bar.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const infographicTemplates = [
  { id: 'comparison-table', name: '比較表', component: ComparisonTable },
  { id: 'flow-chart', name: 'フローチャート', component: FlowChart },
  { id: 'stats', name: '統計データ', component: StatsInfographic },
  { id: 'timeline', name: 'タイムライン', component: Timeline },
  { id: 'pros-cons', name: 'メリット・デメリット', component: ProsCons },
  { id: 'ranking', name: 'ランキング', component: Ranking },
  { id: 'pie-chart', name: '円グラフ風', component: PieChartStyle },
  { id: 'bar-chart', name: '棒グラフ', component: BarChart },
];
