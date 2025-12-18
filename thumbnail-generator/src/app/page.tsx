'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { 
  FileText, RefreshCw, Download, Edit3, RotateCcw, 
  ChevronRight, Image, BarChart3, Check, X, Loader2 
} from 'lucide-react';
import { toPng, toJpeg } from 'html-to-image';
import { saveAs } from 'file-saver';
import { parseMarkdown, ParsedArticle } from '@/lib/parseArticle';
import {
  GradientCenter,
  DarkMode,
  NewsFlash,
  ComparisonStyle,
  TechGrid,
  CircleAccent,
  Tutorial,
  StepDisplay,
  ListStyle,
} from '@/components/templates/ThumbnailTemplates';
import {
  ComparisonTable,
  ProsCons,
  StatsInfographic,
  BarChart,
} from '@/components/templates/InfographicTemplates';

interface Article {
  id: string;
  filename: string;
  title: string;
  modifiedAt: string;
}

type Step = 'list' | 'generating' | 'preview';

const thumbnailComponents: Record<string, React.FC<any>> = {
  'gradient-center': GradientCenter,
  'dark-mode': DarkMode,
  'news-flash': NewsFlash,
  'comparison': ComparisonStyle,
  'tech-grid': TechGrid,
  'circle-accent': CircleAccent,
  'tutorial': Tutorial,
  'step-display': StepDisplay,
  'list-style': ListStyle,
};

const infographicComponents: Record<string, React.FC<any>> = {
  'comparison-table': ComparisonTable,
  'pros-cons': ProsCons,
  'stats': StatsInfographic,
  'bar-chart': BarChart,
};

