'use client';

import React, { useState, useRef, useCallback } from 'react';
import { toPng, toJpeg } from 'html-to-image';
import { saveAs } from 'file-saver';
import { Download } from 'lucide-react';
import {
  GradientCenter,
  SplitLayout,
  CardStyle,
  DarkMode,
  IconTitle,
  NumberHighlight,
  Minimal,
  DiagonalStripe,
  ComparisonStyle,
  NewsFlash,
  Tutorial,
  Quote,
  TechGrid,
  CircleAccent,
  StepDisplay,
  Banner,
  ListStyle,
  GradientBorder,
  StatsStyle,
  SimpleBox,
  templates,
} from './templates/ThumbnailTemplates';

const templateComponents: Record<string, React.FC<any>> = {
  'gradient-center': GradientCenter,
  'split-layout': SplitLayout,
  'card-style': CardStyle,
  'dark-mode': DarkMode,
  'icon-title': IconTitle,
  'number-highlight': NumberHighlight,
  'minimal': Minimal,
  'diagonal-stripe': DiagonalStripe,
  'comparison': ComparisonStyle,
  'news-flash': NewsFlash,
  'tutorial': Tutorial,
  'quote': Quote,
  'tech-grid': TechGrid,
  'circle-accent': CircleAccent,
  'step-display': StepDisplay,
  'banner': Banner,
  'list-style': ListStyle,
  'gradient-border': GradientBorder,
  'stats-style': StatsStyle,
  'simple-box': SimpleBox,
};

interface ThumbnailEditorProps {
  initialTitle?: string;
  initialSubtitle?: string;
}

export const ThumbnailEditor: React.FC<ThumbnailEditorProps> = ({
  initialTitle = 'タイトルを入力',
  initialSubtitle = 'サブタイトル',
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState('gradient-center');
  const [title, setTitle] = useState(initialTitle);
  const [subtitle, setSubtitle] = useState(initialSubtitle);
  const [category, setCategory] = useState('Tech');
  const [number, setNumber] = useState('235');
  const [leftTitle, setLeftTitle] = useState('Cursor Ultra');
  const [rightTitle, setRightTitle] = useState('Claude Code');
  const [quote, setQuote] = useState('AIでアプリを作ってストアに公開したい');
  const [tags, setTags] = useState(['AI', 'Unity', 'ゲーム開発']);
  const [steps, setSteps] = useState(['準備', '実行', '完了']);
  const [listItems, setListItems] = useState(['項目1', '項目2', '項目3', '項目4', '項目5', '項目6']);
  const [stats, setStats] = useState([
    { value: '235件', label: '取引実績' },
    { value: '70万', label: '最高月収' },
    { value: '4年', label: '経験年数' },
    { value: '98%', label: '満足度' },
  ]);
  const [stepNumber, setStepNumber] = useState(1);
  const [totalSteps, setTotalSteps] = useState(5);
  const [badge, setBadge] = useState('NEW');

  const previewRef = useRef<HTMLDivElement>(null);

  const downloadPng = useCallback(async () => {
    if (!previewRef.current) return;
    try {
      const dataUrl = await toPng(previewRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      });
      saveAs(dataUrl, `thumbnail-${Date.now()}.png`);
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
      saveAs(dataUrl, `thumbnail-${Date.now()}.jpg`);
    } catch (err) {
      console.error('JPEG download failed:', err);
    }
  }, []);

  const getTemplateProps = () => {
    switch (selectedTemplate) {
      case 'number-highlight':
        return { title, number };
      case 'comparison':
        return { leftTitle, rightTitle };
      case 'quote':
        return { quote };
      case 'tech-grid':
        return { title, tags };
      case 'tutorial':
        return { title, steps };
      case 'list-style':
        return { title, items: listItems };
      case 'stats-style':
        return { title, stats };
      case 'step-display':
        return { title, stepNumber, totalSteps };
      case 'banner':
        return { title, subtitle, badge };
      default:
        return { title, subtitle, category };
    }
  };

  const SelectedComponent = templateComponents[selectedTemplate];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          🎨 サムネイル生成（単体）
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左サイド: テンプレート選択 */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-lg p-5 sticky top-4">
              <h2 className="text-lg font-bold text-gray-800 mb-3">テンプレート</h2>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto hide-scrollbar">
                {templates.map((t) => (
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

              {/* 編集パネル */}
              <h2 className="text-lg font-bold text-gray-800 mb-3">編集</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    タイトル
                  </label>
                  <textarea
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />
                </div>

                {['gradient-center', 'split-layout', 'card-style', 'dark-mode', 'icon-title', 'minimal', 'diagonal-stripe', 'circle-accent', 'gradient-border', 'simple-box', 'banner'].includes(selectedTemplate) && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      サブタイトル
                    </label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                {['icon-title', 'minimal', 'news-flash', 'simple-box'].includes(selectedTemplate) && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      カテゴリ
                    </label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    />
                  </div>
                )}

                {selectedTemplate === 'number-highlight' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">数字</label>
                    <input
                      type="text"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    />
                  </div>
                )}

                {selectedTemplate === 'comparison' && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">左タイトル</label>
                      <input
                        type="text"
                        value={leftTitle}
                        onChange={(e) => setLeftTitle(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">右タイトル</label>
                      <input
                        type="text"
                        value={rightTitle}
                        onChange={(e) => setRightTitle(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                      />
                    </div>
                  </>
                )}

                {selectedTemplate === 'quote' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">引用文</label>
                    <textarea
                      value={quote}
                      onChange={(e) => setQuote(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                      rows={2}
                    />
                  </div>
                )}

                {selectedTemplate === 'banner' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">バッジ</label>
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    />
                  </div>
                )}

                {selectedTemplate === 'step-display' && (
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">ステップ</label>
                      <input
                        type="number"
                        value={stepNumber}
                        onChange={(e) => setStepNumber(Number(e.target.value))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">全体</label>
                      <input
                        type="number"
                        value={totalSteps}
                        onChange={(e) => setTotalSteps(Number(e.target.value))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右サイド: プレビューとダウンロード */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">プレビュー</h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">1280 × 670 px</span>
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

              {/* プレビュー - 画面に収まるサイズ */}
              <div className="border border-gray-200 rounded-lg overflow-hidden inline-block">
                <div className="preview-wrapper">
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

export default ThumbnailEditor;
