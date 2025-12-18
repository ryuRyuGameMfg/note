# Unity / C# 設計規則（Pure C#設計）

目的：AIに9割任せられるUnity開発を実現する。

## 設計思想（最重要）

### 原則：「MonoBehaviourは最小限、ロジックはPure C#」

- **MonoBehaviour**：Unityとの接点（入力/出力/ライフサイクル）だけに使う
- **Pure C#**：ビジネスロジック、スキル、ステート管理など
- **ScriptableObject**：設定データ（ステータス、パラメータ）

```
MonoBehaviour（少数）
    ↓ 依存性注入（DI）
Pure C#クラス（大量）← AIが書く
    ↓
ビジネスロジック
```

### なぜこの設計か

- Pure C#は「普通のオブジェクト指向」なのでAIが理解しやすい
- Unity特有の知識（SerializeField、Start/Awake、Update/FixedUpdate）が減る
- インスペクター設定が激減し、プレハブのコンフリクトも減る
- Unityエディタなしでユニットテスト可能

## フォルダ構成（推奨）

```
Assets/
├── Scripts/
│   ├── MonoBehaviours/     # MonoBehaviourはここだけ（少数）
│   │   ├── GameManager.cs
│   │   ├── PlayerManager.cs
│   │   └── UIManager.cs
│   │
│   ├── PureCS/             # Pure C#クラス（大量）← AIが書く
│   │   ├── Skills/
│   │   ├── States/
│   │   ├── Services/
│   │   └── Interfaces/
│   │
│   ├── ScriptableObjects/  # 設定データ
│   │   ├── SkillData/
│   │   └── GameSettings/
│   │
│   └── Common/             # 共通機能・ユーティリティ
│       ├── Extensions/
│       └── Helpers/
```

**ポイント**：`MonoBehaviours/` を分離して「MonoBehaviourは少なく保つ」意識を強制。

## コーディング規則

### 1. MonoBehaviour（少数）

- **役割**：Unityとの接点のみ
  - 入力取得（Input）
  - 物理演算（Rigidbody, Collider）
  - ライフサイクル（Start, Update）
  - UI連携（Canvas, Button）
- **ロジックを書かない**：Pure C#に委譲する
- **依存性注入**：Pure C#クラスを生成し、必要な参照を渡す

```csharp
// 悪い例：MonoBehaviourにロジックを書く
public class PlayerController : MonoBehaviour
{
    void Update()
    {
        // ロジックがMonoBehaviourに埋まっている
        if (Input.GetKeyDown(KeyCode.Space))
        {
            // 攻撃処理...（50行のロジック）
        }
    }
}

// 良い例：MonoBehaviourは入力だけ、ロジックはPure C#
public class PlayerController : MonoBehaviour
{
    private PlayerLogic _logic;

    void Awake()
    {
        _logic = new PlayerLogic();
    }

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space))
        {
            _logic.Attack();
        }
    }
}
```

### 2. Pure C#（大量）← AIに任せる

- **MonoBehaviourを継承しない**
- **インターフェースで責務を明確化**
- **依存は外から渡す（コンストラクタ or メソッド引数）**

```csharp
// インターフェース定義（人間が設計）
public interface ISkill
{
    string Name { get; }
    float Cooldown { get; }
    void Execute(ICharacter target);
}

// 実装（AIに任せる）
public class FireballSkill : ISkill
{
    public string Name => "Fireball";
    public float Cooldown => 3f;

    public void Execute(ICharacter target)
    {
        // AIが実装を書く
    }
}
```

### 3. ScriptableObject（設定データ）

- **ロジックを持たない**：データのみ
- **インスペクターで設定可能**：デザイナーとの協業に有効

```csharp
[CreateAssetMenu(fileName = "SkillData", menuName = "Game/SkillData")]
public class SkillData : ScriptableObject
{
    public string skillName;
    public float damage;
    public float cooldown;
    public Sprite icon;
}
```

## AIへの指示ルール（C#/Unity）

### AIに任せる領域

- Pure C#クラスの実装
- インターフェースに沿った新規クラス作成
- ユーティリティ/ヘルパー関数
- ユニットテスト

### 人間が握る領域

- インターフェース設計（責務の定義）
- MonoBehaviourの配置・シーン構成
- ScriptableObjectの構造設計
- フォルダ構成の決定

### AIへの指示例

```text
新しいスキル「IceSpear」を作成して。

要件：
- ISkillインターフェースを実装
- ダメージ: 50、クールダウン: 5秒
- 対象にスロウ効果を付与

配置先：Assets/Scripts/PureCS/Skills/IceSpearSkill.cs

既存の FireballSkill.cs を参考にして。
```

## 依存性注入（DI）の基本

### 考え方：「必要なものを外から渡す」

```csharp
// 悪い例：内部で依存を生成
public class GameManager
{
    private PlayerLogic _player = new PlayerLogic(); // 内部で生成
}

// 良い例：外から渡す（依存性注入）
public class GameManager
{
    private readonly IPlayerLogic _player;

    public GameManager(IPlayerLogic player) // 外から渡す
    {
        _player = player;
    }
}
```

### メリット

- テスト時にモックを渡せる
- クラスの責任が明確
- 依存関係が可視化される

### 参考

- VContainer（Unity向けDIコンテナ）：https://vcontainer.hadashikick.jp/
- Unity公式アーキテクチャガイド：https://unity.com/ja/how-to/how-architect-code-your-project-scales

## チェックリスト（C#/Unity）

### MonoBehaviour追加時

- [ ] 本当にMonoBehaviourが必要か？（Pure C#で代替できないか）
- [ ] ロジックをPure C#に分離したか？
- [ ] インスペクター設定は最小限か？

### Pure C#追加時

- [ ] インターフェースを定義したか？
- [ ] 依存は外から渡しているか？
- [ ] ユニットテスト可能な設計か？

### AIに依頼時

- [ ] インターフェース/責務を明確に伝えたか？
- [ ] 参考となる既存クラスを指定したか？
- [ ] 配置先（フォルダ/ファイル名）を指定したか？

## この設計が向いているプロジェクト

- 中〜大規模プロジェクト
- 長期メンテナンスが必要
- AIを活用して開発効率を上げたい
- チーム開発でコンフリクトを減らしたい

### 向いていないケース

- 1週間のゲームジャム（過剰設計）
- 超小規模プロトタイプ


## まとめ

- **MonoBehaviour**：Unityとの接点のみ（少数）
- **Pure C#**：ロジック全般（大量）← AIが書く
- **ScriptableObject**：設定データ
- **人間**：インターフェース設計、MonoBehaviour配置
- **AI**：Pure C#実装、テスト

