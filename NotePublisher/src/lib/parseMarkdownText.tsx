/**
 * テキストからマークダウン記法を解析してReact要素に変換
 */

import React from 'react';

export function parseMarkdownText(text: string): React.ReactNode[] {
  if (!text) return [text];
  
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // **太字** を検出
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    
    if (boldMatch && boldMatch.index !== undefined) {
      // マッチ前のテキスト
      if (boldMatch.index > 0) {
        parts.push(remaining.slice(0, boldMatch.index));
      }
      
      // 太字部分
      parts.push(
        <strong key={`bold-${key++}`} className="font-bold">
          {boldMatch[1]}
        </strong>
      );
      
      // 残りのテキスト
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
    } else {
      // マッチしない場合は残りをそのまま追加
      parts.push(remaining);
      break;
    }
  }

  return parts.length > 0 ? parts : [text];
}

/**
 * テキスト配列をマークダウンパースして返す
 */
export function parseMarkdownArray(texts: string[]): React.ReactNode[][] {
  return texts.map(text => parseMarkdownText(text));
}
