# 【Unity×AI】Pure C#設計でAIに9割任せる開発手法の提案

## はじめに

こんにちは！ゲーム開発所RYURYUのりゅうやです。

> 「インスペクターの設定、多すぎて管理できない...」
> 「MonoBehaviourが増えすぎてカオスになってる...」
> 「AIにコード書いてもらいたいけど、Unity特有の部分が多くて難しい...」

Unity開発してると、こういう悩みありませんか？

僕も昔はMonoBehaviourをバンバン作って、インスペクターで設定しまくってました。

でも、AI時代になって気づいたんです。

**MonoBehaviourを減らしてPure C#で書くと、AIに9割任せられる。**

ちなみに、Unity公式のMCPツールも試してみたんですが、正直まだ精度が高くない印象でした。だからこそ、**設計思想で解決する**方向に舵を切ったんです。

今回は、僕が実践してる「AI時代のUnity設計思想」を共有します。

**ゲーム開発のご相談：**
https://coconala.com/services/3327092

## そもそもMonoBehaviourって何？

Unity初心者の方向けに、まず基本を整理しますね。

**MonoBehaviour**は、Unityのゲームオブジェクトにアタッチできるコンポーネントの基底クラスです。

> Start()やUpdate()などのライフサイクルメソッドが使える
> インスペクターで値を設定できる
> GetComponentでオブジェクト間の参照ができる

Unityでゲームを作るとき、ほとんどの人がMonoBehaviourを使ってコードを書きます。

**でも、これが増えすぎると問題が起きるんです。**

## インスペクター地獄という問題

MonoBehaviourが増えると、インスペクターでの設定がどんどん増えます。

> プレイヤーにAttackBehaviourをアタッチ
> DefenseBehaviourもアタッチ
> SkillABehaviourもアタッチ
> SkillBBehaviourもアタッチ
> ...

気づいたら、1つのGameObjectに10個以上のコンポーネント。

しかも、それぞれにインスペクターで参照を設定しなきゃいけない。

**これ、人間がやる作業としては多すぎるんですよね。**

さらに、チームで開発してると「誰がどの設定を変えたか」が分からなくなる。

プレハブの設定がコンフリクトして、マージで地獄を見る。

**インスペクター地獄**、経験したことある人も多いんじゃないでしょうか。

## Pure C#設計という解決策

### Pure C#って何？

**Pure C#**とは、MonoBehaviourを継承しない、普通のC#クラスのことです。

```csharp
// これがMonoBehaviour
public class PlayerController : MonoBehaviour { }

// これがPure C#
public class PlayerLogic { }
```

Pure C#クラスは、Unityのライフサイクル（Start, Update）に依存しません。

だから、**Unityエディタなしでもテストできるし、AIも理解しやすい**んです。

### 設計思想

**MonoBehaviourは「Unityとの接点」だけに使う。**

ロジックはPure C#で書いて、MonoBehaviourから渡す（注入する）。

```
MonoBehaviour（少数）
    ↓ ロジックを渡す
Pure C#クラス（大量）
    ↓
ビジネスロジック、スキル、ステート管理など
```

これを**依存性注入（DI: Dependency Injection）**と呼びます。

## 依存性注入（DI）って何？

難しそうな名前ですが、考え方はシンプルです。

**「必要なものを外から渡す」**

これだけ。

### 例え話

レストランで料理を作るシェフを想像してください。

**依存性注入なし**

> シェフが自分で食材を買いに行く
> シェフが自分で調理器具を用意する
> シェフが自分でレシピを考える

**依存性注入あり**

> 食材は外から渡される
> 調理器具は外から渡される
> レシピは外から渡される
> シェフは「料理する」ことだけに集中

後者の方が、シェフの役割が明確ですよね。

プログラムも同じで、**必要なものを外から渡すことで、各クラスの責任が明確になる**んです。

### 詳しく学びたい方へ

依存性注入について詳しく知りたい方は、こちらの記事がおすすめです。

Unity向けDIコンテナ「VContainer」の解説：
https://vcontainer.hadashikick.jp/

Unity公式のアーキテクチャガイド：
https://unity.com/ja/how-to/how-architect-code-your-project-scales

## なぜAIに9割任せられるのか

### Pure C#はAIが理解しやすい

MonoBehaviourはUnity特有の知識が必要です。

> SerializeFieldの挙動
> StartとAwakeの違い
> UpdateとFixedUpdateの使い分け

