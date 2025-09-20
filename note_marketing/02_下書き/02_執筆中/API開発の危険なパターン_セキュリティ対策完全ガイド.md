# API開発の危険なパターン：セキュリティ対策完全ガイド

---

**ゲーム開発のご相談：**
https://ryuryugame.netlify.app/

**AI観光ガイドの導入：**
https://guidecastai.netlify.app/

---

## 「セキュリティは後で」が致命的な理由

「まずは動くものを作って、セキュリティは後で考えよう」

この考え方で開発を進めた結果、こんな事態が起きています：

- **APIキー漏洩**で月額10万円の請求
- **パスワード平文保存**でアカウント情報流出
- **認証不備**で他人のデータ閲覧可能

この記事では、API開発で起こりがちなセキュリティ問題と、その対策方法を解説します。

## やってはいけないパターン1：APIキーをコードに直書き

### 危険なコード例

```csharp
public class APIManager : MonoBehaviour
{
    // ❌ 絶対にやってはいけない
    private string apiKey = "sk-proj-abcd1234efgh5678ijkl9012mnop3456qrst7890uvwxyz";

    void Start()
    {
        CallAPI(apiKey);
    }
}
```

### なぜ危険なのか

1. **GitHubに公開される**
   - リポジトリが public の場合、世界中に APIキーが公開
   - private でも、コラボレーターや将来の公開で漏洩リスク

2. **デコンパイル可能**
   - ビルドしたゲームからAPIキーを抽出される可能性
   - Unity の IL2CPP でも完全に隠蔽はできない

3. **ログやデバッグ情報から漏洩**
   - Debug.Log に含まれる
   - クラッシュレポートに含まれる

### 安全な管理方法

#### 1. 環境変数を使用

```csharp
public class SecureAPIManager : MonoBehaviour
{
    private string apiKey;

    void Start()
    {
        // 環境変数から取得
        apiKey = System.Environment.GetEnvironmentVariable("OPENAI_API_KEY");

        if (string.IsNullOrEmpty(apiKey))
        {
            Debug.LogError("API Key not found in environment variables");
            return;
        }

        CallAPI(apiKey);
    }
}
```

#### 2. Unity の ScriptableObject を使用

```csharp
[CreateAssetMenu(fileName = "APIConfig", menuName = "Config/API Config")]
public class APIConfig : ScriptableObject
{
    [SerializeField] private string apiKey;

    public string GetAPIKey()
    {
        return apiKey;
    }
}

// .gitignore に APIConfig.asset を追加
// Resources/APIConfig.asset
```

#### 3. サーバー経由でAPIキーを管理

```csharp
public class ProxyAPIManager : MonoBehaviour
{
    public IEnumerator CallSecureAPI(string userData)
    {
        // 自前のサーバー経由でAPIを呼び出し
        string url = "https://your-server.com/api/proxy";

        using (UnityWebRequest request = UnityWebRequest.Post(url, userData))
        {
            // サーバー側でAPIキーを管理
            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                Debug.Log("API call successful");
            }
        }
    }
}
```

## やってはいけないパターン2：HTTP通信（暗号化なし）

### 危険なコード例

```csharp
// ❌ HTTP（暗号化されていない）
string apiUrl = "http://api.example.com/login";

var loginData = new {
    username = "user123",
    password = "secretpassword"
};
```

### なぜ危険なのか

1. **通信内容が丸見え**
   - パケット解析でパスワードが読み取られる
   - WiFi の盗聴で情報が漏洩

2. **中間者攻撃の対象**
   - 偽のサーバーにデータを送信してしまう
   - レスポンスを改ざんされる可能性

### 安全な通信方法

```csharp
public class SecureCommunication : MonoBehaviour
{
    public IEnumerator SecureLogin(string username, string password)
    {
        // ⭕ HTTPS を使用（暗号化される）
        string apiUrl = "https://api.example.com/login";

        var loginData = new {
            username = username,
            // パスワードはハッシュ化してから送信が理想
            password = HashPassword(password)
        };

        string json = JsonUtility.ToJson(loginData);
        byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(json);

        using (UnityWebRequest request = new UnityWebRequest(apiUrl, "POST"))
        {
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                Debug.Log("Secure login successful");
            }
        }
    }

    private string HashPassword(string password)
    {
        using (var sha256 = System.Security.Cryptography.SHA256.Create())
        {
            byte[] hashedBytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            return System.Convert.ToBase64String(hashedBytes);
        }
    }
}
```

