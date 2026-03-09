
Action: file_editor create /app/frontend/src/components/VersionTimeline.js --file-text "import { Circle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { cn, formatDate, getStatusLabel } from '../lib/utils';
import { Badge } from './ui/badge';

const statusConfig = {
  draft: { icon: Circle, color: 'bg-zinc-500', textColor: 'text-zinc-400' },
  pending: { icon: Clock, color: 'bg-amber-500', textColor: 'text-amber-400' },
  approved: { icon: CheckCircle, color: 'bg-emerald-500', textColor: 'text-emerald-400' },
  rejected: { icon: XCircle, color: 'bg-rose-500', textColor: 'text-rose-400' },
};

export function VersionTimeline({ versions, activeVersionId, onVersionClick, selectedVersionId }) {
  return (
    <div className=\"relative\">
      {/* Vertical line */}
      <div className=\"absolute left-4 top-0 bottom-0 w-0.5 bg-zinc-800\" />
      
      <div className=\"space-y-4\">
        {versions.map((version, index) => {
          const config = statusConfig[version.status] || statusConfig.draft;
          const Icon = config.icon;
          const isActive = version.id === activeVersionId;
          const isSelected = version.id === selectedVersionId;
          
          return (
            <div
              key={version.id}
              className={cn(
                \"relative pl-10 cursor-pointer group\",
                isSelected && \"bg-zinc-800/50 -mx-2 px-2 pl-12 py-2 rounded-md\"
              )}
              onClick={() => onVersionClick?.(version)}
              data-testid={`version-item-${version.version_number}`}
            >
              {/* Timeline dot */}
              <div className={cn(
                \"absolute left-2 top-1 w-5 h-5 rounded-full flex items-center justify-center\",
                config.color,
                \"ring-4 ring-[#09090b]\"
              )}>
                <Icon className=\"w-3 h-3 text-white\" />
              </div>
              
              {/* Content */}
              <div className=\"space-y-1\">
                <div className=\"flex items-center gap-2 flex-wrap\">
                  <span className={cn(
                    \"font-mono text-sm font-semibold\",
                    config.textColor
                  )}>
                    v{version.version_number}
                  </span>
                  
                  <Badge 
                    variant=\"outline\" 
                    className={cn(
                      \"text-xs\",
                      version.status === 'draft' && \"border-zinc-600 text-zinc-400\",
                      version.status === 'pending' && \"border-amber-600 text-amber-400\",
                      version.status === 'approved' && \"border-emerald-600 text-emerald-400\",
                      version.status === 'rejected' && \"border-rose-600 text-rose-400\"
                    )}
                  >
                    {getStatusLabel(version.status)}
                  </Badge>
                  
                  {isActive && (
                    <Badge className=\"bg-blue-600/20 text-blue-400 border-blue-600/30 text-xs\">
                      Активна
                    </Badge>
                  )}
                </div>
                
                <p className=\"text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors\">
                  {version.change_summary || 'Без описание'}
                </p>
                
                <div className=\"flex items-center gap-4 text-xs text-zinc-500\">
                  <span>{version.author_name}</span>
                  <span>{formatDate(version.created_at)}</span>
                </div>
                
                {version.reviewed_by && (
                  <p className=\"text-xs text-zinc-500 italic\">
                    Прегледана от {version.reviewed_by}: {version.review_comment || 'Без коментар'}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
"
Observation: Create successful: /app/frontend/src/components/VersionTimeline.js