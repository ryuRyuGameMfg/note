import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    // 記事ファイル名から.mdを除去してJSONファイル名を作成
    const jsonFilename = filename.replace('.md', '') + '.json';
    const filePath = path.join(DATA_DIR, jsonFilename);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ exists: false, data: null });
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);

    return NextResponse.json({ exists: true, data });
  } catch (error) {
    console.error('Error reading image data:', error);
    return NextResponse.json({ exists: false, data: null, error: String(error) });
  }
}
