import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ARTICLES_DIR = path.join(process.cwd(), '..', 'note', '03_公開準備完了');

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const filename = Buffer.from(id, 'base64').toString('utf-8');
    const filePath = path.join(ARTICLES_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    
    return NextResponse.json({ 
      filename,
      content 
    });
  } catch (error) {
    console.error('Error reading article:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
