import { useState, useEffect } from 'react';
import { List } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

const TableOfContents = ({ content }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>('');
  const [items, setItems] = useState<TOCItem[]>([]);

  useEffect(() => {
    // Extract headings from content
    const headings: TOCItem[] = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      if (line.startsWith('## ')) {
        headings.push({
          id: `heading-${index}`,
          text: line.slice(3).trim(),
          level: 2,
        });
      } else if (line.startsWith('### ')) {
        headings.push({
          id: `heading-${index}`,
          text: line.slice(4).trim(),
          level: 3,
        });
      }
    });

    setItems(headings);
  }, [content]);

  if (items.length === 0) return null;

  return (
    <nav className="card-elevated rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <List className="h-4 w-4 text-primary" />
        <h3 className="font-display text-lg font-semibold text-foreground">
          Table of Contents
        </h3>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: `${(item.level - 2) * 16}px` }}
          >
            <button
              onClick={() => {
                setActiveId(item.id);
                // Scroll to section logic would go here
              }}
              className={`text-sm text-left w-full py-1 transition-colors hover:text-primary ${
                activeId === item.id
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground'
              }`}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
