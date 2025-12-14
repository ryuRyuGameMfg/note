# 【時短15分】macOSショートカットでUnityとCursorを5秒で開く方法｜忙しい個人開発者向け

## はじめに

こんにちは！ゲーム開発所RYURYUのりゅうやです。

Unityプロジェクトを開くたびに、Dockを探したり、Unity Hubを起動したり...

**「あれ、さっきのプロジェクトどこだっけ？」**

って、なりませんか？

今回は、macOS標準のショートカット機能を使って、UnityとCursorを**5秒で開く方法**を紹介します。

一度設定すれば、プロジェクトごとにワンボタンで開発環境が整います。

**ゲーム開発のご相談：**
https://coconala.com/services/3327092

## 問題：プロジェクト切り替えが面倒

個人開発者って、複数のプロジェクトを並行して進めますよね。

### よくある困りごと

> Dockからアプリを探す時間がもったいない
> Unity Hubを開いて、プロジェクトを選ぶのが面倒
> Cursorでフォルダを開く操作が手間
> ウィンドウを閉じると、また一からやり直し

特に、**案件を切り替えるたびにこの作業**をするのが、地味にストレスなんですよね。

### 時間の無駄が積み重なる

1回の起動に30秒かかるとして、1日10回切り替えると...

> 30秒 × 10回 = 5分

1ヶ月で2時間以上の無駄です。

## 解決策：macOSショートカットでランチャーを作る

macOS Monterey以降なら、標準の「ショートカット」アプリが使えます。

これを使って、**プロジェクト専用のランチャー**を作りましょう。

### メリット

> ワンクリックでUnityとCursorが同時起動
> プロジェクトごとにランチャーを作れる
> Spotlight検索から即起動
> キーボードショートカットにも割り当て可能

設定は15分で終わるので、今日から時短できます。

## 【Tip 1】ショートカットをプロジェクト専用ランチャーにする

### 基本の設定手順

**1. ショートカットアプリを開く**

Launchpadから「ショートカット」を起動。

**2. 新規ショートカットを作成**

左上の「+」ボタンをクリック。

**3. アクションを追加**

検索窓で「シェルスクリプトを実行」を検索して追加。

**4. シェルを設定**

シェルに `/bin/zsh` を指定。

「入力」は「なし」のまま。

**5. アイコンと名前を設定**

右上のアイコンをクリックして、プロジェクト名に合わせて変更。

色やアイコンを案件ごとに変えると、視覚的に分かりやすいです。

### 活用のコツ

> Dockやメニューバーにピン留め
> キーボードショートカットを追加
> ショートカット名に共通の接頭辞（例：「dev_」）を付けてSpotlight検索しやすく

## 【Tip 2】CursorとUnityを同時に呼び出すコマンド

ショートカットのスクリプト欄に、以下のコマンドを記述します。

### Cursorを開くコマンド

プロジェクトフォルダのパスを指定するだけ。

```bash
open -a "/Applications/Cursor.app" "/Users/okamotoryuya/プロジェクト/Obsidian Vault"
```

`/Users/okamotoryuya/プロジェクト/Obsidian Vault` の部分を、あなたのプロジェクトパスに変更してください。

### Unityを直接立ち上げるコマンド

Unity Hubを経由せず、直接Unityエディタを起動します。

```bash
open -a "/Applications/Unity/Hub/Editor/2022.3.0f1/Unity.app" --args -projectPath "/Users/okamotoryuya/UnityProjects/ProjectName"
```

**パスの調整が必要な箇所：**

> `/Applications/Unity/Hub/Editor/2022.3.0f1/Unity.app`：Unityのバージョンに合わせる
> `/Users/okamotoryuya/UnityProjects/ProjectName`：プロジェクトのパス

### 2つのコマンドを同時実行

この2行を同じショートカットに並べれば、ワンボタンでUnityとCursorが開きます。

```bash
open -a "/Applications/Cursor.app" "/Users/okamotoryuya/プロジェクト/MyGame"
open -a "/Applications/Unity/Hub/Editor/2022.3.0f1/Unity.app" --args -projectPath "/Users/okamotoryuya/UnityProjects/MyGame"
```

ウィンドウを閉じても、5秒で環境を復元できます。

## 【Tip 3】ウィジェットとショートカットキーで5秒起動を習慣化

