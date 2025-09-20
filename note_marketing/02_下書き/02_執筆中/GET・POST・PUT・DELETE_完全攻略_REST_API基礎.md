# GET・POST・PUT・DELETE完全攻略：REST API基礎

---

**ゲーム開発のご相談：**
https://ryuryugame.netlify.app/

**AI観光ガイドの導入：**
https://guidecastai.netlify.app/

---

## APIドキュメントを見て混乱した経験ありませんか？

APIドキュメントを読んでいて、こんな疑問を持ったことはありませんか？

```
GET /users/{id}
POST /users
PUT /users/{id}
DELETE /users/{id}
```

「全部 `/users` じゃん。何が違うの？」

この記事では、REST APIの基本である4つのHTTPメソッドの使い分けを、具体例とともに解説します。

## REST APIを理解する一番簡単な例え：コンビニ

コンビニでの買い物を思い出してください。

- **商品を見る**（商品棚をチェック）
- **商品を買う**（レジで決済）
- **返品・交換する**（不良品を交換）
- **商品を処分する**（賞味期限切れ商品の廃棄）

これらの「行動」が、REST APIの4つのメソッドに対応しています。

## 4つのHTTPメソッドの役割

### GET：データを「見る」「取得する」

**役割：**データを読み取り専用で取得

**特徴：**
- データを変更しない（安全な操作）
- 何回実行しても同じ結果
- URLに直接アクセス可能

**コンビニの例：**「商品棚を見る」

```
GET /products  →  商品一覧を見る
GET /products/123  →  商品123番を詳しく見る
```

### POST：データを「作成する」「追加する」

**役割：**新しいデータを作成

**特徴：**
- 新しいリソースが作られる
- 実行するたびに結果が変わる可能性
- リクエストボディにデータを含める

**コンビニの例：**「商品を買う（新しい取引を作る）」

```
POST /orders
{
  "product_id": 123,
  "quantity": 2,
  "customer_id": 456
}
```

### PUT：データを「更新する」「置き換える」

**役割：**既存のデータを完全に置き換える

**特徴：**
- リソース全体を新しいデータで置き換え
- 同じ操作を何回実行しても結果は同じ
- リクエストボディに完全なデータが必要

**コンビニの例：**「商品情報を変更する」

```
PUT /products/123
{
  "name": "新商品名",
  "price": 200,
  "category": "飲み物",
  "stock": 50
}
```

### DELETE：データを「削除する」

**役割：**既存のデータを削除

**特徴：**
- 指定されたリソースを削除
- 削除後は404エラーになることが一般的
- 元に戻せない操作

**コンビニの例：**「商品を廃棄する」

```
DELETE /products/123
```

## Unity/C#での実装例

### GETリクエスト：ユーザー情報の取得

```csharp
using UnityEngine;
using UnityEngine.Networking;
using System.Collections;

public class UserAPI : MonoBehaviour
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
                Debug.Log($"取得したユーザー: {user.name}");
            }
            else
            {
                Debug.LogError($"GET失敗: {request.responseCode} - {request.error}");
            }
        }
    }
}
```

### POSTリクエスト：新しいユーザーの作成

```csharp
public IEnumerator CreateUser(string name, string email)
{
    string url = "https://api.example.com/users";

    User newUser = new User
    {
        name = name,
        email = email
    };

    string jsonData = JsonUtility.ToJson(newUser);
    byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(jsonData);

    using (UnityWebRequest request = new UnityWebRequest(url, "POST"))
    {
        request.uploadHandler = new UploadHandlerRaw(bodyRaw);
        request.downloadHandler = new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/json");

        yield return request.SendWebRequest();

        if (request.result == UnityWebRequest.Result.Success)
        {
            Debug.Log("ユーザー作成成功");
            string responseJson = request.downloadHandler.text;
            User createdUser = JsonUtility.FromJson<User>(responseJson);
            Debug.Log($"作成されたユーザーID: {createdUser.id}");
        }
        else
        {
            Debug.LogError($"POST失敗: {request.responseCode} - {request.error}");
        }
    }
}
```

### PUTリクエスト：ユーザー情報の更新

```csharp
public IEnumerator UpdateUser(int userId, string name, string email)
{
    string url = $"https://api.example.com/users/{userId}";

    User updatedUser = new User
    {
        id = userId,
        name = name,
        email = email
    };

    string jsonData = JsonUtility.ToJson(updatedUser);
    byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(jsonData);

    using (UnityWebRequest request = new UnityWebRequest(url, "PUT"))
    {
        request.uploadHandler = new UploadHandlerRaw(bodyRaw);
        request.downloadHandler = new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/json");

        yield return request.SendWebRequest();

        if (request.result == UnityWebRequest.Result.Success)
        {
            Debug.Log("ユーザー更新成功");
        }
        else
        {
            Debug.LogError($"PUT失敗: {request.responseCode} - {request.error}");
        }
    }
}
```

### DELETEリクエスト：ユーザーの削除

```csharp
public IEnumerator DeleteUser(int userId)
{
    string url = $"https://api.example.com/users/{userId}";

    using (UnityWebRequest request = UnityWebRequest.Delete(url))
    {
        yield return request.SendWebRequest();

        if (request.result == UnityWebRequest.Result.Success)
        {
            Debug.Log("ユーザー削除成功");
        }
        else
        {
            Debug.LogError($"DELETE失敗: {request.responseCode} - {request.error}");
        }
    }
}
```

