import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { parseSyntax } from './SyntaxRenderer';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
}) => {
  return (
    <div className={`prose prose-sm max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom renderer for paragraphs to handle tarot card syntax
          p: ({ children, ...props }) => {
            const processedChildren = React.Children.map(children, (child) => {
              if (typeof child === 'string') {
                // Split by tarot card pattern and process each part
                const tarotCardPattern = /#(?:t|l)-[\w-]+(?:-reverse)?/g;
                const parts: (string | React.ReactNode)[] = [];
                let lastIndex = 0;
                let match;

                const regex = new RegExp(tarotCardPattern);
                const text = child;
                
                while ((match = regex.exec(text)) !== null) {
                  // Add text before the match
                  if (match.index > lastIndex) {
                    parts.push(text.substring(lastIndex, match.index));
                  }
                  // Add the rendered tarot card
                  parts.push(
                    <span key={`tarot-${match.index}`}>
                      {parseSyntax(match[0])}
                    </span>
                  );
                  lastIndex = regex.lastIndex;
                }
                
                // Add remaining text
                if (lastIndex < text.length) {
                  parts.push(text.substring(lastIndex));
                }
                
                return parts.length > 0 ? <>{parts}</> : child;
              }
              return child;
            });
            return <p {...props}>{processedChildren}</p>;
          },
          // Style customizations
          h1: ({ children, ...props }) => (
            <h1 className="text-2xl font-bold mt-6 mb-4" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-xl font-bold mt-5 mb-3" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-lg font-semibold mt-4 mb-2" {...props}>
              {children}
            </h3>
          ),
          ul: ({ children, ...props }) => (
            <ul className="list-disc list-inside my-3 space-y-1" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal list-inside my-3 space-y-1" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => {
            // Handle tarot cards in list items
            const processedChildren = React.Children.map(children, (child) => {
              if (typeof child === 'string') {
                const tarotCardPattern = /#(?:t|l)-[\w-]+(?:-reverse)?/g;
                const parts: (string | React.ReactNode)[] = [];
                let lastIndex = 0;
                let match;

                const regex = new RegExp(tarotCardPattern);
                
                while ((match = regex.exec(child)) !== null) {
                  if (match.index > lastIndex) {
                    parts.push(child.substring(lastIndex, match.index));
                  }
                  parts.push(
                    <span key={`tarot-li-${match.index}`}>
                      {parseSyntax(match[0])}
                    </span>
                  );
                  lastIndex = regex.lastIndex;
                }
                
                if (lastIndex < child.length) {
                  parts.push(child.substring(lastIndex));
                }
                
                return parts.length > 0 ? <>{parts}</> : child;
              }
              return child;
            });
            return <li {...props}>{processedChildren}</li>;
          },
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-4 border-purple-400 pl-4 italic my-4 text-muted-foreground"
              {...props}
            >
              {children}
            </blockquote>
          ),
          code: ({ inline, children, ...props }: any) =>
            inline ? (
              <code
                className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            ) : (
              <code
                className="block bg-muted p-3 rounded my-3 text-sm font-mono overflow-x-auto"
                {...props}
              >
                {children}
              </code>
            ),
          strong: ({ children, ...props }) => (
            <strong className="font-bold text-foreground" {...props}>
              {children}
            </strong>
          ),
          em: ({ children, ...props }) => (
            <em className="italic" {...props}>
              {children}
            </em>
          ),
          a: ({ children, ...props }) => (
            <a
              className="text-purple-600 hover:text-purple-800 underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

