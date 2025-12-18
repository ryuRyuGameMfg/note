const fs = require('fs');
const path = require('path');

// note/03_公開準備完了/フォルダのパス（ルートからの相対パス）
const articlesDir = path.resolve(__dirname, '..', 'note', '03_公開準備完了');

// 記事リストを格納する配列
const articles = [];

try {
  // フォルダ内のファイルを読み込む
  const files = fs.readdirSync(articlesDir);
  
  // .mdファイルのみをフィルタリング
  const mdFiles = files.filter(file => file.endsWith('.md'));
  
  // 各ファイルの情報を取得
  mdFiles.forEach(file => {
    const filePath = path.join(articlesDir, file);
    const stats = fs.statSync(filePath);
    
    // ファイル内容を読み込む
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // ファイル名からタイトルを取得（.mdを削除）
    const title = file.replace(/\.md$/, '');
    
    articles.push({
      title: title,
      filename: file,
      content: content,
      modifiedAt: stats.mtime.toISOString(),
      size: stats.size
    });
  });
  
  // 更新日時でソート（新しい順）
  articles.sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt));
  
  // JSONファイルに出力
  const outputPath = path.join(__dirname, 'articles.json');
  fs.writeFileSync(outputPath, JSON.stringify(articles, null, 2), 'utf-8');
  
  console.log(`✅ ${articles.length}件の記事を検出しました`);
  console.log(`📄 articles.json を生成しました`);
  console.log(`\n記事一覧:`);
  articles.forEach((article, index) => {
    console.log(`${index + 1}. ${article.title}`);
  });
  
} catch (error) {
  console.error('❌ エラーが発生しました:', error.message);
  process.exit(1);
}
