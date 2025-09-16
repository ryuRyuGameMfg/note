# GitHubアップロード

以下の運用ルールに従って、GitHubへプロジェクトデータをアップロードしてください。

## 重要: ブランチ運用方針

**本プロジェクトではmainブランチのみで作業を行います。**
- 全ての開発作業はmainブランチで直接行う
- 新規ブランチの作成は不要
- フィーチャーブランチ、開発ブランチは使用しない

## 基本コマンドフロー

作業完了時は必ず以下のコマンドフローを実行してください：
```bash
# 1. 変更をステージング
git add .

# 2. コミット（カテゴリと動作確認状況を適切に設定）
git commit -m "[カテゴリ] 変更内容 - $(date +%Y-%m-%d) (動作確認状況)"

# 3. mainブランチにプッシュ
git push origin main
```

## コミットメッセージ規則の厳守

コミットメッセージは必ず以下の形式で記述してください：

```
[カテゴリ] 変更内容の説明 - 更新日時 (動作確認状況)
```

### カテゴリ一覧（必須選択）
以下から適切なカテゴリを選択してください：
- `[add]`: 新機能・新ファイル追加
- `[fix]`: バグ修正
- `[refactor]`: リファクタリング・構造変更
- `[remove]`: ファイル・機能削除
- `[update]`: 既存機能の更新・改善
- `[docs]`: ドキュメント更新
- `[style]`: コードフォーマット・整理

### 動作確認状況（必須記載）
以下から適切なステータスを選択してください：
- `(確認済み)`: ドキュメント更新、設定変更、ファイル削除等、実行不要な変更
- `(未テスト)`: 実装・修正後のデフォルト状態、人間による確認待ち
- `(動作確認済み)`: 人間が動作確認済み、本番環境へのデプロイ可能

## 作業シーン別の実行指示

### 1. 新機能開発時の手順
以下の手順を必ず実行してください：
```bash
# mainブランチで作業を行う
git checkout main

# 変更を行い、コミット
git add .
git commit -m "[add] 新機能の実装 - $(date +%Y-%m-%d) (未テスト)"

# mainブランチにプッシュ
git push origin main
```

### 2. バグ修正時の手順
以下の手順を必ず実行してください：
```bash
# mainブランチで作業を行う
git checkout main

# 変更を行い、コミット
git add .
git commit -m "[fix] バグの説明 - $(date +%Y-%m-%d) (未テスト)"

# mainブランチにプッシュ
git push origin main
```

### 3. 動作確認後のステータス更新
動作確認が完了した場合のみ、以下を実行してください：
```bash
# 動作確認が完了したら、コミットメッセージを更新
git commit --amend -m "[fix] バグの説明 - $(date +%Y-%m-%d) (動作確認済み)"
git push origin main --force-with-lease
```

### 4. リファクタリング時の手順
以下の手順を必ず実行してください：
```bash
# mainブランチで作業を行う
git checkout main

# リファクタリング実施
git add .
git commit -m "[refactor] システム構造の改善 - $(date +%Y-%m-%d) (未テスト)"
git push origin main
```

### 5. 不要ファイル削除時の手順
以下の手順を必ず実行してください：
```bash
# mainブランチで作業を行う
git checkout main

# ファイル削除
git rm 不要なファイル.tsx
git commit -m "[remove] 未使用ファイルの削除 - $(date +%Y-%m-%d) (確認済み)"
git push origin main
```

## 便利なエイリアス設定（推奨）

効率化のため、以下のエイリアスを設定することを推奨します：
```bash
# Git設定に追加すると便利なエイリアス
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm commit
git config --global alias.pl pull
git config --global alias.ps push
git config --global alias.lg "log --oneline --graph --all"
```

## 絶対に守るべき禁止事項

以下の行為は絶対に行わないでください：
1. **新規ブランチの作成禁止** - 全ての作業はmainブランチで行う
2. **動作確認なしで本番環境にデプロイしない**
3. **コミットメッセージは日本語で明確に記述**
4. **不要なファイルも確実に削除・コミット**
5. **APIキーなどの機密情報は絶対にコミットしない**

## プロジェクト固有の注意事項

- **開発環境**: http://localhost:3000
- **本番環境**: Netlifyに自動デプロイ（mainブランチプッシュ時）
- **テスト実行**: 変更後は必ずローカルで動作確認
- **Next.js 15対応**: App Routerを使用した構成を維持