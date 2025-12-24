'use client';

import React from 'react';

interface TemplateProps {
  title: string;
  subtitle?: string;
}

// タイトルを【】で分割して改行
const formatTitle = (title: string) => {
  return title.replace(/】/g, '】\n');
};

// ==========================================
// Template 1: グラスモーフィズム + グラデーション背景
// ==========================================
export const GlassGradient: React.FC<TemplateProps> = ({ title, subtitle }) => (
  <div className="w-[1280px] h-[670px] relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
    {/* 背景のぼかし円 */}
    <div className="absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full bg-pink-500/40 blur-3xl" />
    <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full bg-blue-500/40 blur-3xl" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-cyan-400/30 blur-3xl" />

    {/* グラスカード */}
    <div className="absolute inset-12 flex items-center justify-center">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-16 max-w-4xl shadow-2xl">
        <h1 className="text-5xl font-bold text-white leading-tight text-center whitespace-pre-line drop-shadow-lg">
          {formatTitle(title)}
        </h1>
        {subtitle && (
          <p className="text-xl text-white/70 mt-6 text-center">{subtitle}</p>
        )}
      </div>
    </div>
  </div>
);

// ==========================================
// Template 2: 大胆なタイポグラフィ + ミニマル
// ==========================================
export const BoldTypo: React.FC<TemplateProps> = ({ title }) => (
  <div className="w-[1280px] h-[670px] bg-gray-950 flex items-center justify-center p-16">
    {/* アクセントライン */}
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

    <div className="max-w-5xl">
      <h1 className="text-7xl font-black text-white leading-[1.1] tracking-tight whitespace-pre-line">
        {formatTitle(title)}
      </h1>
    </div>

    {/* 装飾 */}
    <div className="absolute bottom-12 right-12 flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-blue-500" />
      <div className="w-3 h-3 rounded-full bg-purple-500" />
      <div className="w-3 h-3 rounded-full bg-pink-500" />
    </div>
  </div>
);

// ==========================================
// Template 3: アクセントライン + 余白
// ==========================================
export const AccentLine: React.FC<TemplateProps> = ({ title, subtitle }) => (
  <div className="w-[1280px] h-[670px] bg-white flex items-center p-20">
    <div className="flex gap-8">
      {/* 左のアクセントライン */}
      <div className="w-2 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full flex-shrink-0" />

      <div className="flex flex-col justify-center">
        <h1 className="text-5xl font-bold text-gray-900 leading-tight whitespace-pre-line">
          {formatTitle(title)}
        </h1>
        {subtitle && (
          <p className="text-xl text-gray-500 mt-6">{subtitle}</p>
        )}
      </div>
    </div>

    {/* 装飾的な円 */}
    <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full border-[40px] border-blue-100" />
  </div>
);

// ==========================================
// Template 4: フローティングカード + ぼかし背景
// ==========================================
export const FloatingCard: React.FC<TemplateProps> = ({ title, subtitle }) => (
  <div className="w-[1280px] h-[670px] relative bg-gradient-to-br from-slate-900 to-slate-800">
    {/* 背景グリッド */}
    <div
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}
    />

    {/* ぼかし球 */}
    <div className="absolute top-20 right-20 w-[200px] h-[200px] rounded-full bg-blue-500/30 blur-3xl" />
    <div className="absolute bottom-20 left-20 w-[250px] h-[250px] rounded-full bg-purple-500/20 blur-3xl" />

    {/* フローティングカード */}
    <div className="absolute inset-16 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-14 shadow-2xl shadow-black/50 max-w-4xl transform hover:scale-[1.02] transition-transform">
        <h1 className="text-5xl font-bold text-gray-900 leading-tight text-center whitespace-pre-line">
          {formatTitle(title)}
        </h1>
        {subtitle && (
          <p className="text-xl text-gray-500 mt-6 text-center">{subtitle}</p>
        )}
      </div>
    </div>
  </div>
);

