'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Download, Check, FileText, Image as ImageIcon, Moon, Sun, CheckSquare } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toPng, toJpeg } from 'html-to-image';
import { saveAs } from 'file-saver';
import { parseMarkdown, ParsedArticle } from '@/lib/parseArticle';
import { DarkMode } from '@/components/templates/ThumbnailTemplates';
import {
  ComparisonTable,
  ProsCons,
  StatsInfographic,
  BarChart,
} from '@/components/templates/InfographicTemplates';

const infographicComponents: Record<string, React.FC<any>> = {
  'comparison-table': ComparisonTable,
  'pros-cons': ProsCons,
  'stats': StatsInfographic,
  'bar-chart': BarChart,
};

export default function ArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<any>(null);
  const [parsedArticle, setParsedArticle] = useState<ParsedArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // インフォグラフのダーク/ホワイト切り替え
  const [isPublished, setIsPublished] = useState(false); // 公開済みチェック
  const [publishing, setPublishing] = useState(false); // 公開処理中
  
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const infographicRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (params.id) {
      fetchArticle(params.id as string);
    }
  }, [params.id]);

  const fetchArticle = async (id: string) => {
    setLoading(true);
    try {
      // IDをデコード（既にデコード済みの場合もあるのでtry-catchで対応）
      let decodedId = id;
      try {
        decodedId = decodeURIComponent(id);
      } catch (e) {
        // 既にデコード済みの場合はそのまま使用
      }
      
      const res = await fetch(`/api/articles/${encodeURIComponent(decodedId)}`);
      const data = await res.json();
      
      if (data.content) {
        const parsed = parseMarkdown(data.content);
        setParsedArticle(parsed);
        setArticle({
          id: decodedId,
          filename: data.filename,
          title: parsed.title,
          content: data.content,
          status: data.status,
          location: data.location
        });
        // 公開済みかどうかを設定
        setIsPublished(data.status === 'published');
      }
    } catch (error) {
      console.error('Failed to fetch article:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: 'title' | 'content') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'title') {
        setCopiedTitle(true);
        setTimeout(() => setCopiedTitle(false), 2000);
      } else {
        setCopiedContent(true);
        setTimeout(() => setCopiedContent(false), 2000);
      }
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const downloadImage = async (ref: React.RefObject<HTMLDivElement | null>, name: string) => {
    if (!ref.current) return;
    try {
      const dataUrl = await toJpeg(ref.current, {
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#ffffff',
      });
      saveAs(dataUrl, `${name}.jpg`);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handlePublish = async () => {
    if (!article || !isPublished) return;
    
    const confirmMessage = article.status === 'published' 
      ? '公開取り消しして「公開準備完了」に戻しますか？'
      : 'この記事を「公開済み」に移動しますか？';
    
    if (!confirm(confirmMessage)) return;

    setPublishing(true);
    try {
      const method = article.status === 'published' ? 'DELETE' : 'POST';
      const res = await fetch(`/api/articles/${encodeURIComponent(article.id)}/publish`, {
        method
      });
      
      const data = await res.json();
      
      if (data.success) {
        alert(data.message);
        // ページをリロードして最新状態を取得
        window.location.reload();
      } else {
        alert(data.message || '処理に失敗しました');
      }
    } catch (error) {
      console.error('Publish failed:', error);
      alert('処理に失敗しました');
    } finally {
      setPublishing(false);
    }
  };

  const getThumbnailProps = () => {
    if (!parsedArticle) return {};
    return {
      title: parsedArticle.title,
      subtitle: parsedArticle.subtitle,
      category: parsedArticle.isNews ? '速報' : undefined,
    };
  };

  const getInfographicProps = (type: string) => {
    if (!parsedArticle) return {};
    
    switch (type) {
      case 'comparison-table':
        if (parsedArticle.comparisonData) {
          return {
            title: parsedArticle.comparisonData.title,
            headers: parsedArticle.comparisonData.headers,
            rows: parsedArticle.comparisonData.rows,
          };
        }
        return null;
      case 'pros-cons':
        if (parsedArticle.proscons) {
          return {
            title: parsedArticle.proscons.title,
            pros: parsedArticle.proscons.pros,
            cons: parsedArticle.proscons.cons,
          };
        }
        return null;
      case 'stats':
        return {
          title: parsedArticle.title,
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
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!article || !parsedArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-blue-700 mx-auto mb-4" />
          <p className="text-blue-400 text-lg">記事が見つかりませんでした</p>
          <Link href="/">
            <Button variant="ghost" className="mt-4 text-blue-400 hover:text-blue-300 hover:bg-blue-600/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              記事一覧に戻る
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const infographics = parsedArticle.suggestedTemplates.infographics
    .map(type => ({ type, props: getInfographicProps(type) }))
    .filter(item => item.props !== null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-blue-900/90 border-b border-blue-600/20 shadow-lg shadow-blue-500/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/">
            <Button variant="ghost" className="text-blue-200 hover:text-blue-100 hover:bg-blue-600/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              記事一覧に戻る
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* タイトルセクション */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-blue-900/80 to-blue-800/60 border-blue-600/20 backdrop-blur-sm shadow-xl shadow-blue-500/10">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-4">{article.title}</h1>
                  <div className="flex flex-wrap gap-2">
                    {parsedArticle.isNews && (
                      <Badge className="bg-red-500/20 text-red-300 border-red-500/30">速報</Badge>
                    )}
                    {parsedArticle.isTutorial && (
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">チュートリアル</Badge>
                    )}
                    {parsedArticle.isComparison && (
                      <Badge className="bg-blue-600/20 text-blue-300 border-blue-600/30">比較記事</Badge>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => copyToClipboard(article.title, 'title')}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:scale-105 transition-transform shadow-lg shadow-blue-500/30"
                >
                  {copiedTitle ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copiedTitle ? 'コピー済み' : 'タイトルコピー'}
                </Button>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* 本文コピーセクション */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-900/80 to-blue-800/60 border-blue-600/20 backdrop-blur-sm shadow-xl shadow-blue-500/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">記事本文</h2>
                </div>
                <Button
                  onClick={() => copyToClipboard(article.content, 'content')}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:scale-105 transition-transform shadow-lg shadow-blue-500/30"
                >
                  {copiedContent ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copiedContent ? 'コピー済み' : '本文コピー'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 公開管理セクション */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="bg-gradient-to-br from-blue-900/80 to-blue-800/60 border-blue-600/20 backdrop-blur-sm shadow-xl shadow-blue-500/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CheckSquare className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">公開管理</h2>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                        className="w-5 h-5 rounded border-blue-500 bg-blue-900/50 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                      />
                      <span className="text-white">公開済みにする</span>
                    </label>
                  </div>
                  {article.status === 'published' && (
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      現在: 公開済み
                    </Badge>
                  )}
                  {article.status === 'ready' && (
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      現在: 公開準備完了
                    </Badge>
                  )}
                </div>
                <Button
                  onClick={handlePublish}
                  disabled={!isPublished || publishing || article.status === 'published'}
                  className="bg-gradient-to-r from-green-600 to-green-500 hover:scale-105 transition-transform shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {publishing ? (
                    <>処理中...</>
                  ) : article.status === 'published' ? (
                    <>公開取り消し</>
                  ) : (
                    <>確定して移動</>
                  )}
                </Button>
              </div>
              <p className="text-sm text-blue-300/60 mt-3 ml-9">
                {article.status === 'published' 
                  ? '※ 公開取り消しすると「03_公開準備完了」フォルダに戻ります'
                  : '※ チェックを入れて確定すると「04_公開済み」フォルダに移動します'
                }
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <Separator className="bg-blue-800" />

        {/* サムネイルセクション */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-blue-900/80 to-blue-800/60 border-blue-600/20 backdrop-blur-sm shadow-xl shadow-blue-500/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ImageIcon className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">サムネイル</h2>
                  <Badge variant="secondary" className="bg-blue-800 text-blue-400">1280×670px</Badge>
                </div>
                <Button
                  onClick={() => downloadImage(thumbnailRef, 'thumbnail')}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:scale-105 transition-transform shadow-lg shadow-blue-500/30"
                >
                  <Download className="w-4 h-4 mr-2" />
                  JPGダウンロード
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="w-full bg-blue-950 rounded-xl p-6 flex justify-center">
                <div className="preview-wrapper overflow-hidden rounded-lg">
                  <div ref={thumbnailRef}>
                    <DarkMode {...getThumbnailProps()} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* インフォグラフセクション */}
        {infographics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <ImageIcon className="w-6 h-6 text-blue-400" />
                インフォグラフ
              </h2>
              
              {/* ダーク/ホワイト切り替えトグル */}
              <div className="flex items-center gap-2 bg-blue-900/50 rounded-lg p-1 border border-blue-600/20">
                <button
                  onClick={() => setDarkMode(true)}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
                    darkMode 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                      : 'text-blue-300 hover:bg-blue-800/50'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  ダーク
                </button>
                <button
                  onClick={() => setDarkMode(false)}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
                    !darkMode 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                      : 'text-blue-300 hover:bg-blue-800/50'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  ホワイト
                </button>
              </div>
            </div>
            
            {infographics.map((item, index) => {
              const Component = infographicComponents[item.type];
              if (!Component) return null;

              return (
                <Card key={index} className="bg-gradient-to-br from-blue-900/80 to-blue-800/60 border-blue-600/20 backdrop-blur-sm shadow-xl shadow-blue-500/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">インフォグラフ {index + 1}</h3>
                      <Button
                        onClick={() => downloadImage({ current: infographicRefs.current[index] }, `infographic-${index + 1}`)}
                        className="bg-gradient-to-r from-blue-600 to-blue-500 hover:scale-105 transition-transform shadow-lg shadow-blue-500/30"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        JPGダウンロード
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="bg-blue-950 rounded-xl p-4 inline-block">
                      <div ref={el => infographicRefs.current[index] = el}>
                        <Component {...item.props} darkMode={darkMode} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        )}
      </main>
    </div>
  );
}