でも、Pure C#は普通のオブジェクト指向プログラミング。

**AIは一般的なC#コードなら、めちゃくちゃ得意なんです。**

### インターフェースで責務が明確

```csharp
public interface ISkill
{
    void Execute();
}
```

これだけ見れば、AIは「スキルを実行する」って理解できる。

「新しいスキルを作って」って言えば、AIがISkillを実装したクラスを作ってくれる。

**人間はインターフェースを設計するだけ。実装はAIに任せる。**

### Unity MCPを試したけど...

ちなみに、CursorでUnity MCPも試してみました。

UnityエディタとAIを直接連携できるツールなんですが、正直まだ精度が高くない印象。

だからこそ、**ツールに頼るより設計で解決する**方が確実だと感じました。

Pure C#で書けば、どんなAIツールを使っても対応できますからね。

## 僕のプロジェクト構成

実際に僕がどうフォルダ分けしてるか紹介します。

```
Assets/
├── Scripts/
│   ├── MonoBehaviours/     # MonoBehaviourはここだけ
│   │   ├── GameManager.cs
│   │   ├── PlayerManager.cs
│   │   └── UIManager.cs
│   │
│   ├── PureCS/             # Pure C#クラス
│   │   ├── Skills/
│   │   ├── States/
│   │   └── Services/
│   │
│   ├── ScriptableObjects/  # 設定データ
│   │   ├── SkillData/
│   │   └── GameSettings/
│   │
│   └── Common/             # 共通機能・ユーティリティ
│       ├── Extensions/
│       └── Helpers/
```

ポイントは**MonoBehavioursフォルダを分離してること**。

こうすると、「MonoBehaviourは少なく保つ」という意識が自然と生まれます。

## ScriptableObjectとの組み合わせ

設定データはScriptableObjectで管理すると便利です。

**ScriptableObject**は、Unityのアセットとしてデータを保存できる仕組み。

インスペクターで設定できるけど、ロジックは持たない。

> スキルのダメージ値、クールダウン
> キャラクターのステータス
> ゲームの難易度設定

こういったデータをScriptableObjectに切り出すことで、**設定とロジックを分離**できます。

Unity公式の解説：
https://unity.com/ja/how-to/separate-game-data-logic-scriptable-objects

## この設計のメリットまとめ

**開発効率**
- インスペクター設定が激減
- AIが9割のコードを担当できる
- 設計に集中できる

**保守性**
- コードの責任が明確
- 変更の影響範囲が限定される
- チーム開発でコンフリクトしにくい

**テスト**
- Pure C#はユニットテストが簡単
- Unityエディタなしでテスト可能

## デメリット・注意点

正直に書きます。

### 学習コストがある

依存性注入やインターフェース設計は、最初は難しく感じるかもしれません。

でも、一度理解すれば開発効率は劇的に上がります。

### 小規模プロジェクトでは過剰かも

1週間で作るゲームジャムなら、MonoBehaviourベタ書きの方が早いこともあります。

**中〜大規模プロジェクト、または長期メンテナンスが必要な場合に特に効果的です。**

### Unityエディタとの連携が減る

インスペクターでの設定が減る分、デザイナーとの協業方法は工夫が必要です。

ScriptableObjectをうまく活用すると、この問題は緩和できます。

## まとめ

AI時代のUnity設計、ポイントをまとめます。

**考え方**
- MonoBehaviourは「Unityとの接点」だけに使う
- ロジックはPure C#で書く
- 依存性注入でMonoBehaviourとPure C#をつなぐ

**メリット**
- インスペクター設定が激減
- AIが9割のコードを担当できる
- テストが書きやすい

**こんな人におすすめ**
- インスペクター地獄から脱出したい
- AIを活用して開発効率を上げたい
- 保守しやすいコードを書きたい

僕はこの設計に変えてから、AIに「新しいスキル作って」「このロジック修正して」って言うだけで、ほとんどのコードが完成するようになりました。

**人間はインターフェース設計と、MonoBehaviourの設置だけ。**

ぜひ試してみてください！

**Unityの開発でお困りですか？**

ゲーム開発所RYURYUでは、Unityを使ったゲーム制作・アプリ開発を承っています。

> ココナラ総取引235件
> プラチナランク
> 最高月収70万円

**ゲーム開発のご相談：**
https://coconala.com/services/3327092

**初心者向け開発サポート：**
https://coconala.com/services/1475201

