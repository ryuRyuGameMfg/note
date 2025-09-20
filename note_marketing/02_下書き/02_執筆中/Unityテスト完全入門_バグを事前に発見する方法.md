# Unityテスト完全入門：バグを事前に発見する方法

---

**ゲーム開発のご相談：**
https://ryuryugame.netlify.app/

**AI観光ガイドの導入：**
https://guidecastai.netlify.app/

---

## 「リリース後にバグ発見」を防ぐ最も確実な方法

リリース後にユーザーから「ログインできない」「スコアが保存されない」と報告される経験、ありませんか？

バグを事前に発見する最も確実な方法が**自動テスト**です。

この記事では、Unityでテストを書く方法と、ChatGPTと協業してテストコードを効率的に作成する手法を解説します。

## なぜテストが必要なのか

### 手動テストの限界

**手動テストの問題点：**
- 毎回同じ操作を繰り返す必要がある
- 人的ミスで見落としが発生する
- 時間がかかる
- 機能追加のたびに全体をテストし直す

**自動テストの利点：**
- 1クリックで全機能をテスト
- 常に同じ精度でテスト実行
- リファクタリングが安全になる
- バグを早期発見できる

### 料理で例えるテストの種類

#### 単体テスト：材料一つ一つの味見

```csharp
// 個別の関数をテスト
[Test]
public void CalculateDamage_正常値()
{
    int damage = BattleCalculator.CalculateDamage(攻撃力: 100, 防御力: 10);
    Assert.AreEqual(90, damage);
}
```

#### 統合テスト：完成した料理の味見

```csharp
// 複数のコンポーネントをまとめてテスト
[Test]
public void BattleSystem_攻撃から結果まで()
{
    var player = new Player(hp: 100, attack: 50);
    var enemy = new Enemy(hp: 100, defense: 10);
    var battle = new BattleManager(player, enemy);

    var result = battle.PlayerAttack();

    Assert.AreEqual(60, enemy.CurrentHP); // 50 - 10 = 40ダメージ
    Assert.IsTrue(result.IsSuccess);
}
```

## Unity Test Runnerのセットアップ

### 1. Test Runnerウィンドウを開く

```
Window > General > Test Runner
```

### 2. フォルダ構造を作成

```
Assets/
├── Scripts/
│   ├── Player.cs
│   ├── BattleManager.cs
│   └── SaveManager.cs
├── Tests/
│   ├── EditMode/      # エディタ上で実行されるテスト
│   │   ├── PlayerTests.cs
│   │   └── BattleManagerTests.cs
│   └── PlayMode/      # 実際にゲームを動かしながらのテスト
│       ├── SaveManagerTests.cs
│       └── UITests.cs
```

### 3. アセンブリ定義ファイルの作成

**Tests/EditMode/EditModeTests.asmdef：**
```json
{
    "name": "EditModeTests",
    "references": [
        "UnityEngine.TestRunner",
        "UnityEditor.TestRunner"
    ],
    "includePlatforms": [
        "Editor"
    ],
    "excludePlatforms": [],
    "allowUnsafeCode": false
}
```

## 基本的なテストの書き方

### プレイヤークラスのテスト

```csharp
using NUnit.Framework;
using UnityEngine;

public class PlayerTests
{
    [Test]
    public void Player_初期HP100()
    {
        // Arrange（準備）
        var player = new Player();

        // Act（実行）
        int hp = player.GetHP();

        // Assert（検証）
        Assert.AreEqual(100, hp);
    }

    [Test]
    public void Player_ダメージ受ける()
    {
        // Arrange
        var player = new Player();

        // Act
        player.TakeDamage(30);

        // Assert
        Assert.AreEqual(70, player.GetHP());
    }

    [Test]
    public void Player_HP0以下で死亡()
    {
        // Arrange
        var player = new Player();

        // Act
        player.TakeDamage(150); // HPを超過するダメージ

        // Assert
        Assert.AreEqual(0, player.GetHP());
        Assert.IsTrue(player.IsDead());
    }

    [Test]
    public void Player_負のダメージは回復()
    {
        // Arrange
        var player = new Player();
        player.TakeDamage(50); // HP 50に

        // Act
        player.TakeDamage(-20); // 負のダメージ（回復）

        // Assert
        Assert.AreEqual(70, player.GetHP());
    }
}
```

### バトル計算のテスト

```csharp
public class BattleCalculatorTests
{
    [Test]
    public void CalculateDamage_基本計算()
    {
        // 攻撃力100、防御力10の場合、90ダメージ
        int damage = BattleCalculator.CalculateDamage(100, 10);
        Assert.AreEqual(90, damage);
    }

    [Test]
    public void CalculateDamage_防御力の方が高い()
    {
        // 攻撃力50、防御力100の場合、最低1ダメージ
        int damage = BattleCalculator.CalculateDamage(50, 100);
        Assert.AreEqual(1, damage);
    }

    [Test]
    public void CalculateDamage_攻撃力0()
    {
        // 攻撃力0でも最低1ダメージ
        int damage = BattleCalculator.CalculateDamage(0, 10);
        Assert.AreEqual(1, damage);
    }

    [Test]
    public void CalculateDamage_負の値は例外()
    {
        // 負の値が入力された場合は例外を投げる
        Assert.Throws<System.ArgumentException>(() =>
        {
            BattleCalculator.CalculateDamage(-10, 10);
        });
    }
}
```

