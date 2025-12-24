# NotePublisher レギュレーション

## サイズ規定

| 種類 | サイズ |
|------|--------|
| サムネイル | 1280 x 670px |
| インフォグラフ | 幅800px（高さは内容に応じて自動） |

## カラーパレット（6色固定）

| 名前 | 用途 | Tailwind |
|------|------|----------|
| Primary | 比較表ヘッダー | `from-sky-500 to-blue-600` |
| Secondary | 統計カード | `from-teal-500 to-cyan-600` |
| Neutral | 補助情報 | `from-slate-500 to-slate-600` |
| Negative | デメリット/Before | `from-rose-400 to-rose-500` |
| Positive | メリット/After | `from-emerald-400 to-teal-500` |
| Accent | 強調 | `from-amber-400 to-orange-500` |

## テンプレート

### サムネイル
- **CharacterGlass**: 青〜シアン系グラデーション + グラスカード + キャラクター

### インフォグラフ
- **GlassProsCons**: メリット・デメリット
- **MinimalStats**: 統計データ（3〜6個）
- **FloatingComparison**: 比較表
- **HorizontalBentoStats**: 横並び統計（4個）
- **BeforeAfterStats**: ビフォーアフター

## JSONスキーマ

Claudeに依頼する際、以下の形式でデータを生成してもらう：

```json
{
  "thumbnail": {
    "title": "タイトル",
    "subtitle": "サブタイトル（任意）",
    "characterImage": "/characters/dragon.png または /characters/witch.png または 空"
  },
  "infographics": [
    {
      "type": "proscons",
      "title": "メリット・デメリット",
      "pros": ["メリット1", "メリット2", "メリット3"],
      "cons": ["デメリット1", "デメリット2", "デメリット3"]
    },
    {
      "type": "stats",
      "title": "主要データ",
      "stats": [
        { "value": "100件", "label": "実績" },
        { "value": "50%", "label": "削減率" }
      ]
    },
    {
      "type": "comparison",
      "title": "比較表",
      "headers": ["A", "B"],
      "rows": [
        { "label": "項目1", "values": [true, false] },
        { "label": "項目2", "values": ["○", "△"] }
      ]
    },
    {
      "type": "beforeAfter",
      "title": "導入効果",
      "items": [
        { "label": "処理時間", "before": "2時間", "after": "10分" }
      ]
    }
  ]
}
```

## 禁止事項

- 絵文字の使用（SVGアイコンのみ）
- パレット外の色
- 情報の詰め込みすぎ
