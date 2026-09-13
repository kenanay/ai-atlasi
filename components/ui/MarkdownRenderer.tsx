'use client';

import { useEffect, useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { ExecutableCodeBlock } from './ExecutableCodeBlock';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  enableCodeExecution?: boolean;
}

export function MarkdownRenderer({ 
  content, 
  className = '',
  enableCodeExecution = true 
}: MarkdownRendererProps) {
  const [elements, setElements] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const renderMarkdown = async () => {
      try {
        // Marked konfigürasyonu
        marked.setOptions({
          breaks: true,
          gfm: true,
        });

        // Kod bloklarını ayıkla
        const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
        const parts: Array<{ type: 'text' | 'code', content: string, language?: string }> = [];
        let lastIndex = 0;
        let match;

        while ((match = codeBlockRegex.exec(content)) !== null) {
          // Önceki metin
          if (match.index > lastIndex) {
            parts.push({
              type: 'text',
              content: content.substring(lastIndex, match.index)
            });
          }

          // Kod bloğu
          parts.push({
            type: 'code',
            content: match[2].trim(),
            language: match[1] || 'text'
          });

          lastIndex = match.index + match[0].length;
        }

        // Kalan metin
        if (lastIndex < content.length) {
          parts.push({
            type: 'text',
            content: content.substring(lastIndex)
          });
        }

        // Eğer hiç kod bloğu yoksa, tüm içeriği text olarak ekle
        if (parts.length === 0) {
          parts.push({ type: 'text', content });
        }

        // Render et
        const renderedElements = await Promise.all(
          parts.map(async (part, index) => {
            if (part.type === 'code' && enableCodeExecution) {
              return (
                <ExecutableCodeBlock
                  key={index}
                  code={part.content}
                  language={part.language || 'text'}
                />
              );
            } else {
              const rawHtml = await marked(part.content);
              const cleanHtml = DOMPurify.sanitize(rawHtml);
              return (
                <div
                  key={index}
                  className="markdown-content"
                  dangerouslySetInnerHTML={{ __html: cleanHtml }}
                />
              );
            }
          })
        );

        setElements(renderedElements);
      } catch (error) {
        console.error('Markdown render error:', error);
        setElements([
          <p key="error" className="text-red-600">
            Markdown render hatası
          </p>
        ]);
      }
    };

    if (content) {
      renderMarkdown();
    }
  }, [content, enableCodeExecution]);

  return <div className={className}>{elements}</div>;
}