## テストのパターン

### 正常系テスト

期待通りに動作することを確認：

```csharp
[Test]
public void SaveData_正常保存()
{
    var saveData = new SaveData { level = 5, score = 1000 };
    var result = SaveManager.Save(saveData);
    Assert.IsTrue(result.IsSuccess);
}
```

### 異常系テスト

想定外の入力でも適切にエラーハンドリングされることを確認：

```csharp
[Test]
public void SaveData_null入力()
{
    var result = SaveManager.Save(null);
    Assert.IsFalse(result.IsSuccess);
    Assert.AreEqual("Invalid data", result.ErrorMessage);
}
```

### 境界値テスト

境界条件での動作を確認：

```csharp
[Test]
public void Player_HP上限チェック()
{
    var player = new Player(maxHP: 100);
    player.Heal(200); // 上限を超える回復

    Assert.AreEqual(100, player.GetHP()); // 上限で制限されることを確認
}
```

## PlayModeテストの実装

### UIコンポーネントのテスト

```csharp
using System.Collections;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;
using UnityEngine.UI;

public class UITests
{
    [UnityTest]
    public IEnumerator LoginButton_クリック後ローディング表示()
    {
        // プレハブからUIを生成
        var loginUIPrefab = Resources.Load<GameObject>("LoginUI");
        var loginUI = Object.Instantiate(loginUIPrefab);

        // コンポーネントを取得
        var loginButton = loginUI.GetComponent<Button>();
        var loadingIndicator = loginUI.transform.Find("LoadingIndicator").gameObject;

        // 初期状態ではローディングが非表示
        Assert.IsFalse(loadingIndicator.activeInHierarchy);

        // ボタンをクリック
        loginButton.onClick.Invoke();

        // 1フレーム待つ
        yield return null;

        // ローディングが表示されることを確認
        Assert.IsTrue(loadingIndicator.activeInHierarchy);

        // テスト後のクリーンアップ
        Object.DestroyImmediate(loginUI);
    }

    [UnityTest]
    public IEnumerator SaveButton_データ保存完了まで()
    {
        // セーブUIをセットアップ
        var saveUI = SetupSaveUI();
        var saveButton = saveUI.GetComponent<SaveButton>();

        // セーブボタンをクリック
        saveButton.OnClick();

        // セーブ処理完了まで待機（最大5秒）
        float timeout = 5f;
        float elapsed = 0f;

        while (!saveButton.IsSaveComplete && elapsed < timeout)
        {
            elapsed += Time.deltaTime;
            yield return null;
        }

        // セーブが完了していることを確認
        Assert.IsTrue(saveButton.IsSaveComplete);
        Assert.Less(elapsed, timeout, "セーブ処理がタイムアウトしました");

        CleanupSaveUI(saveUI);
    }

    private GameObject SetupSaveUI()
    {
        var prefab = Resources.Load<GameObject>("SaveUI");
        return Object.Instantiate(prefab);
    }

    private void CleanupSaveUI(GameObject ui)
    {
        Object.DestroyImmediate(ui);
    }
}
```

## API通信のテスト

### モックを使ったテスト

```csharp
public class APIClientTests
{
    private APIClient apiClient;
    private MockHttpClient mockHttpClient;

    [SetUp]
    public void Setup()
    {
        mockHttpClient = new MockHttpClient();
        apiClient = new APIClient(mockHttpClient);
    }

    [Test]
    public void GetUserData_成功レスポンス()
    {
        // モックレスポンスを設定
        mockHttpClient.SetResponse(200, @"
        {
            ""id"": 123,
            ""name"": ""テストユーザー"",
            ""level"": 5
        }");

        // APIを実行
        var result = apiClient.GetUserData(123);

        // 結果を検証
        Assert.IsTrue(result.IsSuccess);
        Assert.AreEqual(123, result.Data.id);
        Assert.AreEqual("テストユーザー", result.Data.name);
    }

    [Test]
    public void GetUserData_404エラー()
    {
        // 404レスポンスを設定
        mockHttpClient.SetResponse(404, "User not found");

        // APIを実行
        var result = apiClient.GetUserData(999);

        // エラーが正しくハンドリングされることを確認
        Assert.IsFalse(result.IsSuccess);
        Assert.AreEqual("User not found", result.ErrorMessage);
    }
}

// モッククラスの実装例
public class MockHttpClient : IHttpClient
{
    private int responseCode;
    private string responseBody;

    public void SetResponse(int code, string body)
    {
        responseCode = code;
        responseBody = body;
    }

    public HttpResponse Get(string url)
    {
        return new HttpResponse
        {
            StatusCode = responseCode,
            Body = responseBody
        };
    }
}
```

## テストデータの管理

### テスト用データの作成

