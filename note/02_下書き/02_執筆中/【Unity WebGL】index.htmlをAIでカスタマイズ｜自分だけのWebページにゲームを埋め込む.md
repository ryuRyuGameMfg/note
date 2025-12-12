# 【Unity WebGL】index.htmlをAIでカスタマイズ｜自分だけのWebページにゲームを埋め込む

## はじめに

こんにちは！ゲーム開発所RYURYUのりゅうやです。

UnityでWebGLビルドすると、`index.html`が出力されますよね。

実はこれ、**AIでカスタマイズして自分好みのデザインにできる**んです。

しかも、そのままWebページとして公開して、ページの中にゲームを埋め込むみたいなこともできる。

今回は、Unity WebGLのindex.htmlをカスタマイズする方法を紹介します。

**ゲーム開発のご相談：**
https://coconala.com/services/3327092

## Unity WebGLビルドの仕組み

UnityでWebGLビルドすると、以下のファイルが出力されます。

> index.html：メインのHTMLファイル
> Build/：WebAssemblyやJavaScriptファイル
> TemplateData/：ローディング画面の素材

`index.html`がエントリーポイントで、ここからUnityのゲームが読み込まれます。

## index.htmlの中身

デフォルトのindex.htmlは、こんな構成になってます。

> HTMLの基本構造
> Unityローダーの読み込み
> キャンバス（ゲーム表示領域）
> ローディングバー
> フルスクリーンボタン

シンプルな構成なので、**カスタマイズしやすい**んですよね。

## AIでカスタマイズする方法

### ステップ1：ビルドしたindex.htmlを開く

まずは普通にWebGLビルドして、出力された`index.html`を開きます。

### ステップ2：AIに渡す

CursorやClaude Codeなどに、index.htmlの内容を渡します。

「このHTMLをカスタマイズして、〇〇なデザインにして」みたいに指示。

### ステップ3：カスタマイズ

**できること**

> ヘッダーを追加（タイトルやナビゲーション）
> 背景デザインを変更（グラデーションや画像）
> 説明文を追加（遊び方や概要）
> SNSシェアボタンを設置
> レスポンシブ対応

HTMLとCSSはAIがめっちゃ得意な領域。

最近どんどん発展してきてるので、デザイン系は積極的に任せましょう。

## Webページにゲームを埋め込む

index.htmlをカスタマイズすると、**ゲームをWebページの一部として埋め込める**んです。

### 具体例

> ポートフォリオサイトにゲームを埋め込む
> ブログ記事の中でゲームを遊べるようにする
> ランディングページにデモゲームを設置

普通のWebサイトの中に、Unityゲームが表示される感じ。

### やり方

1. 自分のWebサイトのHTMLを用意
2. Unityのキャンバス部分を埋め込み
3. Build/フォルダのファイルも一緒にアップロード
4. ローダースクリプトを読み込む

AIに「このWebサイトにUnityゲームを埋め込んで」って言えば、コードを書いてくれます。

## カスタムテンプレートを作る

毎回カスタマイズするのが面倒なら、**カスタムテンプレート**を作っておくと便利です。

### テンプレートの場所

```
Assets/
└── WebGLTemplates/
    └── MyTemplate/
        ├── index.html
        └── TemplateData/
            ├── style.css
            ├── favicon.ico
            └── ...
```

`Assets/WebGLTemplates/`にフォルダを作って、カスタマイズしたindex.htmlを入れておく。

### ビルド時に選択

Player Settings > Resolution and Presentation > WebGL Template

ここで自分のテンプレートを選択できます。

Unity公式ドキュメント：
https://docs.unity3d.com/Manual/webgl-templates.html

## 簡単に公開する方法

WebGLビルドしたファイルは、ホスティングサービスで簡単に公開できます。

### Netlify

無料で使える。

ドラッグ&ドロップでアップロードするだけ。

https://www.netlify.com/

### Vercel

こちらも無料。

GitHubと連携すると自動デプロイもできる。

https://vercel.com/

### GitHub Pages

GitHubリポジトリから直接公開。

無料で使える。

https://pages.github.com/

### itch.io

ゲーム特化のプラットフォーム。

WebGLゲームをそのまま公開できる。

https://itch.io/

個人でも簡単にWebゲームを公開できる時代になりましたね。

## まとめ

Unity WebGLのindex.htmlをAIでカスタマイズする方法を紹介しました。

**できること**

- デザインを自分好みに変更
- ヘッダー、フッター、説明文の追加
- Webページにゲームを埋め込み
- カスタムテンプレートで再利用

**公開方法**

- Netlify、Vercel、GitHub Pages、itch.ioなど
- 無料で簡単に公開できる

WebGLビルドって、ただゲームを公開するだけじゃなくて、**Webサイトとして作り込める**のが面白いところ。

AIを使えば、デザインやコーディングの知識がなくても、いい感じのページが作れます。

もしやり方が分からない、サポートが欲しいという方は、お気軽にご相談ください。

**Unityでお困りのことはありませんか？**

画面共有で直接サポートします。

> ココナラ総取引235件
> プラチナランク
> 最高月収70万円

**ゲーム開発のご相談：**
https://coconala.com/services/3327092

**画面共有で開発相談：**
https://coconala.com/services/1475201

**チャットで開発相談（3日間）：**
https://coconala.com/services/1475203
