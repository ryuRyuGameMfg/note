# NotePublisher

note記事のサムネイル・インフォグラフをプレビュー＆ダウンロードするツール。

**ポート: http://localhost:4003**

## 使い方

```bash
npm run dev
```

## ワークフロー

```
1. 記事を選択（アプリ右上のドロップダウン）
2. Claudeに記事を読ませてJSONデータ生成を依頼
3. Claudeが data/{記事名}.json を作成
4. アプリで再読み込み（↻ボタン）→ プレビュー表示
5. ダウンロード
```

## データ保存場所

```
NotePublisher/data/{記事ファイル名}.json
```

例: `Pure C#でUnity開発.md` → `data/Pure C#でUnity開発.json`

## ファイル構成

```
NotePublisher/
├── data/                  # 画像データJSON（Claudeが生成）
├── src/
│   ├── app/page.tsx       # メイン画面
│   ├── components/templates/  # テンプレート
│   └── lib/               # ユーティリティ
└── REGULATIONS.md         # レギュレーション・JSONスキーマ
```

## 技術スタック

Next.js / TypeScript / Tailwind CSS / html-to-image
