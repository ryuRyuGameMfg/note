# ローカルAIキャラクター構成ガイド

Neuro-sama分析を踏まえた、完全ローカル動作のAIキャラクターシステム構成案。

---

## 概要

| 要素 | 役割 | 推奨サイズ |
|------|------|------------|
| 回答生成LLM | テキスト応答を生成 | 7-8B |
| 埋め込みモデル | テキストをベクトル化 | 0.5-2GB |
| ベクトルDB | 長期記憶の保存・検索 | - |
| 音声合成（TTS） | テキストを音声化 | - |

---

## 1. 回答生成LLM（7Bクラス）

### 推奨モデル一覧

| モデル名 | パラメータ | VRAM目安 | 日本語 | 特徴 |
|----------|------------|----------|--------|------|
| **Llama 3.1 8B Instruct** | 8B | 6-8GB | △ | Meta製、英語最強クラス |
| **Gemma 2 9B** | 9B | 8-10GB | ○ | Google製、バランス良い |
| **Mistral 7B Instruct** | 7B | 6GB | △ | 高速、軽量 |
| **Qwen2.5 7B** | 7B | 6-8GB | ◎ | 中国製、アジア言語強い |
| **ELYZA-japanese-Llama-2-7b** | 7B | 6GB | ◎ | 日本語特化 |
| **Japanese-StableLM-Base-Gamma-7B** | 7B | 6GB | ◎ | 日本語特化 |

### サイズ別比較

| サイズ | レイテンシー | 品質 | 用途 |
|--------|--------------|------|------|
| 1-3B | 超高速 | △ | リアルタイム配信（Neuro-sama方式） |
| **7-8B** | 高速 | ○ | **バランス推奨** |
| 13-14B | 中速 | ◎ | 品質重視 |
| 20B+ | 低速 | ◎ | オフライン/高性能GPU向け |

### 量子化オプション

| 形式 | VRAM削減 | 品質劣化 | 備考 |
|------|----------|----------|------|
| FP16 | なし | なし | フル精度 |
| Q8 | 約50% | 微小 | 推奨 |
| Q4 | 約75% | 小 | VRAM少ない場合 |
| Q2 | 約85% | 中 | Neuro-samaが使用 |

---

## 2. 埋め込みモデル（ベクトル化）

長期記憶の検索に使用。回答生成LLMとは別に必要。

| モデル名 | サイズ | 日本語 | 特徴 |
|----------|--------|--------|------|
| **all-MiniLM-L6-v2** | 80MB | × | 超軽量、英語のみ |
| **multilingual-e5-small** | 470MB | ○ | 軽量、多言語 |
| **multilingual-e5-base** | 1.1GB | ◎ | **バランス推奨** |
| **multilingual-e5-large** | 2.2GB | ◎ | 高精度 |
| **BGE-M3** | 2GB | ◎ | 最高精度、多言語 |

### 使用例

```python
from sentence_transformers import SentenceTransformer

# 日本語対応推奨モデル
model = SentenceTransformer('intfloat/multilingual-e5-base')

# テキストをベクトル化
embedding = model.encode("こんにちは、田中さん")
```

---

## 3. ベクトルDB（長期記憶保存）

| 名前 | 特徴 | 導入難易度 | 推奨度 |
|------|------|------------|--------|
| **Chroma** | Python完結、SQLite内蔵 | 超簡単 | ◎ |
| **LanceDB** | 軽量、組み込み向け | 簡単 | ○ |
| **Qdrant** | 高速、REST API付き | 簡単 | ○ |
| **FAISS** | Meta製、超高速 | 中 | ○ |
| **Milvus Lite** | 高機能のローカル版 | 中 | △ |

### Chroma使用例

```python
import chromadb
from sentence_transformers import SentenceTransformer

# 初期化
client = chromadb.PersistentClient(path="./memory_db")
collection = client.get_or_create_collection("user_memories")
embedder = SentenceTransformer('intfloat/multilingual-e5-base')

# 記憶を保存
def save_memory(user_id, text, metadata=None):
    embedding = embedder.encode(text).tolist()
    collection.add(
        ids=[f"{user_id}_{int(time.time())}"],
        embeddings=[embedding],
        documents=[text],
        metadatas=[metadata or {"user_id": user_id}]
    )

# 記憶を検索
def search_memory(query, n_results=5):
    embedding = embedder.encode(query).tolist()
    results = collection.query(
        query_embeddings=[embedding],
        n_results=n_results
    )
    return results["documents"]
```

---

## 4. 音声合成（TTS）

### 日本語（固定）

| 名前 | 特徴 | ライセンス |
|------|------|------------|
| **VoiceVox** | 定番、キャラ豊富、高品質 | 商用可（条件あり） |