const templateNames: Record<string, string> = {
  'gradient-center': 'グラデーション',
  'dark-mode': 'ダークモード',
  'news-flash': 'ニュース速報',
  'comparison': '比較型',
  'tech-grid': 'テックグリッド',
  'circle-accent': '円形アクセント',
  'tutorial': 'チュートリアル',
  'step-display': 'ステップ表示',
  'list-style': 'リスト型',
  'comparison-table': '比較表',
  'pros-cons': 'メリデメ',
  'stats': '統計データ',
  'bar-chart': '棒グラフ',
};

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>('list');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [parsedArticle, setParsedArticle] = useState<ParsedArticle | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null);
  const [selectedInfoGraphic, setSelectedInfoGraphic] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedSubtitle, setEditedSubtitle] = useState('');
  
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const infographicRef = useRef<HTMLDivElement>(null);

  // 記事一覧を取得
  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // 記事を選択して生成
  const handleSelectArticle = async (article: Article) => {
    setSelectedArticle(article);
    setStep('generating');
    
    try {
      const res = await fetch(`/api/articles/${article.id}`);
      const data = await res.json();
      
      if (data.content) {
        const parsed = parseMarkdown(data.content);
        setParsedArticle(parsed);
        setEditedTitle(parsed.title);
        setEditedSubtitle(parsed.subtitle);
        
        // 最初のテンプレートを自動選択
        if (parsed.suggestedTemplates.thumbnails.length > 0) {
          setSelectedThumbnail(parsed.suggestedTemplates.thumbnails[0]);
        }
        if (parsed.suggestedTemplates.infographics.length > 0) {
          setSelectedInfoGraphic(parsed.suggestedTemplates.infographics[0]);
        }
        
        setStep('preview');
      }
    } catch (error) {
      console.error('Failed to fetch article:', error);
      setStep('list');
    }
  };

  // やり直し
  const handleReset = () => {
    setStep('list');
    setSelectedArticle(null);
    setParsedArticle(null);
    setSelectedThumbnail(null);
    setSelectedInfoGraphic(null);
    setEditMode(false);
  };

  // ダウンロード
  const downloadImage = async (ref: React.RefObject<HTMLDivElement | null>, name: string, format: 'png' | 'jpeg') => {
    if (!ref.current) return;
    try {
      const fn = format === 'png' ? toPng : toJpeg;
      const dataUrl = await fn(ref.current, {
        quality: format === 'jpeg' ? 0.95 : 1,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: format === 'jpeg' ? '#ffffff' : undefined,
      });
      saveAs(dataUrl, `${name}.${format === 'jpeg' ? 'jpg' : 'png'}`);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  // サムネイルのprops
  const getThumbnailProps = () => {
    if (!parsedArticle) return {};
    const title = editMode ? editedTitle : parsedArticle.title;
    const subtitle = editMode ? editedSubtitle : parsedArticle.subtitle;
    
    switch (selectedThumbnail) {
      case 'comparison':
        // タイトルから比較対象を抽出
        const vsMatch = title.match(/(.+?)\s*(?:vs|VS|×)\s*(.+?)(?:｜|$)/);
        if (vsMatch) {
          return { leftTitle: vsMatch[1], rightTitle: vsMatch[2] };
        }
        return { leftTitle: 'A', rightTitle: 'B' };
      case 'tech-grid':
        return { title, tags: parsedArticle.hashtags };
      case 'tutorial':
        return { title, steps: ['準備', '実行', '完了'] };
      case 'step-display':
        return { title, stepNumber: 1, totalSteps: 3 };
      case 'list-style':
        return { title, items: parsedArticle.hashtags.length > 0 ? parsedArticle.hashtags : ['項目1', '項目2', '項目3'] };
      default:
        return { title, subtitle, category: parsedArticle.isNews ? '速報' : undefined };
    }
  };

  // インフォグラフィックのprops
  const getInfographicProps = () => {
    if (!parsedArticle) return {};
    
    switch (selectedInfoGraphic) {
      case 'comparison-table':
        if (parsedArticle.comparisonData) {
          return {
            title: parsedArticle.comparisonData.title,
            headers: parsedArticle.comparisonData.headers,
            rows: parsedArticle.comparisonData.rows,
          };
        }
        return { title: '比較表', headers: ['A', 'B'], rows: [] };
      case 'pros-cons':
        if (parsedArticle.proscons) {
          return {
            title: parsedArticle.proscons.title,
            pros: parsedArticle.proscons.pros,
            cons: parsedArticle.proscons.cons,
          };
        }
        return { title: 'メリット・デメリット', pros: [], cons: [] };
      case 'stats':
        return {
          title: editMode ? editedTitle : parsedArticle.title,
          stats: parsedArticle.stats || [],
        };
      case 'bar-chart':
        return {
          title: '推移',
          bars: parsedArticle.stats?.map((s, i) => ({
            label: s.label,
            value: parseInt(s.value.replace(/[^0-9]/g, '')) || (i + 1) * 10,
            color: s.color,
          })) || [],
        };
      default:
        return {};
    }
  };

  const ThumbnailComponent = selectedThumbnail ? thumbnailComponents[selectedThumbnail] : null;
  const InfographicComponent = selectedInfoGraphic ? infographicComponents[selectedInfoGraphic] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            🎨 note 画像生成
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/thumbnail"
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
            >
              <Image size={16} />
              サムネイル単体
            </Link>
            <Link
              href="/infographic"
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
            >
              <BarChart3 size={16} />
              インフォグラフ単体
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* ステップ表示 */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <span className={`px-3 py-1 rounded-full ${step === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
            1. 記事選択
          </span>
          <ChevronRight size={16} className="text-gray-400" />
          <span className={`px-3 py-1 rounded-full ${step === 'generating' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
            2. 生成中
          </span>
          <ChevronRight size={16} className="text-gray-400" />
          <span className={`px-3 py-1 rounded-full ${step === 'preview' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
            3. プレビュー
          </span>
        </div>

        {/* ステップ1: 記事一覧 */}
        {step === 'list' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FileText size={20} />
                公開準備完了の記事
              </h2>
              <button
                onClick={fetchArticles}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <RefreshCw size={16} />
                更新
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-gray-400" size={32} />
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                <p>公開準備完了の記事がありません</p>
                <p className="text-sm mt-2">note/03_公開準備完了/ に記事を配置してください</p>
              </div>
            ) : (
              <div className="space-y-2">
                {articles.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => handleSelectArticle(article)}
                    className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 truncate group-hover:text-blue-600">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          更新: {new Date(article.modifiedAt).toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                      <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-500" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ステップ2: 生成中 */}
        {step === 'generating' && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={48} />
            <p className="text-gray-600">画像を生成中...</p>
            <p className="text-sm text-gray-400 mt-2">{selectedArticle?.title}</p>
          </div>
        )}

        {/* ステップ3: プレビュー */}
        {step === 'preview' && parsedArticle && (
          <div className="space-y-6">
            {/* アクションバー */}
            <div className="bg-white rounded-xl shadow-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
                >
                  <RotateCcw size={18} />
                  やり直し
                </button>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    editMode ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Edit3 size={18} />
                  {editMode ? '編集中' : '編集'}
                </button>
              </div>
              <div className="text-sm text-gray-500 truncate max-w-md">
                {selectedArticle?.title}
              </div>
            </div>

            {/* 編集パネル */}
            {editMode && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <h3 className="font-medium text-yellow-800 mb-3">テキスト編集</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">タイトル</label>
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">サブタイトル</label>
                    <input
                      type="text"
                      value={editedSubtitle}
                      onChange={(e) => setEditedSubtitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* サムネイルセクション */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Image size={20} />
                  サムネイル
                  <span className="text-sm font-normal text-gray-500">1280×670px</span>
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadImage(thumbnailRef, 'thumbnail', 'png')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  >
                    <Download size={14} />
                    PNG
                  </button>
                  <button
                    onClick={() => downloadImage(thumbnailRef, 'thumbnail', 'jpeg')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                  >
                    <Download size={14} />
                    JPEG
                  </button>
                </div>
              </div>

              {/* テンプレート選択 */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {parsedArticle.suggestedTemplates.thumbnails.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedThumbnail(t)}
                    className={`px-3 py-1.5 text-sm rounded-lg border-2 transition ${
                      selectedThumbnail === t
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {templateNames[t] || t}
                  </button>
                ))}
              </div>

              {/* プレビュー */}
              <div className="border border-gray-200 rounded-lg overflow-hidden inline-block">
                <div className="preview-wrapper">
                  <div ref={thumbnailRef}>
                    {ThumbnailComponent && <ThumbnailComponent {...getThumbnailProps()} />}
                  </div>
                </div>
              </div>
            </div>

            {/* インフォグラフィックセクション */}
            {parsedArticle.suggestedTemplates.infographics.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <BarChart3 size={20} />
                    インフォグラフィック
                    <span className="text-sm font-normal text-gray-500">記事内で使用</span>
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadImage(infographicRef, 'infographic', 'png')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                    >
                      <Download size={14} />
                      PNG
                    </button>
                    <button
                      onClick={() => downloadImage(infographicRef, 'infographic', 'jpeg')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                    >
                      <Download size={14} />
                      JPEG
                    </button>
                  </div>
                </div>

                {/* テンプレート選択 */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  {parsedArticle.suggestedTemplates.infographics.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedInfoGraphic(t)}
                      className={`px-3 py-1.5 text-sm rounded-lg border-2 transition ${
                        selectedInfoGraphic === t
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {templateNames[t] || t}
                    </button>
                  ))}
                </div>

                {/* プレビュー */}
                <div className="border border-gray-200 rounded-lg overflow-hidden inline-block">
                  <div className="infographic-preview-wrapper">
                    <div ref={infographicRef}>
                      {InfographicComponent && <InfographicComponent {...getInfographicProps()} />}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 解析情報 */}
            <div className="bg-gray-100 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">解析情報</h3>
              <div className="flex flex-wrap gap-2">
                {parsedArticle.isNews && (
                  <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs">ニュース</span>
                )}
                {parsedArticle.isTutorial && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">チュートリアル</span>
                )}
                {parsedArticle.isComparison && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded text-xs">比較記事</span>
                )}
                {parsedArticle.hasComparison && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">比較表あり</span>
                )}
                {parsedArticle.hasProscons && (
                  <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs">メリデメあり</span>
                )}
                {parsedArticle.hasStats && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded text-xs">統計データあり</span>
                )}
                {parsedArticle.hashtags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
