# リクエストヘッダー完全ガイド：API通信エラー解決法

---

**ゲーム開発のご相談：**
https://ryuryugame.netlify.app/

**AI観光ガイドの導入：**
https://guidecastai.netlify.app/

---

## 「Content-Type設定し忘れ」で3時間ハマった経験

Unity でAPI通信を実装していて、こんなエラーに遭遇したことはありませんか？

```
400 Bad Request: Invalid request format
401 Unauthorized: Authentication failed
415 Unsupported Media Type
```

原因の多くは**リクエストヘッダーの設定ミス**です。

この記事では、API通信でよく使うヘッダーの役割と正しい設定方法を解説します。

## リクエストヘッダーとは「通信の身分証明書」

郵便物を送る時、封筒に以下を書きますよね：

- **宛先**（どこに送るか）
- **差出人**（誰から送るか）
- **内容物の種類**（書類なのか、商品なのか）

HTTPリクエストでも同様に、「誰が」「何を」「どう送るか」の情報を**ヘッダー**に記載します。

### HTTPリクエストの構造

```
POST /api/users HTTP/1.1              ← リクエストライン
Host: api.example.com                 ← ヘッダー1
Content-Type: application/json        ← ヘッダー2
Authorization: Bearer abc123xyz       ← ヘッダー3
                                      ← 空行
{"name": "山田太郎", "age": 25}        ← ボディ
```

## よく使われるヘッダーの解説

### Content-Type：「これは何のデータです」宣言

**役割：**送信するデータの形式を指定

**よく使う値：**

```
application/json       # JSONデータ
application/xml        # XMLデータ
text/plain            # プレーンテキスト
multipart/form-data   # ファイルアップロード
application/x-www-form-urlencoded  # HTMLフォームデータ
```

**設定例（Unity）：**
```csharp
request.SetRequestHeader("Content-Type", "application/json");
```

### Authorization：「私は○○です」の証明

**役割：**認証情報を送信

**よく使うパターン：**

```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # JWTトークン
Basic dXNlcm5hbWU6cGFzc3dvcmQ=                    # Base64エンコードされたユーザー名:パスワード
```

**設定例（Unity）：**
```csharp
string token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
request.SetRequestHeader("Authorization", $"Bearer {token}");
```

### User-Agent：「○○から来ました」の挨拶

**役割：**クライアントアプリケーションの識別

**例：**
```
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
Unity/2022.3.0f1 (UnityWebRequest)
MyGame/1.2.3 (Unity; iOS)
```

**設定例（Unity）：**
```csharp
request.SetRequestHeader("User-Agent", "MyGame/1.0.0 (Unity/2022.3)");
```

### Accept：「この形式で返してください」のリクエスト

**役割：**受け取りたいレスポンスの形式を指定

**例：**
```
application/json    # JSONで返してほしい
text/html          # HTMLで返してほしい
*/*               # どの形式でもOK
```

## Unity/C#での実装例

### 基本的なPOSTリクエスト

```csharp
using UnityEngine;
using UnityEngine.Networking;
using System.Collections;

public class APIClient : MonoBehaviour
{
    [System.Serializable]
    public class UserData
    {
        public string name;
        public int age;
        public string email;
    }

    public IEnumerator PostUserData(UserData userData)
    {
        string url = "https://api.example.com/users";
        string jsonData = JsonUtility.ToJson(userData);
        byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(jsonData);

        using (UnityWebRequest request = new UnityWebRequest(url, "POST"))
        {
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();

            // 重要なヘッダー設定
            request.SetRequestHeader("Content-Type", "application/json");
            request.SetRequestHeader("Accept", "application/json");
            request.SetRequestHeader("User-Agent", "MyUnityGame/1.0");

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                Debug.Log($"Success: {request.downloadHandler.text}");
            }
            else
            {
                Debug.LogError($"Error: {request.responseCode} - {request.error}");
                Debug.LogError($"Response: {request.downloadHandler.text}");
            }
        }
    }
}
```

### 認証付きリクエスト