### 海外向け選択肢

| 名前 | サイズ | 速度 | 品質 | 声クローン | 特徴 |
|------|--------|------|------|------------|------|
| **Piper** | 軽量 | ◎ | ○ | × | 超高速、組み込み向け |
| **Coqui XTTS** | 中 | ○ | ◎ | ◎ | 多言語、声クローン可 |
| **OpenVoice** | 中 | ○ | ◎ | ◎ | リアルタイム声クローン |
| **Fish Speech** | 中 | ◎ | ◎ | ◎ | 高速、多言語、最新 |
| **Bark** | 大 | △ | ◎ | ○ | 感情・笑い声も生成 |
| **Tortoise-TTS** | 大 | × | ◎ | ◎ | 最高品質だが遅い |

### 用途別推奨

| 用途 | 推奨TTS |
|------|---------|
| リアルタイム配信 | Piper（速度重視） |
| 高品質コンテンツ | XTTS / Fish Speech |
| 声クローン必須 | OpenVoice / XTTS |
| 感情表現重視 | Bark |

---

## 5. 推奨構成まとめ

### 最小構成（日本語のみ）

| 要素 | 選択 | VRAM |
|------|------|------|
| 回答LLM | ELYZA-7b Q4 | 4GB |
| 埋め込み | multilingual-e5-small | 0.5GB |
| DB | Chroma | - |
| TTS | VoiceVox | CPU |
| **合計** | | **約5GB** |

### 推奨構成（多言語対応）

| 要素 | 選択 | VRAM |
|------|------|------|
| 回答LLM | Qwen2.5 7B Q8 | 8GB |
| 埋め込み | multilingual-e5-base | 1GB |
| DB | Chroma | - |
| TTS日本語 | VoiceVox | CPU |
| TTS海外 | Piper or Fish Speech | 1-2GB |
| **合計** | | **約10-12GB** |

### ハイエンド構成

| 要素 | 選択 | VRAM |
|------|------|------|
| 回答LLM | Llama 3.1 8B FP16 | 16GB |
| 埋め込み | BGE-M3 | 2GB |
| DB | Chroma | - |
| TTS日本語 | VoiceVox | CPU |
| TTS海外 | Coqui XTTS | 4GB |
| **合計** | | **約22GB** |

---

## 6. Neuro-samaとの比較

| 要素 | Neuro-sama | 本構成案 |
|------|------------|----------|
| 回答LLM | 自作2B（クラウド併用） | 7B ローカル |
| 埋め込み | 不明 | multilingual-e5 |
| DB | 自作（1つのコアDB） | Chroma |
| TTS | Azure Neural（クラウド） | VoiceVox / Piper |
| ランニングコスト | 月数万円〜 | 0円 |
| ゲームAI | あり（別システム） | なし（必要なら別途） |

---

## 7. 長期記憶の実装方針

### 基本構造

```
[ユーザー入力]
      ↓
[埋め込みモデル] → ベクトル化
      ↓
[Chroma] → 類似記憶Top-K検索
      ↓
[回答LLM] ← 記憶をプロンプトに注入
      ↓
[VoiceVox/Piper] → 音声出力
```

### 記憶の種類

| 種類 | 保存形式 | 例 |
|------|----------|-----|
| プロファイル | JSON | 名前、特徴、好み |
| 会話履歴 | ベクトル+テキスト | 過去の発言 |
| イベント | ベクトル+メタデータ | スパチャ、重要発言 |

### 重要度スコアリング（推奨）

```python
def calculate_importance(memory):
    base = 1.0

    # 金銭的貢献
    if memory.get("donation", 0) > 0:
        base += math.log(memory["donation"]) * 0.5

    # 時間減衰（半減期30日）
    days = (datetime.now() - memory["timestamp"]).days
    decay = 0.5 ** (days / 30)

    # 参照回数
    ref_boost = 1 + math.log(memory.get("ref_count", 0) + 1) * 0.3

    return base * decay * ref_boost
```

---

## 参考リンク

| 名前 | URL |
|------|-----|
| Chroma | https://www.trychroma.com/ |
| Sentence Transformers | https://www.sbert.net/ |
| VoiceVox | https://voicevox.hiroshiba.jp/ |
| Piper | https://github.com/rhasspy/piper |
| Coqui XTTS | https://github.com/coqui-ai/TTS |
| Fish Speech | https://github.com/fishaudio/fish-speech |
| Ollama（ローカルLLM実行） | https://ollama.ai/ |
| LM Studio（GUI） | https://lmstudio.ai/ |

---

## 更新履歴

- 2025-12-26: 初版作成（Neuro-sama/Bloo分析を踏まえて）