```csharp
public class TestDataBuilder
{
    public static Player CreateTestPlayer(int hp = 100, int attack = 50)
    {
        return new Player
        {
            MaxHP = hp,
            CurrentHP = hp,
            Attack = attack
        };
    }

    public static SaveData CreateTestSaveData(int level = 1, int score = 0)
    {
        return new SaveData
        {
            PlayerName = "TestPlayer",
            Level = level,
            Score = score,
            SavedAt = System.DateTime.Now
        };
    }

    public static List<Enemy> CreateEnemyWave(int count = 3)
    {
        var enemies = new List<Enemy>();
        for (int i = 0; i < count; i++)
        {
            enemies.Add(new Enemy
            {
                Id = i + 1,
                Name = $"TestEnemy{i + 1}",
                HP = 50,
                Attack = 20
            });
        }
        return enemies;
    }
}

// 使用例
[Test]
public void Battle_プレイヤー勝利()
{
    var player = TestDataBuilder.CreateTestPlayer(hp: 100, attack: 60);
    var enemy = new Enemy { HP = 50, Attack = 10 };
    var battle = new BattleManager(player, enemy);

    var result = battle.ExecuteBattle();

    Assert.AreEqual(BattleResult.PlayerWin, result);
    Assert.IsTrue(player.IsAlive);
    Assert.IsFalse(enemy.IsAlive);
}
```

## 継続的インテグレーション（CI）での自動テスト

### Unity Cloud Build設定

`.github/workflows/test.yml`：
```yaml
name: Unity Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2

    - uses: game-ci/unity-test-runner@v2
      env:
        UNITY_LICENSE: ${{ secrets.UNITY_LICENSE }}
      with:
        projectPath: .
        testMode: all

    - name: Upload test results
      uses: actions/upload-artifact@v2
      if: always()
      with:
        name: Test results
        path: artifacts
```

## ChatGPTとテストの協業

### 効果的な質問例

**Before（曖昧な質問）：**
「テストコード書いて」

**After（具体的な質問）：**
「Unity C#で、プレイヤーのHP管理クラス `PlayerHealth` のテストコードを書きたいです。以下のメソッドをテストしたいです：
- `TakeDamage(int damage)` - ダメージを受ける
- `Heal(int amount)` - 回復する
- `IsAlive()` - 生存判定

正常系、異常系、境界値のテストケースを含めて、NUnit形式で作成してください。」

### ChatGPTに生成してもらうテスト例

```csharp
// ChatGPTに生成してもらったテストコード
[TestFixture]
public class PlayerHealthTests
{
    private PlayerHealth playerHealth;

    [SetUp]
    public void Setup()
    {
        playerHealth = new PlayerHealth(maxHP: 100);
    }

    [Test]
    public void TakeDamage_正常値()
    {
        playerHealth.TakeDamage(30);
        Assert.AreEqual(70, playerHealth.CurrentHP);
    }

    [Test]
    public void TakeDamage_HP0以下()
    {
        playerHealth.TakeDamage(150);
        Assert.AreEqual(0, playerHealth.CurrentHP);
        Assert.IsFalse(playerHealth.IsAlive());
    }

    [Test]
    public void Heal_正常回復()
    {
        playerHealth.TakeDamage(50);
        playerHealth.Heal(30);
        Assert.AreEqual(80, playerHealth.CurrentHP);
    }

    [TestCase(-10)]
    [TestCase(-100)]
    public void TakeDamage_負の値は例外(int damage)
    {
        Assert.Throws<ArgumentException>(() => playerHealth.TakeDamage(damage));
    }
}
```

## テストのベストプラクティス

### 1. テスト名は「何をテストしているか」明確に

```csharp
// ❌ 悪い例
[Test]
public void Test1() { }

// ⭕ 良い例
[Test]
public void Player_HPが0になると死亡状態になる() { }
```

### 2. Arrange-Act-Assert パターンを使う

```csharp
[Test]
public void SaveManager_データ保存成功()
{
    // Arrange（準備）
    var saveData = new SaveData { level = 5 };
    var saveManager = new SaveManager();

    // Act（実行）
    var result = saveManager.Save(saveData);

    // Assert（検証）
    Assert.IsTrue(result.IsSuccess);
}
```

### 3. テストは独立性を保つ

```csharp
// ❌ 悪い例：前のテストの結果に依存
[Test]
public void Test1()
{
    GlobalState.Value = 10;
}

[Test]
public void Test2()
{
    Assert.AreEqual(10, GlobalState.Value); // Test1に依存
}

// ⭕ 良い例：各テストで必要な状態を作る
[Test]
public void Test2()
{
    GlobalState.Value = 10; // 自分で状態を設定
    Assert.AreEqual(10, GlobalState.Value);
}
```

## まとめ

Unityテストを習得することで：

1. **バグを早期発見**できる
2. **リファクタリングが安全**になる
3. **ChatGPTとテスト駆動開発**ができる
4. **品質の高いゲーム**を効率的に開発できる

「手動で毎回確認」から「自動テストで品質保証」へ。

テストがあることで、安心してコードを改善し続けられる開発環境が手に入ります。

---

**ゲーム開発のご相談：**
https://ryuryugame.netlify.app/

**AI観光ガイドの導入：**
https://guidecastai.netlify.app/

---