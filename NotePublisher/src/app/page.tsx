'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Download, Image, BarChart3 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { CharacterGlass } from '@/components/templates/ThumbnailTemplates';
import {
  GlassProsCons,
  MinimalStats,
  FloatingComparison,
  HorizontalBentoStats,
  BeforeAfterStats,
} from '@/components/templates/InfographicTemplates';

interface Article {
  id: string;
  filename: string;
  title: string;
  content: string;
}

// 画像データの型定義
interface ImageData {
  thumbnail: {
    title: string;
    subtitle?: string;
    characterImage?: string;
  };
  infographics: Array<
    | { type: 'proscons'; title: string; pros: string[]; cons: string[] }
    | { type: 'stats'; title: string; stats: { value: string; label: string }[] }
    | { type: 'comparison'; title: string; headers: string[]; rows: { label: string; values: (string | boolean)[] }[] }
    | { type: 'beforeAfter'; title: string; items: { label: string; before: string; after: string }[] }
    | { type: 'horizontalStats'; title?: string; stats: { value: string; label: string }[] }
  >;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [characterImage, setCharacterImage] = useState<string>('');

  const characterPresets = [
    { id: 'none', name: 'なし', url: '' },
    { id: 'dragon', name: 'ドラゴン', url: '/characters/dragon.png' },
    { id: 'witch', name: '魔女', url: '/characters/witch.png' },
  ];

  const thumbnailRef = useRef<HTMLDivElement>(null);
  const infographicRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    if (selectedArticle) {
      fetchImageData(selectedArticle.filename);
    }
  }, [selectedArticle]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/articles?folder=03_公開準備完了');
      const data = await res.json();
      setArticles(data.articles || []);
      if (data.articles?.length > 0) {
        const firstArticle = data.articles[0];
        const detailRes = await fetch(`/api/articles/${encodeURIComponent(firstArticle.id)}`);
        const detailData = await detailRes.json();
        setSelectedArticle(detailData);
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchImageData = async (filename: string) => {
    try {
      const res = await fetch(`/api/imagedata/${encodeURIComponent(filename)}`);
      const result = await res.json();

      if (result.exists && result.data) {
        setImageData(result.data);
        setCharacterImage(result.data.thumbnail.characterImage || '');
      } else {
        // JSONがない場合は記事タイトルだけ表示
        setImageData({
          thumbnail: {
            title: selectedArticle?.title || 'タイトル未設定',
            subtitle: '',
          },
          infographics: []
        });
      }
    } catch (error) {
      console.error('Failed to fetch image data:', error);
    }
  };

  const selectArticle = async (article: Article) => {
    try {
      const res = await fetch(`/api/articles/${encodeURIComponent(article.id)}`);
      const data = await res.json();
      setSelectedArticle(data);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Failed to fetch article:', error);
    }
  };

  const downloadImage = async (ref: React.RefObject<HTMLDivElement> | HTMLDivElement | null, filename: string) => {
    const element = ref && 'current' in ref ? ref.current : ref;
    if (!element) return;
    try {
      const dataUrl = await toPng(element, { pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to download:', error);
    }
  };

  const downloadAllInfographics = async () => {
    for (let i = 0; i < infographicRefs.current.length; i++) {
      const ref = infographicRefs.current[i];
      if (ref) {
        await downloadImage(ref, `infographic-${i + 1}-${Date.now()}.png`);
      }
    }
  };

  const renderInfographic = (info: ImageData['infographics'][0]) => {
    switch (info.type) {
      case 'proscons':
        return (
          <GlassProsCons
            title={info.title}
            pros={info.pros}
            cons={info.cons}
          />
        );
      case 'stats':
        return (
          <MinimalStats
            title={info.title}
            stats={info.stats.map(s => ({ ...s, color: '' }))}
          />
        );
      case 'comparison':
        return (
          <FloatingComparison
            title={info.title}
            headers={info.headers}
            rows={info.rows}
          />
        );
      case 'beforeAfter':
        return (
          <BeforeAfterStats
            title={info.title}
            items={info.items}
          />
        );
      case 'horizontalStats':
        return (
          <HorizontalBentoStats
            title={info.title}
            stats={info.stats.map(s => ({ ...s, color: '' }))}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* ヘッダー */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-gray-950/80 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <Image className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">NotePublisher</h1>
                <p className="text-xs text-gray-500">プレビュー＆ダウンロード</p>
              </div>
            </div>

            {/* 記事選択ドロップダウン */}
            <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <span className="text-sm text-gray-300 max-w-[400px] truncate">
                    {selectedArticle?.title || '記事を選択'}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-[500px] max-h-[400px] overflow-y-auto rounded-xl bg-gray-900 border border-white/10 shadow-2xl z-50"
                    >
                      {articles.map((article) => (
                        <button
                          key={article.id}
                          onClick={() => selectArticle(article)}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                        >
                          <span className="line-clamp-2">{article.title}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-8 py-8">
        {imageData ? (
          <div className="space-y-12">
            {/* サムネイルセクション */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Image className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-lg font-semibold">サムネイル</h2>
                  <span className="text-xs text-gray-500">1280 x 670px</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {characterPresets.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => setCharacterImage(preset.url)}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                          characterImage === preset.url
                            ? 'bg-cyan-500 text-white'
                            : 'bg-white/5 hover:bg-white/10 text-gray-400'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => downloadImage(thumbnailRef, `thumbnail-${Date.now()}.png`)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 transition-colors text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    DL
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <div ref={thumbnailRef} className="w-[1280px] h-[670px]">
                  <CharacterGlass
                    title={imageData.thumbnail.title}
                    subtitle={imageData.thumbnail.subtitle}
                    characterImage={characterImage}
                  />
                </div>
              </div>
            </section>

            {/* インフォグラフセクション */}
            {imageData.infographics.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-lg font-semibold">インフォグラフ</h2>
                    <span className="text-xs text-gray-500">{imageData.infographics.length}枚</span>
                  </div>
                  <button
                    onClick={downloadAllInfographics}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 transition-colors text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    全てDL
                  </button>
                </div>

                <div>
                  {imageData.infographics.map((info, index) => (
                    <div
                      key={index}
                      ref={(el) => { infographicRefs.current[index] = el; }}
                    >
                      {renderInfographic(info)}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            公開準備完了の記事がありません
          </div>
        )}
      </main>
    </div>
  );
}