## やってはいけないパターン3：認証・認可の不備

### 危険なコード例

```csharp
// ❌ ユーザーIDをそのままURLに使用
public IEnumerator GetUserProfile(int userId)
{
    string url = $"https://api.example.com/users/{userId}/profile";

    using (UnityWebRequest request = UnityWebRequest.Get(url))
    {
        // 認証情報なし！
        yield return request.SendWebRequest();

        if (request.result == UnityWebRequest.Result.Success)
        {
            Debug.Log(request.downloadHandler.text);
        }
    }
}

// 他人のuserIdを指定すれば、他人の情報が見えてしまう
```

### 安全な認証実装

#### JWT トークンを使った認証

```csharp
public class AuthenticatedAPIClient : MonoBehaviour
{
    private string jwtToken;

    public IEnumerator Login(string username, string password)
    {
        string url = "https://api.example.com/auth/login";

        var loginData = new {
            username = username,
            password = password
        };

        string json = JsonUtility.ToJson(loginData);
        byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(json);

        using (UnityWebRequest request = new UnityWebRequest(url, "POST"))
        {
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                var response = JsonUtility.FromJson<LoginResponse>(request.downloadHandler.text);
                jwtToken = response.access_token;
                Debug.Log("Login successful");
            }
        }
    }

    public IEnumerator GetMyProfile()  // 「自分の」プロフィールのみ取得
    {
        if (string.IsNullOrEmpty(jwtToken))
        {
            Debug.LogError("Not authenticated. Please login first.");
            yield break;
        }

        string url = "https://api.example.com/me/profile";  // /me エンドポイント使用

        using (UnityWebRequest request = UnityWebRequest.Get(url))
        {
            // JWT トークンを Authorization ヘッダーで送信
            request.SetRequestHeader("Authorization", $"Bearer {jwtToken}");

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                Debug.Log("Profile: " + request.downloadHandler.text);
            }
            else if (request.responseCode == 401)
            {
                Debug.LogError("Unauthorized. Token may be expired.");
                // 再ログインを促す
            }
        }
    }

    [System.Serializable]
    public class LoginResponse
    {
        public string access_token;
        public string token_type;
        public int expires_in;
    }
}
```

#### セッション管理の実装

```csharp
public class SessionManager : MonoBehaviour
{
    private static SessionManager instance;
    private string accessToken;
    private System.DateTime tokenExpiry;

    public static SessionManager Instance
    {
        get
        {
            if (instance == null)
            {
                instance = FindObjectOfType<SessionManager>();
                if (instance == null)
                {
                    GameObject go = new GameObject("SessionManager");
                    instance = go.AddComponent<SessionManager>();
                    DontDestroyOnLoad(go);
                }
            }
            return instance;
        }
    }

    public void SetToken(string token, int expiresInSeconds)
    {
        accessToken = token;
        tokenExpiry = System.DateTime.Now.AddSeconds(expiresInSeconds);
    }

    public string GetValidToken()
    {
        if (string.IsNullOrEmpty(accessToken))
        {
            Debug.LogWarning("No access token available");
            return null;
        }

        if (System.DateTime.Now >= tokenExpiry)
        {
            Debug.LogWarning("Access token has expired");
            return null;
        }

        return accessToken;
    }

    public bool IsAuthenticated()
    {
        return !string.IsNullOrEmpty(GetValidToken());
    }

    public void ClearSession()
    {
        accessToken = null;
        tokenExpiry = default(System.DateTime);
    }
}
```

## やってはいけないパターン4：入力値検証の不備

### SQL インジェクション対策

```csharp
// ❌ 危険：文字列連結によるクエリ構築
public string GetUserData(string username)
{
    // SQLインジェクション攻撃を受ける可能性
    string query = $"SELECT * FROM users WHERE username = '{username}'";
    return ExecuteQuery(query);
}

// ⭕ 安全：パラメータ化クエリ
public string GetUserDataSafe(string username)
{
    string query = "SELECT * FROM users WHERE username = @username";
    var parameters = new Dictionary<string, object>
    {
        {"@username", username}
    };
    return ExecuteParameterizedQuery(query, parameters);
}
```

