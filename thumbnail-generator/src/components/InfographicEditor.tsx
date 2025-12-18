'use client';

import React, { useState, useRef, useCallback } from 'react';
import { toPng, toJpeg } from 'html-to-image';
import { saveAs } from 'file-saver';
import { Download, Plus, Trash2 } from 'lucide-react';
import {
  ComparisonTable,
  FlowChart,
  StatsInfographic,
  Timeline,
  ProsCons,
  Ranking,
  PieChartStyle,
  BarChart,
  infographicTemplates,
} from './templates/InfographicTemplates';

const templateComponents: Record<string, React.FC<any>> = {
  'comparison-table': ComparisonTable,
  'flow-chart': FlowChart,
  'stats': StatsInfographic,
  'timeline': Timeline,
  'pros-cons': ProsCons,
  'ranking': Ranking,
  'pie-chart': PieChartStyle,
  'bar-chart': BarChart,
};

export const InfographicEditor: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('comparison-table');
  const [title, setTitle] = useState('機能比較表');
  
  // 比較表用
  const [headers, setHeaders] = useState(['Cursor', 'Claude Code', 'Copilot']);
  const [rows, setRows] = useState([
    { label: '月額料金', values: ['$20', '$100', '$10'] },
    { label: 'AI性能', values: ['◎', '◎', '○'] },
    { label: '日本語対応', values: [true, true, true] },
  ]);

  // フローチャート用
  const [flowSteps, setFlowSteps] = useState([
    { label: '準備', description: 'プロジェクト設定' },
    { label: '開発', description: 'コード実装' },
    { label: 'テスト', description: '動作確認' },
    { label: 'デプロイ', description: '公開' },
  ]);

  // 統計データ用
  const [stats, setStats] = useState([
    { value: '235件', label: '取引実績', color: '#6366f1' },
    { value: '70万円', label: '最高月収', color: '#22c55e' },
    { value: '4年', label: '経験年数', color: '#f59e0b' },
    { value: '98%', label: '満足度', color: '#ec4899' },
  ]);

  // タイムライン用
  const [events, setEvents] = useState([
    { date: '2021年', title: 'Unity開発開始', description: '初めてのゲーム制作' },
    { date: '2022年', title: 'ココナラ開始', description: '受託開発スタート' },
    { date: '2023年', title: '100件達成', description: 'プラチナランク' },
    { date: '2024年', title: '235件突破', description: '実績拡大中' },
  ]);

  // プロコン用
  const [pros, setPros] = useState(['高い開発効率', '豊富な機能', 'コミュニティが活発']);
  const [cons, setCons] = useState(['学習コストが高い', '月額料金が必要', '依存度が高くなる']);

  // ランキング用
  const [rankingItems, setRankingItems] = useState([
    { rank: 1, name: 'Cursor', score: '98点', description: 'AI統合開発環境' },
    { rank: 2, name: 'Claude Code', score: '95点', description: 'ターミナル型AI' },
    { rank: 3, name: 'GitHub Copilot', score: '90点', description: 'コード補完特化' },
    { rank: 4, name: 'Windsurf', score: '85点', description: '新興IDE' },
    { rank: 5, name: 'Cody', score: '80点', description: 'Sourcegraph製' },
  ]);

  // 円グラフ用
  const [segments, setSegments] = useState([
    { label: 'ゲーム開発', value: 40, color: '#6366f1' },
    { label: 'AIアプリ', value: 30, color: '#22c55e' },
    { label: 'Web開発', value: 20, color: '#f59e0b' },
    { label: 'その他', value: 10, color: '#ec4899' },
  ]);

  // 棒グラフ用
  const [bars, setBars] = useState([
    { label: '2021年', value: 20, color: '#6366f1' },
    { label: '2022年', value: 65, color: '#6366f1' },
    { label: '2023年', value: 120, color: '#6366f1' },
    { label: '2024年', value: 235, color: '#22c55e' },
  ]);

  const previewRef = useRef<HTMLDivElement>(null);

  const downloadPng = useCallback(async () => {
    if (!previewRef.current) return;
    try {
      const dataUrl = await toPng(previewRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      });
      saveAs(dataUrl, `infographic-${Date.now()}.png`);
    } catch (err) {
      console.error('PNG download failed:', err);
    }
  }, []);

  const downloadJpeg = useCallback(async () => {
    if (!previewRef.current) return;
    try {
      const dataUrl = await toJpeg(previewRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#ffffff',
      });
      saveAs(dataUrl, `infographic-${Date.now()}.jpg`);
    } catch (err) {
      console.error('JPEG download failed:', err);
    }
  }, []);

  const getTemplateProps = () => {
    switch (selectedTemplate) {
      case 'comparison-table':
        return { title, headers, rows };
      case 'flow-chart':
        return { title, steps: flowSteps };
      case 'stats':
        return { title, stats };
      case 'timeline':
        return { title, events };
      case 'pros-cons':
        return { title, pros, cons };
      case 'ranking':
        return { title, items: rankingItems };
      case 'pie-chart':
        return { title, segments };
      case 'bar-chart':
        return { title, bars };
      default:
        return { title };
    }
  };

  const SelectedComponent = templateComponents[selectedTemplate];

  const renderEditor = () => {
    switch (selectedTemplate) {
      case 'comparison-table':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">ヘッダー</label>
              {headers.map((h, i) => (
                <div key={i} className="flex gap-2 mb-1">
                  <input
                    type="text"
                    value={h}
                    onChange={(e) => {
                      const newHeaders = [...headers];
                      newHeaders[i] = e.target.value;
                      setHeaders(newHeaders);
                    }}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-2">
            {stats.map((stat, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => {
                    const newStats = [...stats];
                    newStats[i] = { ...newStats[i], value: e.target.value };
                    setStats(newStats);
                  }}
                  placeholder="値"
                  className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                />
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => {
                    const newStats = [...stats];
                    newStats[i] = { ...newStats[i], label: e.target.value };
                    setStats(newStats);
                  }}
                  placeholder="ラベル"
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                />
                <input
                  type="color"
                  value={stat.color}
                  onChange={(e) => {
                    const newStats = [...stats];
                    newStats[i] = { ...newStats[i], color: e.target.value };
                    setStats(newStats);
                  }}
                  className="w-8 h-8 rounded cursor-pointer"
                />
              </div>
            ))}
          </div>
        );

      case 'pros-cons':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">メリット</label>
              {pros.map((p, i) => (
                <div key={i} className="flex gap-1 mb-1">
                  <input
                    type="text"
                    value={p}
                    onChange={(e) => {
                      const newPros = [...pros];
                      newPros[i] = e.target.value;
                      setPros(newPros);
                    }}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                  <button
                    onClick={() => setPros(pros.filter((_, idx) => idx !== i))}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setPros([...pros, ''])}
                className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600"
              >
                <Plus size={14} /> 追加
              </button>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">デメリット</label>
              {cons.map((c, i) => (
                <div key={i} className="flex gap-1 mb-1">
                  <input
                    type="text"
                    value={c}
                    onChange={(e) => {
                      const newCons = [...cons];
                      newCons[i] = e.target.value;
                      setCons(newCons);
                    }}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                  <button
                    onClick={() => setCons(cons.filter((_, idx) => idx !== i))}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setCons([...cons, ''])}
                className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600"
              >
                <Plus size={14} /> 追加
              </button>
            </div>
          </div>
        );

      case 'bar-chart':
        return (
          <div className="space-y-2">
            {bars.map((bar, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={bar.label}
                  onChange={(e) => {
                    const newBars = [...bars];
                    newBars[i] = { ...newBars[i], label: e.target.value };
                    setBars(newBars);
                  }}
                  placeholder="ラベル"
                  className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                />
                <input
                  type="number"
                  value={bar.value}
                  onChange={(e) => {
                    const newBars = [...bars];
                    newBars[i] = { ...newBars[i], value: Number(e.target.value) };
                    setBars(newBars);
                  }}
                  placeholder="値"
                  className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                />
                <input
                  type="color"
                  value={bar.color || '#6366f1'}
                  onChange={(e) => {
                    const newBars = [...bars];
                    newBars[i] = { ...newBars[i], color: e.target.value };
                    setBars(newBars);
                  }}
                  className="w-8 h-8 rounded cursor-pointer"
                />
              </div>
            ))}
          </div>
        );

      default:
        return <p className="text-sm text-gray-500">このテンプレートの編集機能は準備中です</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          📊 インフォグラフィック生成（単体）
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左サイド */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-lg p-5 sticky top-4">
              <h2 className="text-lg font-bold text-gray-800 mb-3">テンプレート</h2>
              <div className="grid grid-cols-2 gap-2">
                {infographicTemplates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    className={`p-2 text-xs rounded-lg border-2 transition ${
                      selectedTemplate === t.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>

              <hr className="my-4" />

              <h2 className="text-lg font-bold text-gray-800 mb-3">編集</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    タイトル
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  />
                </div>
                {renderEditor()}
              </div>
            </div>
          </div>

          {/* 右サイド */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">プレビュー</h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">1280px幅</span>
                  <button
                    onClick={downloadPng}
                    className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                  >
                    <Download size={16} />
                    PNG
                  </button>
                  <button
                    onClick={downloadJpeg}
                    className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                  >
                    <Download size={16} />
                    JPEG
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden inline-block">
                <div className="infographic-preview-wrapper">
                  <div ref={previewRef}>
                    {SelectedComponent && <SelectedComponent {...getTemplateProps()} />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfographicEditor;
