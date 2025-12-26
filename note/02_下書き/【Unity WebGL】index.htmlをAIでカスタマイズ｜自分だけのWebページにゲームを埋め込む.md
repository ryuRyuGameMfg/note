# 【Unity WebGL】index.htmlをAIでカスタマイズ｜自分だけのWebページにゲームを埋め込む

「WebGLビルドのデフォルト画面が味気ない」「ポートフォリオにゲームを埋め込みたい」

この記事では、AIを使ってindex.htmlをカスタマイズし、自分好みのWebページにゲームを埋め込む方法を解説します。
HTMLの知識がなくても、AIに任せれば15分でプロっぽいページが作れます。

**ゲーム開発のご相談：**
https://coconala.com/services/3327092

## Unity WebGLビルドの仕組み

UnityでWebGLビルドすると、以下のファイルが出力されます。

出力ファイル：
- index.html：メインのHTMLファイル。ゲームのエントリーポイント
- Build/フォルダ：WebAssemblyやJavaScriptファイル。ゲームの本体
- TemplateData/フォルダ：ローディング画面の素材やCSS

index.htmlが、ゲームを読み込んで表示する役割を担っています。シンプルな構成なので、カスタマイズしやすいのが特徴です。

## デフォルトの問題点

UnityのWebGLビルドって、デフォルトだと味気ないんですよね。

デフォルトの見た目：
- 真っ白な背景
- ゲーム画面だけがポツンと表示
- タイトルや説明文なし
- デザイン性ゼロ

「せっかく作ったゲーム、もっとカッコよく見せたい！」って思いませんか？

## AIでカスタマイズする方法

AIを使えば、HTMLとCSSの知識がなくても、簡単にカスタマイズできます。

### ステップ1：ビルドしたindex.htmlを開く

普通にWebGLビルドして、出力されたindex.htmlをテキストエディタで開きます。VS CodeやCursorなど、お好みのエディタでOK。

### ステップ2：AIに渡す

CursorやClaude、ChatGPTなどに、index.htmlの内容を渡します。

プロンプト例：
```
このHTMLをカスタマイズして、以下のデザインにしてください：
- ヘッダーにゲームタイトルを表示
- 背景をグラデーションにする
- ゲーム画面の下に説明文を追加
- SNSシェアボタンを設置
```

具体的に指示するほど、思い通りの結果になります。

### ステップ3：カスタマイズ内容を適用

AIが出力したHTMLとCSSを、index.htmlに反映します。ブラウザで開いて確認しながら、微調整していきましょう。

## カスタマイズできること

AIを使えば、こんなカスタマイズが簡単にできます。

### ヘッダーを追加

ゲームタイトルやナビゲーションメニューを表示。

```html
<header>
  <h1>My Awesome Game</h1>
  <nav>
    <a href="#about">About</a>
    <a href="#play">Play</a>
  </nav>
</header>
```

### 背景デザインを変更

グラデーションや画像を背景に設定。

```css
body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### SNSシェアボタンを設置

Twitter、Facebook、LINEなどのシェアボタンを追加。

```html
<div class="share-buttons">
  <a href="https://twitter.com/intent/tweet?url=YOUR_URL">Tweet</a>
  <a href="https://www.facebook.com/sharer/sharer.php?u=YOUR_URL">Share</a>
</div>
```

### レスポンシブ対応

スマホでも見やすいレイアウトに。

```css
@media (max-width: 768px) {
  #unity-canvas {
    width: 100%;
    height: auto;
  }
}
```

HTMLとCSSは、AIがめちゃくちゃ得意な領域。デザインの知識がなくても、プロっぽいページが作れます。

## カスタムテンプレートを作る

毎回カスタマイズするのが面倒なら、カスタムテンプレートを作っておくと便利です。

### テンプレートの場所

Unityプロジェクト内に、以下のフォルダ構造を作成します。

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

### ビルド時に選択

Player Settings > Resolution and Presentation > WebGL Template

ここで自分のテンプレートを選択できます。一度作れば、次回からビルドするだけで、カスタマイズされたHTMLが出力されます。

Unity公式ドキュメント：
https://docs.unity3d.com/Manual/webgl-templates.html

## 公開方法

WebGLビルドしたファイルは、ホスティングサービスで簡単に公開できます。

### Netlify（おすすめ）

無料で使えて、操作も簡単。ドラッグ&ドロップでアップロードするだけ。

特徴：無料プランあり、独自ドメイン対応、HTTPS対応

公式サイト：
https://www.netlify.com/

### Vercel

GitHubと連携すると自動デプロイもできます。

特徴：無料プランあり、Git連携、高速CDN

公式サイト：
https://vercel.com/

### itch.io

ゲーム特化のプラットフォーム。WebGLゲームをそのまま公開できます。

特徴：ゲーマーが集まる、収益化も可能

公式サイト：
https://itch.io/

## Before/After

Before（デフォルト）：
- 真っ白な背景
- ゲーム画面のみ
- 説明文なし
- シェアボタンなし

After（カスタマイズ後）：
- ブランドカラーのグラデーション背景
- ヘッダーにタイトル
- ゲーム説明文
- SNSシェアボタン
- レスポンシブ対応

## デメリット・注意点

### スマホ対応の注意

WebGLはモバイル対応してますが、パフォーマンスに注意が必要です。軽量なゲームなら問題なく動きます。

### ファイルサイズ

WebGLビルドはファイルサイズが大きくなりがち。圧縮設定を適切に行ってください。

### ブラウザ互換性

古いブラウザでは動作しない場合があります。最新のChrome、Firefox、Safariを推奨。

## よくある質問

### Q. HTMLの知識がなくてもできますか？

はい、AIに任せれば大丈夫です。「こんな感じにして」って指示するだけで、コードを書いてくれます。

### Q. SEO対策はできますか？

HTMLをカスタマイズすれば、メタタグやOGP設定も追加できます。AIに「SEO対策してください」って言えば、必要なタグを追加してくれます。

### Q. 商用利用はできますか？

はい、Unityのライセンスに従えば、商用利用できます。

## まとめ

Unity WebGLのindex.htmlをAIでカスタマイズする方法を紹介しました。

できること：
- デザインを自分好みに変更
- ヘッダー、フッター、説明文の追加
- Webページにゲームを埋め込み
- カスタムテンプレートで再利用
- SNSシェアボタンやSEO対策

公開方法：
- Netlify、Vercel、GitHub Pages、itch.ioなど
- 無料で簡単に公開できる

WebGLビルドって、ただゲームを公開するだけじゃなくて、Webサイトとして作り込めるのが面白いところ。

皆さんはWebGLでどんな公開方法を使ってますか？おすすめがあればコメントで教えてください！

**Unityの開発でお困りですか？**

ゲーム開発所RYURYUでは、Unityを使ったゲーム制作・アプリ開発を承っています。

ココナラ総取引235件 / プラチナランク / 最高月収70万円

**ゲーム開発のご相談：**
https://coconala.com/services/3327092

**初心者向け開発サポート：**
https://coconala.com/services/1475201

#Unity #WebGL #ゲーム開発 #個人開発