```csharp
public class AuthenticatedAPIClient : MonoBehaviour
{
    private string accessToken = "";

    public IEnumerator LoginAndGetToken(string username, string password)
    {
        string url = "https://api.example.com/auth/login";

        var loginData = new
        {
            username = username,
            password = password
        };

        string jsonData = JsonUtility.ToJson(loginData);
        byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(jsonData);

        using (UnityWebRequest request = new UnityWebRequest(url, "POST"))
        {
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                string response = request.downloadHandler.text;
                // レスポンスからトークンを抽出（実際の実装では適切にパースする）
                var responseData = JsonUtility.FromJson<LoginResponse>(response);
                accessToken = responseData.access_token;
                Debug.Log("ログイン成功");
            }
        }
    }

    public IEnumerator GetProtectedData()
    {
        if (string.IsNullOrEmpty(accessToken))
        {
            Debug.LogError("アクセストークンがありません。先にログインしてください。");
            yield break;
        }

        string url = "https://api.example.com/protected/data";

        using (UnityWebRequest request = UnityWebRequest.Get(url))
        {
            // 認証ヘッダーを設定
            request.SetRequestHeader("Authorization", $"Bearer {accessToken}");
            request.SetRequestHeader("Accept", "application/json");

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                Debug.Log($"Protected Data: {request.downloadHandler.text}");
            }
            else
            {
                Debug.LogError($"認証エラー: {request.responseCode}");
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

## よくあるヘッダー関連エラーと解決法

### エラー1: 415 Unsupported Media Type

**原因：**Content-Typeが設定されていない、または間違っている

**問題のあるコード：**
```csharp
// Content-Type未設定
using (UnityWebRequest request = new UnityWebRequest(url, "POST"))
{
    request.uploadHandler = new UploadHandlerRaw(bodyRaw);
    // ヘッダー設定がない！
    yield return request.SendWebRequest();
}
```

**解決法：**
```csharp
request.SetRequestHeader("Content-Type", "application/json");
```

### エラー2: 401 Unauthorized

**原因：**認証ヘッダーが設定されていない、またはトークンが間違っている

**問題のあるコード：**
```csharp
// 認証が必要なAPIに認証情報なしでアクセス
using (UnityWebRequest request = UnityWebRequest.Get(protectedUrl))
{
    // Authorizationヘッダーがない！
    yield return request.SendWebRequest();
}
```

**解決法：**
```csharp
request.SetRequestHeader("Authorization", $"Bearer {validToken}");
```

### エラー3: 400 Bad Request (CORS関連)

**原因：**クロスオリジンリクエストで必要なヘッダーが不足

**解決法：**
```csharp
request.SetRequestHeader("Access-Control-Request-Method", "POST");
request.SetRequestHeader("Access-Control-Request-Headers", "Content-Type, Authorization");
```

## カスタムヘッダーの設定

### APIキーを使った認証

```csharp
public class APIKeyClient : MonoBehaviour
{
    private const string API_KEY = "your-api-key-here";

