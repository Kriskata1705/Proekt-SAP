
Action: file_editor create /app/frontend/src/components/DiffViewer.js --file-text "import { useMemo } from 'react';
import { diffLines } from 'diff';
import { cn } from '../lib/utils';

export function DiffViewer({ oldText, newText, oldLabel = 'Стара версия', newLabel = 'Нова версия' }) {
  const diff = useMemo(() => {
    return diffLines(oldText || '', newText || '');
  }, [oldText, newText]);

  return (
    <div className=\"rounded-md border border-zinc-800 overflow-hidden\">
      {/* Header */}
      <div className=\"flex border-b border-zinc-800 bg-[#18181b]\">
        <div className=\"flex-1 px-4 py-2 border-r border-zinc-800\">
          <span className=\"text-sm font-medium text-zinc-400\">{oldLabel}</span>
        </div>
        <div className=\"flex-1 px-4 py-2\">
          <span className=\"text-sm font-medium text-zinc-400\">{newLabel}</span>
        </div>
      </div>

      {/* Diff content */}
      <div className=\"font-mono text-sm\">
        {diff.map((part, index) => {
          const lines = part.value.split('\n').filter((_, i, arr) => i < arr.length - 1 || part.value.slice(-1) !== '\n' || i < arr.length - 1);
          
          if (part.added) {
            return lines.map((line, lineIndex) => (
              <div key={`${index}-${lineIndex}`} className=\"flex\">
                <div className=\"flex-1 border-r border-zinc-800 bg-[#0d0d0d]\" />
                <div className=\"flex-1 diff-added px-4 py-0.5\">
                  <span className=\"text-emerald-500 mr-2\">+</span>
                  {line || ' '}
                </div>
              </div>
            ));
          }
          
          if (part.removed) {
            return lines.map((line, lineIndex) => (
              <div key={`${index}-${lineIndex}`} className=\"flex\">
                <div className=\"flex-1 diff-removed px-4 py-0.5 border-r border-zinc-800\">
                  <span className=\"text-rose-500 mr-2\">-</span>
                  {line || ' '}
                </div>
                <div className=\"flex-1 bg-[#0d0d0d]\" />
              </div>
            ));
          }
          
          return lines.map((line, lineIndex) => (
            <div key={`${index}-${lineIndex}`} className=\"flex\">
              <div className=\"flex-1 px-4 py-0.5 border-r border-zinc-800 text-zinc-400\">
                <span className=\"text-zinc-600 mr-2\">&nbsp;</span>
                {line || ' '}
              </div>
              <div className=\"flex-1 px-4 py-0.5 text-zinc-400\">
                <span className=\"text-zinc-600 mr-2\">&nbsp;</span>
                {line || ' '}
              </div>
            </div>
          ));
        })}
      </div>
    </div>
  );
}

export function SimpleDiffViewer({ oldText, newText }) {
  const diff = useMemo(() => {
    return diffLines(oldText || '', newText || '');
  }, [oldText, newText]);

  return (
    <div className=\"rounded-md border border-zinc-800 overflow-hidden font-mono text-sm\">
      {diff.map((part, index) => {
        const lines = part.value.split('\n');
        
        return lines.map((line, lineIndex) => {
          if (!line && lineIndex === lines.length - 1) return null;
          
          return (
            <div
              key={`${index}-${lineIndex}`}
              className={cn(
                \"px-4 py-0.5\",
                part.added && \"diff-added\",
                part.removed && \"diff-removed\",
                !part.added && !part.removed && \"text-zinc-400\"
              )}
            >
              <span className={cn(
                \"mr-2\",
                part.added && \"text-emerald-500\",
                part.removed && \"text-rose-500\",
                !part.added && !part.removed && \"text-zinc-600\"
              )}>
                {part.added ? '+' : part.removed ? '-' : ' '}
              </span>
              {line || ' '}
            </div>
          );
        });
      })}
    </div>
  );
}
"
Observation: Create successful: /app/frontend/src/components/DiffViewer.js