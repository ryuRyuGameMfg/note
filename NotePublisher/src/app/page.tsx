'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, Search, Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Article {
  id: string;
  filename: string;
  title: string;
  modifiedAt: string;
  status?: 'ready' | 'published';
  location?: string;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredArticles(filtered);
    }
  }, [searchQuery, articles]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      setArticles(data.articles || []);
      setFilteredArticles(data.articles || []);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-blue-900/90 border-b border-blue-600/20 shadow-lg shadow-blue-500/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 shadow-lg shadow-blue-500/30">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-400 to-blue-300">
                  リリース記事一覧
                </h1>
                <p className="text-sm text-blue-300/60">noteリリース用ツール</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-500/30 shadow-lg shadow-blue-500/10">
              {articles.length}件
            </Badge>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* 検索バー */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400/60" />
            <Input
              type="text"
              placeholder="記事を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 bg-blue-900/70 border-blue-600/30 text-white placeholder:text-blue-300/40 
                         focus:border-blue-500/60 focus:ring-blue-500/30 rounded-xl shadow-lg shadow-blue-500/10
                         backdrop-blur-sm"
            />
          </div>
        </motion.div>

        {/* 記事一覧 */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
          </div>
        ) : filteredArticles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <FileText className="w-16 h-16 text-blue-700 mx-auto mb-4" />
            <p className="text-blue-400 text-lg">記事が見つかりませんでした</p>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/article/${encodeURIComponent(article.id)}`}>
                  <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-900/80 to-blue-800/60 
                                 border-blue-600/20 hover:border-blue-500/40 transition-all duration-500 
                                 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer backdrop-blur-sm">
                    {/* 光るエフェクト */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-400/10 to-blue-600/0 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <CardContent className="relative p-6 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          {article.status === 'published' && (
                            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 shadow-lg shadow-green-500/10">
                              公開済み
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-300/60">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(article.modifiedAt).toLocaleDateString('ja-JP')}</span>
                        </div>
                      </div>
                      
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="ml-4"
                      >
                        <ArrowRight className="w-6 h-6 text-blue-400/40 group-hover:text-blue-300 transition-colors" />
                      </motion.div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