    public IEnumerator GetDataWithAPIKey()
    {
        string url = "https://api.example.com/data";

        using (UnityWebRequest request = UnityWebRequest.Get(url))
        {
            // APIキーを独自ヘッダーで送信
            request.SetRequestHeader("X-API-Key", API_KEY);
            request.SetRequestHeader("Accept", "application/json");

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                Debug.Log(request.downloadHandler.text);
            }
        }
    }
}
```

### リクエスト追跡用ヘッダー

```csharp
public IEnumerator PostDataWithTracking(string data)
{
    string url = "https://api.example.com/data";
    string requestId = System.Guid.NewGuid().ToString();

    using (UnityWebRequest request = new UnityWebRequest(url, "POST"))
    {
        // デバッグ・ログ用のリクエストID
        request.SetRequestHeader("X-Request-ID", requestId);
        request.SetRequestHeader("X-Client-Version", "1.0.0");
        request.SetRequestHeader("Content-Type", "application/json");

        Debug.Log($"Request ID: {requestId}");

        // リクエスト処理...
        yield return request.SendWebRequest();
    }
}
```

## レスポンスヘッダーの確認方法

デバッグ時にはレスポンスヘッダーも重要です：

```csharp
public IEnumerator DebugRequest()
{
    string url = "https://api.example.com/test";

    using (UnityWebRequest request = UnityWebRequest.Get(url))
    {
        yield return request.SendWebRequest();

        // レスポンスヘッダーをログ出力
        var headers = request.GetResponseHeaders();
        if (headers != null)
        {
            foreach (var header in headers)
            {
                Debug.Log($"Response Header: {header.Key} = {header.Value}");
            }
        }

        // 特定のヘッダーの確認
        string contentType = request.GetResponseHeader("Content-Type");
        Debug.Log($"Content-Type: {contentType}");
    }
}
```

## ブラウザの開発者ツールでのヘッダー確認

デバッグ時の強い味方：

1. **Chrome Dev Tools**を開く（F12）
2. **Network**タブに移動
3. APIリクエストを実行
4. 送信されたリクエストをクリック
5. **Headers**タブで確認

**確認できる情報：**
- Request Headers（送信したヘッダー）
- Response Headers（サーバーからの返答ヘッダー）
- Status Code（ステータスコード）

## セキュリティ上の注意点

### 機密情報をヘッダーに含める際の注意

```csharp
// ❌ 良くない例：APIキーをURLに含める
string url = "https://api.example.com/data?api_key=secret123";

// ⭕ 良い例：APIキーはヘッダーに含める
request.SetRequestHeader("Authorization", "Bearer secret123");
```

### ヘッダーのログ出力時の注意

```csharp
public void LogHeaders(UnityWebRequest request)
{
    foreach (var header in request.GetRequestHeaders())
    {
        // 機密情報をログに出力しないように注意
        if (header.Key.ToLower().Contains("authorization") ||
            header.Key.ToLower().Contains("api-key"))
        {
            Debug.Log($"{header.Key}: [MASKED]");
        }
        else
        {
            Debug.Log($"{header.Key}: {header.Value}");
        }
    }
}
```

## ChatGPTとの効果的な質問例

### Before（曖昧な質問）
「API通信でエラーが出ます。直してください。」

### After（具体的な質問）
「Unity WebRequestでPOSTリクエストを送信すると415 Unsupported Media Typeエラーが返されます。JSONデータを送信したいのですが、Content-Typeヘッダーの設定方法と、その他に必要なヘッダーがあれば教えてください。」

## 実践的なヘッダー管理クラス

```csharp
public static class APIHeaders
{
    private static string authToken = "";

    public static void SetAuthToken(string token)
    {
        authToken = token;
    }

    public static void ApplyStandardHeaders(UnityWebRequest request)
    {
        request.SetRequestHeader("User-Agent", "MyGame/1.0 (Unity)");
        request.SetRequestHeader("Accept", "application/json");

        if (!string.IsNullOrEmpty(authToken))
        {
            request.SetRequestHeader("Authorization", $"Bearer {authToken}");
        }
    }

    public static void ApplyJSONHeaders(UnityWebRequest request)
    {
        ApplyStandardHeaders(request);
        request.SetRequestHeader("Content-Type", "application/json");
    }

    public static void ApplyFileUploadHeaders(UnityWebRequest request)
    {
        ApplyStandardHeaders(request);
        // multipart/form-dataは自動設定されるのでContent-Typeは設定しない
    }
}

// 使用例
using (UnityWebRequest request = new UnityWebRequest(url, "POST"))
{
    APIHeaders.ApplyJSONHeaders(request);
    // その他の設定...
}
```

## まとめ

リクエストヘッダーの知識があれば：

1. **API通信エラーの原因を特定**できる
2. **ChatGPTにより具体的な質問**ができる
3. **セキュアな通信**を実装できる
4. **デバッグ効率**が向上する

「エラーが出たから適当にヘッダー追加」から「目的に応じて適切なヘッダーを設定」へ。

この基礎知識で、API通信のトラブルシューティングが格段に楽になります。

---

**ゲーム開発のご相談：**
https://ryuryugame.netlify.app/

**AI観光ガイドの導入：**
https://guidecastai.netlify.app/

---