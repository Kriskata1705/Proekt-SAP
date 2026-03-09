
Action: file_editor create /app/frontend/src/lib/utils.js --file-text "import { clsx } from \"clsx\";
import { twMerge } from \"tailwind-merge\";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('bg-BG', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatRelativeDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Току-що';
  if (diffMins < 60) return `Преди ${diffMins} мин`;
  if (diffHours < 24) return `Преди ${diffHours} ч`;
  if (diffDays < 7) return `Преди ${diffDays} дни`;
  return formatDate(dateString);
}

export function getStatusColor(status) {
  switch (status) {
    case 'draft':
      return 'bg-zinc-500';
    case 'pending':
      return 'bg-amber-500';
    case 'approved':
      return 'bg-emerald-500';
    case 'rejected':
      return 'bg-rose-500';
    default:
      return 'bg-zinc-500';
  }
}

export function getStatusLabel(status) {
  switch (status) {
    case 'draft':
      return 'Чернова';
    case 'pending':
      return 'Чака преглед';
    case 'approved':
      return 'Одобрена';
    case 'rejected':
      return 'Отхвърлена';
    default:
      return status;
  }
}

export function getRoleLabel(role) {
  switch (role) {
    case 'admin':
      return 'Администратор';
    case 'author':
      return 'Автор';
    case 'reviewer':
      return 'Рецензент';
    case 'reader':
      return 'Читател';
    default:
      return role;
  }
}

export function getRoleColor(role) {
  switch (role) {
    case 'admin':
      return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    case 'author':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'reviewer':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'reader':
      return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    default:
      return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
  }
}

export function getActionLabel(action) {
  const actions = {
    'create_document': 'Създаде документ',
    'update_document': 'Редактира документ',
    'delete_document': 'Изтри документ',
    'create_version': 'Създаде версия',
    'update_version': 'Редактира версия',
    'submit_for_review': 'Изпрати за преглед',
    'approve': 'Одобри',
    'reject': 'Отхвърли',
    'add_comment': 'Добави коментар',
    'export': 'Експортира',
    'login': 'Вход в системата',
    'register': 'Регистрация',
    'update_user': 'Редактира потребител',
    'delete_user': 'Изтри потребител',
  };
  return actions[action] || action;
}
"
Observation: Overwrite successful: /app/frontend/src/lib/utils.js