### Unity での入力検証

```csharp
public class InputValidator
{
    public static bool IsValidEmail(string email)
    {
        if (string.IsNullOrEmpty(email))
            return false;

        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }

    public static bool IsValidUsername(string username)
    {
        if (string.IsNullOrEmpty(username))
            return false;

        // 英数字とアンダースコアのみ、3文字以上20文字以下
        return System.Text.RegularExpressions.Regex.IsMatch(username, @"^[a-zA-Z0-9_]{3,20}$");
    }

    public static bool IsStrongPassword(string password)
    {
        if (string.IsNullOrEmpty(password) || password.Length < 8)
            return false;

        // 大文字、小文字、数字、特殊文字を含む
        bool hasUpper = System.Text.RegularExpressions.Regex.IsMatch(password, @"[A-Z]");
        bool hasLower = System.Text.RegularExpressions.Regex.IsMatch(password, @"[a-z]");
        bool hasDigit = System.Text.RegularExpressions.Regex.IsMatch(password, @"[0-9]");
        bool hasSpecial = System.Text.RegularExpressions.Regex.IsMatch(password, @"[^A-Za-z0-9]");

        return hasUpper && hasLower && hasDigit && hasSpecial;
    }

    public static string SanitizeInput(string input)
    {
        if (string.IsNullOrEmpty(input))
            return string.Empty;

        // HTML/Script タグを無効化
        return input.Replace("<", "&lt;").Replace(">", "&gt;").Replace("\"", "&quot;");
    }
}

// 使用例
public class SafeUserRegistration : MonoBehaviour
{
    public void RegisterUser(string username, string email, string password)
    {
        // 入力値検証
        if (!InputValidator.IsValidUsername(username))
        {
            Debug.LogError("Invalid username format");
            return;
        }

        if (!InputValidator.IsValidEmail(email))
        {
            Debug.LogError("Invalid email format");
            return;
        }

        if (!InputValidator.IsStrongPassword(password))
        {
            Debug.LogError("Password does not meet security requirements");
            return;
        }

        // サニタイズ処理
        username = InputValidator.SanitizeInput(username);
        email = InputValidator.SanitizeInput(email);

        // 安全な登録処理を実行
        StartCoroutine(SendRegistrationRequest(username, email, password));
    }
}
```

## レート制限とDDoS対策

### クライアント側でのレート制限

```csharp
public class RateLimitedAPIClient : MonoBehaviour
{
    private Dictionary<string, System.DateTime> lastRequestTime = new Dictionary<string, System.DateTime>();
    private readonly float minIntervalSeconds = 1.0f; // 1秒間に1リクエストまで

    public IEnumerator CallAPIWithRateLimit(string endpoint, string data)
    {
        // 前回のリクエスト時刻をチェック
        if (lastRequestTime.ContainsKey(endpoint))
        {
            var timeSinceLastRequest = System.DateTime.Now - lastRequestTime[endpoint];
            if (timeSinceLastRequest.TotalSeconds < minIntervalSeconds)
            {
                float waitTime = minIntervalSeconds - (float)timeSinceLastRequest.TotalSeconds;
                Debug.Log($"Rate limiting: waiting {waitTime} seconds");
                yield return new WaitForSeconds(waitTime);
            }
        }

        // リクエスト時刻を記録
        lastRequestTime[endpoint] = System.DateTime.Now;

        // 実際のAPI呼び出し
        yield return CallAPI(endpoint, data);
    }

    private IEnumerator CallAPI(string endpoint, string data)
    {
        using (UnityWebRequest request = UnityWebRequest.Post(endpoint, data))
        {
            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                Debug.Log("API call successful");
            }
            else if (request.responseCode == 429) // Too Many Requests
            {
                Debug.LogWarning("Rate limit exceeded by server");
                // 指数バックオフで再試行
                yield return new WaitForSeconds(UnityEngine.Random.Range(1f, 3f));
            }
        }
    }
}
```

## ログとモニタリング

### セキュアなログ出力

