'use client';

import ThumbnailEditor from '@/components/ThumbnailEditor';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ThumbnailPage() {
  return (
    <div>
      <div className="bg-white border-b px-4 py-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
        >
          <ArrowLeft size={20} />
          <span>ホームに戻る</span>
        </Link>
      </div>
      <ThumbnailEditor />
    </div>
  );
}
