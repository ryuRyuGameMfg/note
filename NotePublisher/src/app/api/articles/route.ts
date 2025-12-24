import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const READY_DIR = path.join(process.cwd(), '..', 'note', '03_公開準備完了');
const PUBLISHED_DIR = path.join(process.cwd(), '..', 'note', '04_公開済み');

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const folderFilter = searchParams.get('folder');

    const articles: any[] = [];

    // 公開準備完了の記事を取得
    if (!folderFilter || folderFilter === '03_公開準備完了') {
      if (fs.existsSync(READY_DIR)) {
        const readyFiles = fs.readdirSync(READY_DIR)
          .filter(file => file.endsWith('.md'))
          .map(file => {
            const filePath = path.join(READY_DIR, file);
            const stats = fs.statSync(filePath);
            const content = fs.readFileSync(filePath, 'utf-8');

            const titleMatch = content.match(/^# (.+)$/m);
            const title = titleMatch ? titleMatch[1] : file.replace('.md', '');

            return {
              id: Buffer.from(file).toString('base64'),
              filename: file,
              title,
              modifiedAt: stats.mtime.toISOString(),
              status: 'ready',
              location: '03_公開準備完了'
            };
          });
        articles.push(...readyFiles);
      }
    }

    // 公開済みの記事を取得（フィルターが指定されていない場合、または04_公開済みが指定された場合）
    if (!folderFilter || folderFilter === '04_公開済み') {
      if (fs.existsSync(PUBLISHED_DIR)) {
        const publishedFiles = fs.readdirSync(PUBLISHED_DIR)
          .filter(file => file.endsWith('.md'))
          .map(file => {
            const filePath = path.join(PUBLISHED_DIR, file);
            const stats = fs.statSync(filePath);
            const content = fs.readFileSync(filePath, 'utf-8');

            const titleMatch = content.match(/^# (.+)$/m);
            const title = titleMatch ? titleMatch[1] : file.replace('.md', '');

            return {
              id: Buffer.from(file).toString('base64'),
              filename: file,
              title,
              modifiedAt: stats.mtime.toISOString(),
              status: 'published',
              location: '04_公開済み'
            };
          });
        articles.push(...publishedFiles);
      }
    }

    // 更新日時でソート
    articles.sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime());

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error reading articles:', error);
    return NextResponse.json({ articles: [], error: String(error) });
  }
}