## よくある間違いと正しい使い方

### 間違い1：すべてPOSTで済ませる

```csharp
❌ 間違った使い方
POST /getUserInfo    // ユーザー情報取得
POST /updateUser     // ユーザー更新
POST /deleteUser     // ユーザー削除
```

```csharp
⭕ 正しい使い方
GET /users/{id}      // ユーザー情報取得
PUT /users/{id}      // ユーザー更新
DELETE /users/{id}   // ユーザー削除
```

### 間違い2：URLに動詞を含める

```csharp
❌ 間違ったURL設計
GET /getUser/{id}
POST /createUser
PUT /updateUser/{id}
DELETE /deleteUser/{id}
```

```csharp
⭕ 正しいURL設計
GET /users/{id}      // リソース名は名詞
POST /users          // 動詞はHTTPメソッドで表現
PUT /users/{id}
DELETE /users/{id}
```

## ステータスコードの理解

各メソッドで返ってくる主要なステータスコード：

### GET

- **200 OK**：正常に取得できた
- **404 Not Found**：指定されたリソースが存在しない
- **403 Forbidden**：アクセス権限がない

### POST

- **201 Created**：新しいリソースが作成された
- **400 Bad Request**：リクエストデータが不正
- **409 Conflict**：すでに存在するリソースと競合

### PUT

- **200 OK**：既存リソースの更新に成功
- **201 Created**：新しいリソースが作成された（PUTは作成も可能）
- **400 Bad Request**：リクエストデータが不正

### DELETE

- **204 No Content**：削除に成功（レスポンスボディなし）
- **404 Not Found**：削除しようとしたリソースが存在しない

## エラーハンドリングの実装

```csharp
public class APIErrorHandler
{
    public static void HandleError(UnityWebRequest request)
    {
        switch (request.responseCode)
        {
            case 400:
                Debug.LogError("Bad Request: リクエストデータを確認してください");
                break;
            case 401:
                Debug.LogError("Unauthorized: 認証が必要です");
                break;
            case 403:
                Debug.LogError("Forbidden: アクセス権限がありません");
                break;
            case 404:
                Debug.LogError("Not Found: 指定されたリソースが見つかりません");
                break;
            case 500:
                Debug.LogError("Internal Server Error: サーバーエラーです");
                break;
            default:
                Debug.LogError($"Unexpected error: {request.responseCode} - {request.error}");
                break;
        }
    }
}
```

## 実際のゲーム開発での活用例

### ランキングシステム

```csharp
// ランキング取得
GET /rankings?game_mode=normal&limit=10

// スコア投稿
POST /scores
{
  "player_id": 123,
  "score": 9999,
  "game_mode": "normal"
}

// プレイヤー情報更新
PUT /players/123
{
  "name": "新しい名前",
  "avatar_id": 5
}
```

### セーブデータ管理

```csharp
// セーブデータ取得
GET /saves/player/123

// 新規セーブ作成
POST /saves
{
  "player_id": 123,
  "save_data": "encrypted_data_here",
  "level": 10,
  "timestamp": "2024-01-01T12:00:00Z"
}

// セーブデータ更新
PUT /saves/456
{
  "save_data": "updated_encrypted_data",
  "level": 15,
  "timestamp": "2024-01-01T13:00:00Z"
}

// セーブデータ削除
DELETE /saves/456
```

## ChatGPTとの効果的な質問例

### Before（曖昧な質問）
「API通信のコード書いて」

### After（具体的な質問）
「Unity C#で、ユーザー情報をGETで取得し、POSTで新規作成、PUTで更新、DELETEで削除するREST APIクライアントを実装したいです。エラーハンドリングとステータスコード別の処理も含めてください。」

## REST API設計のベストプラクティス

### 1. RESTfulなURL設計

```
⭕ Good
GET    /users          # ユーザー一覧
GET    /users/123      # 特定ユーザー
POST   /users          # ユーザー作成
PUT    /users/123      # ユーザー更新
DELETE /users/123      # ユーザー削除

❌ Bad
GET    /getAllUsers
GET    /getUser?id=123
POST   /createUser
POST   /updateUser
POST   /deleteUser
```

### 2. 適切なHTTPメソッドの選択

- **GET**: データ取得（副作用なし）
- **POST**: データ作成（副作用あり）
- **PUT**: データ完全置換（冪等性あり）
- **PATCH**: データ部分更新
- **DELETE**: データ削除（冪等性あり）

### 3. 意味のあるステータスコード

正しいステータスコードを返すことで、クライアント側のエラーハンドリングが簡潔になります。

## まとめ

REST APIの4つのメソッドを理解することで：

1. **APIドキュメントが読めるようになる**
2. **ChatGPTにより具体的な質問ができる**
3. **適切なエラーハンドリングが実装できる**
4. **保守性の高いコードが書ける**

「なんとなくPOSTで済ませる」から「目的に応じて適切なメソッドを選択する」へ。

この基礎知識があれば、どんなAPIとも効率的に連携できるようになります。

---

**ゲーム開発のご相談：**
https://ryuryugame.netlify.app/

**AI観光ガイドの導入：**
https://guidecastai.netlify.app/

---