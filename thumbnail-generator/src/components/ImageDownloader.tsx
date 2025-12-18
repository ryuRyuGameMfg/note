'use client';

import React, { useRef, useCallback } from 'react';
import { toPng, toJpeg } from 'html-to-image';
import { saveAs } from 'file-saver';
import { Download } from 'lucide-react';

interface ImageDownloaderProps {
  children: React.ReactNode;
  filename?: string;
  scale?: number;
}

export const ImageDownloader: React.FC<ImageDownloaderProps> = ({
  children,
  filename = 'thumbnail',
  scale = 1,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const downloadPng = useCallback(async () => {
    if (!ref.current) return;
    try {
      const dataUrl = await toPng(ref.current, {
        quality: 1,
        pixelRatio: scale,
        cacheBust: true,
      });
      saveAs(dataUrl, `${filename}.png`);
    } catch (err) {
      console.error('PNG download failed:', err);
    }
  }, [filename, scale]);

  const downloadJpeg = useCallback(async () => {
    if (!ref.current) return;
    try {
      const dataUrl = await toJpeg(ref.current, {
        quality: 0.95,
        pixelRatio: scale,
        cacheBust: true,
        backgroundColor: '#ffffff',
      });
      saveAs(dataUrl, `${filename}.jpg`);
    } catch (err) {
      console.error('JPEG download failed:', err);
    }
  }, [filename, scale]);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <button
          onClick={downloadPng}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <Download size={20} />
          PNG ダウンロード
        </button>
        <button
          onClick={downloadJpeg}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
        >
          <Download size={20} />
          JPEG ダウンロード
        </button>
      </div>
      <div
        ref={ref}
        className="inline-block"
        style={{ transform: `scale(${scale > 1 ? 1 : 1})` }}
      >
        {children}
      </div>
    </div>
  );
};

export default ImageDownloader;
