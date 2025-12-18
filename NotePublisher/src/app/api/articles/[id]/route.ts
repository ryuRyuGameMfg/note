import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const READY_DIR = path.join(process.cwd(), '..', 'note', '03_公開準備完了');
const PUBLISHED_DIR = path.join(process.cwd(), '..', 'note', '04_公開済み');

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const filename = Buffer.from(id, 'base64').toString('utf-8');
    
    // まず公開準備完了から探す
    let filePath = path.join(READY_DIR, filename);
    let status = 'ready';
    let location = '03_公開準備完了';
    
    // なければ公開済みから探す
    if (!fs.existsSync(filePath)) {
      filePath = path.join(PUBLISHED_DIR, filename);
      status = 'published';
      location = '04_公開済み';
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    
    return NextResponse.json({ 
      filename,
      content,
      id,
      status,
      location
    });
  } catch (error) {
    console.error('Error reading article:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