```csharp
public class SecureLogger : MonoBehaviour
{
    private const string MASK_VALUE = "[MASKED]";

    public static void LogAPIRequest(string endpoint, string requestData)
    {
        // 機密情報をマスクしてからログ出力
        string maskedData = MaskSensitiveData(requestData);
        Debug.Log($"API Request to {endpoint}: {maskedData}");
    }

    public static void LogAPIResponse(string endpoint, int statusCode, string responseData)
    {
        string maskedResponse = MaskSensitiveData(responseData);
        Debug.Log($"API Response from {endpoint} ({statusCode}): {maskedResponse}");
    }

    private static string MaskSensitiveData(string data)
    {
        if (string.IsNullOrEmpty(data))
            return data;

        // パスワード、トークン、APIキーなどをマスク
        data = System.Text.RegularExpressions.Regex.Replace(data, @"""password""\s*:\s*""[^""]*""", $"\"password\":\"{MASK_VALUE}\"");
        data = System.Text.RegularExpressions.Regex.Replace(data, @"""token""\s*:\s*""[^""]*""", $"\"token\":\"{MASK_VALUE}\"");
        data = System.Text.RegularExpressions.Regex.Replace(data, @"""api_key""\s*:\s*""[^""]*""", $"\"api_key\":\"{MASK_VALUE}\"");

        return data;
    }

    public static void LogSecurityEvent(string eventType, string details)
    {
        Debug.LogWarning($"SECURITY EVENT - {eventType}: {details}");

        // 重要なセキュリティイベントは外部サービスに送信
        // SendToSecurityMonitoringService(eventType, details);
    }
}

// 使用例
public class MonitoredAPIClient : MonoBehaviour
{
    public IEnumerator Login(string username, string password)
    {
        var loginData = new { username = username, password = password };
        string jsonData = JsonUtility.ToJson(loginData);

        SecureLogger.LogAPIRequest("/auth/login", jsonData);

        using (UnityWebRequest request = UnityWebRequest.Post("/auth/login", jsonData))
        {
            yield return request.SendWebRequest();

            SecureLogger.LogAPIResponse("/auth/login", (int)request.responseCode, request.downloadHandler.text);

            if (request.result != UnityWebRequest.Result.Success)
            {
                SecureLogger.LogSecurityEvent("LOGIN_FAILED", $"Username: {username}");
            }
        }
    }
}
```

## セキュリティチェックリスト

### 開発段階

- [ ] APIキーは環境変数やサーバー経由で管理
- [ ] すべての通信でHTTPS使用
- [ ] パスワードはハッシュ化して保存
- [ ] JWT等による適切な認証・認可
- [ ] 入力値検証とサニタイズ処理
- [ ] SQLインジェクション対策
- [ ] XSS対策
- [ ] CSRF対策

### 運用段階

- [ ] レート制限の実装
- [ ] ログとモニタリング
- [ ] 定期的なセキュリティ監査
- [ ] 脆弱性情報の確認
- [ ] インシデント対応計画

### コード管理

- [ ] .gitignoreで機密情報を除外
- [ ] コードレビューでセキュリティチェック
- [ ] 定期的な依存関係の更新
- [ ] セキュリティテストの自動化

## ChatGPTとセキュリティ

### 効果的な質問例

**Before（危険な質問）：**
「API通信のコード書いて」

**After（セキュアな質問）：**
「Unity C#で、JWTトークン認証を使用した安全なAPI通信クライアントを実装したいです。以下の要件を満たしてください：
- HTTPS通信のみ
- トークンの期限切れチェック
- レート制限対応
- 機密情報のログマスキング
- 入力値検証
エラーハンドリングも含めて実装例を教えてください。」

### セキュリティレビューの依頼

```
「以下のAPIクライアントコードのセキュリティ上の問題点と改善案を教えてください：
[コードを貼り付け]

特に以下の観点でチェックしてください：
- 機密情報の露出リスク
- 認証・認可の不備
- 入力値検証の不足
- 通信セキュリティの問題」
```

## まとめ

API開発のセキュリティ対策は：

1. **設計段階から考慮する**ことが最重要
2. **小さな油断が大きな被害**につながる
3. **ChatGPTと協業**してセキュアなコードを作成
4. **継続的な監視と改善**が必要

「動けばOK」から「安全に動くコード」へ。

セキュリティ意識を持って開発することで、ユーザーからの信頼を得られるサービスを作ることができます。

---

**ゲーム開発のご相談：**
https://ryuryugame.netlify.app/

**AI観光ガイドの導入：**
https://guidecastai.netlify.app/

---