### ウィジェットに配置

ホーム画面にショートカットのウィジェットを配置すると、デスクトップから指1本で起動できます。

**設定方法：**

1. デスクトップを右クリック
2. 「ウィジェット」→「ショートカット」を選択
3. よく使うプロジェクトを並べる

アイコンを案件ごとに色分けしておくと、視覚的に分かりやすいです。

### Quick Actionに登録

macOSのコントロールセンターから、ショートカットを即実行できます。

**設定方法：**

1. ショートカットアプリで対象を右クリック
2. 「Quick Actionとして追加」を選択

メニューバーから常に呼び出せるようになります。

### キーボードショートカットを割り当て

**最強の時短術**がこれ。

ショートカットアプリで、任意のキーを割り当てられます。

**設定方法：**

1. ショートカットを右クリック
2. 「キーボードショートカットを追加」
3. 好みのキーを設定（例：`Cmd + Shift + U`）

これで、どのアプリを使っていても、1キーでUnityとCursorが起動します。

## 実際の運用例

僕は、案件ごとにこんな感じで設定してます。

### プロジェクトA（ゲーム開発）

> ショートカット名：`dev_GameA`
> アイコン：赤
> キー：`Cmd + Shift + 1`

### プロジェクトB（Webアプリ）

> ショートカット名：`dev_WebB`
> アイコン：青
> キー：`Cmd + Shift + 2`

### プロジェクトC（Unity学習）

> ショートカット名：`dev_StudyC`
> アイコン：緑
> キー：`Cmd + Shift + 3`

Spotlightで「dev」って打てば、全部出てきます。

## 応用編：他のアプリも同時起動

Unityプロジェクトだと、他にも開くアプリありますよね。

### 例：Blenderも一緒に起動

```bash
open -a "/Applications/Blender.app"
open -a "/Applications/Cursor.app" "/Users/okamotoryuya/プロジェクト/MyGame"
open -a "/Applications/Unity/Hub/Editor/2022.3.0f1/Unity.app" --args -projectPath "/Users/okamotoryuya/UnityProjects/MyGame"
```

### 例：Chromeで参考サイトも開く

```bash
open -a "Google Chrome" https://docs.unity3d.com/
open -a "/Applications/Cursor.app" "/Users/okamotoryuya/プロジェクト/MyGame"
open -a "/Applications/Unity/Hub/Editor/2022.3.0f1/Unity.app" --args -projectPath "/Users/okamotoryuya/UnityProjects/MyGame"
```

作業に必要なものを、全部まとめて起動できちゃいます。

## よくある質問

### Q. Windowsでも使えますか？

残念ながら、この方法はmacOS専用です。

Windowsの場合は、PowerShellスクリプトやバッチファイルで同様のことができます。

### Q. Unityのバージョンはどうやって確認しますか？

Finderで以下のパスを開いてください。

```
/Applications/Unity/Hub/Editor/
```

インストールされているUnityのバージョンが、フォルダ名で確認できます。

### Q. ショートカットが動かない場合は？

以下を確認してください：

> Unityのパスが正しいか
> プロジェクトのパスが正しいか
> シェルが `/bin/zsh` になっているか

エラーが出る場合は、ターミナルで直接コマンドを実行して、エラーメッセージを確認しましょう。

## まとめ

macOSショートカットを使って、UnityとCursorを5秒で開く方法を紹介しました。

**やること**

1. ショートカットアプリで新規作成
2. シェルスクリプトに起動コマンドを記述
3. プロジェクトごとに複製してパスを変更
4. ウィジェット・Quick Action・キーボードショートカットで呼び出し

**メリット**

> プロジェクト切り替えが5秒
> 複数のアプリを同時起動
> ウィンドウを閉じても気軽に再起動
> CPU負荷とバッテリー消費を削減

設定は15分で終わります。

一度作れば、複製してパスを変えるだけで、どんなプロジェクトにも対応できます。

個人開発者の時短術として、ぜひ試してみてください。

**Unityの開発でお困りですか？**

ゲーム開発所RYURYUでは、Unityを使ったゲーム制作・アプリ開発を承っています。

**ゲーム開発のご相談：**
https://coconala.com/services/3327092

**初心者向け開発サポート：**
https://coconala.com/services/1475201

