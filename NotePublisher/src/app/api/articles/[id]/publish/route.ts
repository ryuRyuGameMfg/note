import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const READY_DIR = path.join(process.cwd(), '..', 'note', '03_公開準備完了');
const PUBLISHED_DIR = path.join(process.cwd(), '..', 'note', '04_公開済み');

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const filename = Buffer.from(id, 'base64').toString('utf-8');
    const sourceFile = path.join(READY_DIR, filename);
    const targetFile = path.join(PUBLISHED_DIR, filename);

    // ファイルが存在するか確認
    if (!fs.existsSync(sourceFile)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // 公開済みディレクトリが存在しない場合は作成
    if (!fs.existsSync(PUBLISHED_DIR)) {
      fs.mkdirSync(PUBLISHED_DIR, { recursive: true });
    }

    // ファイルを移動（コピー→削除）
    fs.copyFileSync(sourceFile, targetFile);
    fs.unlinkSync(sourceFile);

    return NextResponse.json({ 
      success: true,
      message: '記事を公開済みに移動しました',
      newLocation: '04_公開済み'
    });
  } catch (error) {
    console.error('Error publishing article:', error);
    return NextResponse.json({ 
      error: String(error),
      message: '記事の移動に失敗しました'
    }, { status: 500 });
  }
}

// 公開取り消し（04_公開済み → 03_公開準備完了）
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const filename = Buffer.from(id, 'base64').toString('utf-8');
    const sourceFile = path.join(PUBLISHED_DIR, filename);
    const targetFile = path.join(READY_DIR, filename);

    // ファイルが存在するか確認
    if (!fs.existsSync(sourceFile)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // ファイルを移動（コピー→削除）
    fs.copyFileSync(sourceFile, targetFile);
    fs.unlinkSync(sourceFile);

    return NextResponse.json({ 
      success: true,
      message: '記事を公開準備完了に戻しました',
      newLocation: '03_公開準備完了'
    });
  } catch (error) {
    console.error('Error unpublishing article:', error);
    return NextResponse.json({ 
      error: String(error),
      message: '記事の移動に失敗しました'
    }, { status: 500 });
  }
}
