
Action: file_editor create /app/frontend/src/components/StatusBadge.js --file-text "import { cn, getStatusColor, getStatusLabel, getRoleColor, getRoleLabel } from '../lib/utils';

export function StatusBadge({ status }) {
  return (
    <span className={cn(
      \"inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border\",
      status === 'draft' && \"bg-zinc-500/20 text-zinc-400 border-zinc-500/30\",
      status === 'pending' && \"bg-amber-500/20 text-amber-400 border-amber-500/30\",
      status === 'approved' && \"bg-emerald-500/20 text-emerald-400 border-emerald-500/30\",
      status === 'rejected' && \"bg-rose-500/20 text-rose-400 border-rose-500/30\"
    )}>
      <span className={cn(\"w-2 h-2 rounded-full\", getStatusColor(status))} />
      {getStatusLabel(status)}
    </span>
  );
}

export function RoleBadge({ role }) {
  return (
    <span className={cn(
      \"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border\",
      getRoleColor(role)
    )}>
      {getRoleLabel(role)}
    </span>
  );
}
"
Observation: Create successful: /app/frontend/src/components/StatusBadge.js