// ==========================================
// Template 5: ダーク + ネオンアクセント
// ==========================================
export const NeonDark: React.FC<TemplateProps> = ({ title, subtitle }) => (
  <div className="w-[1280px] h-[670px] bg-gray-950 flex flex-col items-center justify-center p-16 relative overflow-hidden">
    {/* ネオングロー効果 */}
    <div className="absolute top-0 left-1/4 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_40px_10px_rgba(34,211,238,0.3)]" />
    <div className="absolute bottom-0 right-1/4 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_40px_10px_rgba(168,85,247,0.3)]" />

    {/* タイトル */}
    <h1 className="text-6xl font-bold text-center leading-tight whitespace-pre-line">
      <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
        {formatTitle(title)}
      </span>
    </h1>

    {subtitle && (
      <p className="text-xl text-gray-500 mt-8 text-center">{subtitle}</p>
    )}

    {/* コーナー装飾 */}
    <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-cyan-500/50" />
    <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-purple-500/50" />
  </div>
);

// ==========================================
// Template 6: キャラクター + グラデーション
// ==========================================
export const CharacterGradient: React.FC<TemplateProps & { characterImage?: string }> = ({
  title,
  subtitle,
  characterImage,
}) => (
  <div className="w-[1280px] h-[670px] relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
    {/* 背景のぼかし円 */}
    <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-500/30 blur-3xl" />
    <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] rounded-full bg-purple-500/20 blur-3xl" />

    {/* キャラクター画像（左側・左右反転・少しはみ出し） */}
    {characterImage && (
      <div
        className="absolute bottom-0 h-full flex items-end"
        style={{ left: characterImage.includes('witch') ? '0px' : '-64px' }}
      >
        <img
          src={characterImage}
          alt="Character"
          className="h-[90%] object-contain drop-shadow-2xl"
          style={{ transform: 'scaleX(-1)' }}
        />
      </div>
    )}

    {/* コンテンツエリア（キャラあり：右側配置、なし：中央配置） */}
    <div className={`absolute top-1/2 -translate-y-1/2 z-10 ${
      characterImage
        ? 'left-[550px] right-12'
        : 'left-12 right-12 text-center'
    }`}>
      <h1 className="text-5xl font-bold text-white leading-tight whitespace-pre-line drop-shadow-lg">
        {formatTitle(title)}
      </h1>
      {subtitle && (
        <p className="text-xl text-white/70 mt-6">{subtitle}</p>
      )}
    </div>
  </div>
);

// ==========================================
// Template 7: キャラクター + グラスカード（青〜シアン系）
// ==========================================
export const CharacterGlass: React.FC<TemplateProps & { characterImage?: string }> = ({
  title,
  subtitle,
  characterImage,
}) => (
  <div className="w-[1280px] h-[670px] relative overflow-hidden bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-500">
    {/* 背景のぼかし円 */}
    <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full bg-white/30 blur-3xl" />
    <div className="absolute bottom-0 right-1/3 w-[300px] h-[300px] rounded-full bg-cyan-300/40 blur-3xl" />
    <div className="absolute top-1/2 left-1/4 w-[200px] h-[200px] rounded-full bg-blue-300/30 blur-3xl" />

    {/* キャラクター画像（左側・前面レイヤー・左右反転・少しはみ出し） */}
    {characterImage && (
      <div
        className="absolute bottom-0 h-full flex items-end z-20"
        style={{ left: characterImage.includes('witch') ? '0px' : '-64px' }}
      >
        <img
          src={characterImage}
          alt="Character"
          className="h-[85%] object-contain drop-shadow-2xl"
          style={{ transform: 'scaleX(-1)' }}
        />
      </div>
    )}

    {/* グラスカード（右側・テキストは左寄せ・左端固定で右に拡大） */}
    <div className="absolute left-[470px] right-8 top-1/2 -translate-y-1/2 z-10">
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-10 shadow-2xl">
        <h1 className="text-4xl font-bold text-white leading-tight whitespace-pre-line drop-shadow-lg">
          {formatTitle(title)}
        </h1>
        {subtitle && (
          <p className="text-lg text-white/80 mt-4">{subtitle}</p>
        )}
      </div>
    </div>
  </div>
);

// テンプレート一覧
export const thumbnailTemplates = [
  { id: 'glass-gradient', name: 'グラス+グラデ', component: GlassGradient },
  { id: 'bold-typo', name: '大文字タイポ', component: BoldTypo },
  { id: 'accent-line', name: 'アクセントライン', component: AccentLine },
  { id: 'floating-card', name: 'フローティング', component: FloatingCard },
  { id: 'neon-dark', name: 'ネオンダーク', component: NeonDark },
  { id: 'character-gradient', name: 'キャラ+グラデ', component: CharacterGradient },
  { id: 'character-glass', name: 'キャラ+グラス', component: CharacterGlass },
];
