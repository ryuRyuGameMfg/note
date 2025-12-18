import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ARTICLES_DIR = path.join(process.cwd(), '..', 'note', '03_公開準備完了');

export async function GET() {
  try {
    // フォルダが存在するか確認
    if (!fs.existsSync(ARTICLES_DIR)) {
      return NextResponse.json({ articles: [], error: 'Directory not found' });
    }

    // .mdファイルを取得
    const files = fs.readdirSync(ARTICLES_DIR)
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const filePath = path.join(ARTICLES_DIR, file);
        const stats = fs.statSync(filePath);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // タイトル抽出
        const titleMatch = content.match(/^# (.+)$/m);
        const title = titleMatch ? titleMatch[1] : file.replace('.md', '');
        
        return {
          id: Buffer.from(file).toString('base64'),
          filename: file,
          title,
          modifiedAt: stats.mtime.toISOString(),
        };
      })
      .sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime());

    return NextResponse.json({ articles: files });
  } catch (error) {
    console.error('Error reading articles:', error);
    return NextResponse.json({ articles: [], error: String(error) });
  }
}
