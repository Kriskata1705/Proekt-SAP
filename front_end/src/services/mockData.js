
Action: file_editor create /app/frontend/src/lib/mockData.js --file-text "// Mock data for development without backend
// Remove this file when connecting to real Spring Boot backend

export const mockUsers = [
  { id: '1', email: 'admin@example.com', name: 'Администратор', role: 'admin', created_at: '2024-01-15T10:00:00Z' },
  { id: '2', email: 'author@example.com', name: 'Иван Петров', role: 'author', created_at: '2024-01-16T10:00:00Z' },
  { id: '3', email: 'reviewer@example.com', name: 'Мария Георгиева', role: 'reviewer', created_at: '2024-01-17T10:00:00Z' },
  { id: '4', email: 'reader@example.com', name: 'Петър Димитров', role: 'reader', created_at: '2024-01-18T10:00:00Z' },
];

export const mockDocuments = [
  {
    id: 'doc-1',
    title: 'Технически спецификации на проекта',
    description: 'Детайлна документация за техническите изисквания',
    owner_id: '2',
    owner_name: 'Иван Петров',
    active_version_id: 'v-1-2',
    active_version_number: 2,
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-25T14:30:00Z',
    total_versions: 3,
  },
  {
    id: 'doc-2',
    title: 'Ръководство за потребителя',
    description: 'Инструкции за крайните потребители на системата',
    owner_id: '2',
    owner_name: 'Иван Петров',
    active_version_id: 'v-2-1',
    active_version_number: 1,
    created_at: '2024-01-22T09:00:00Z',
    updated_at: '2024-01-22T09:00:00Z',
    total_versions: 2,
  },
  {
    id: 'doc-3',
    title: 'Архитектурен план',
    description: 'Описание на системната архитектура и компонентите',
    owner_id: '2',
    owner_name: 'Иван Петров',
    active_version_id: null,
    active_version_number: null,
    created_at: '2024-01-24T11:00:00Z',
    updated_at: '2024-01-24T11:00:00Z',
    total_versions: 1,
  },
];

export const mockVersions = {
  'doc-1': [
    {
      id: 'v-1-3',
      document_id: 'doc-1',
      version_number: 3,
      content: `# Технически спецификации v3

## Обзор
Тази версия включва актуализирани изисквания за производителност.

## Изисквания
- Node.js >= 18
- MongoDB >= 6.0
- React >= 18

## API endpoints
- POST /api/auth/login
- GET /api/documents
- POST /api/documents`,
      change_summary: 'Добавени нови API ендпойнти',
      status: 'pending',
      author_id: '2',
      author_name: 'Иван Петров',
      created_at: '2024-01-26T10:00:00Z',
      reviewed_by: null,
      reviewed_at: null,
      review_comment: null,
    },
    {
      id: 'v-1-2',
      document_id: 'doc-1',
      version_number: 2,
      content: `# Технически спецификации v2

## Обзор
Документация за техническите изисквания на проекта.

## Изисквания
- Node.js >= 18
- MongoDB >= 6.0

## Архитектура
Микросервизна архитектура с REST API.`,
      change_summary: 'Добавена секция за архитектура',
      status: 'approved',
      author_id: '2',
      author_name: 'Иван Петров',
      created_at: '2024-01-25T14:30:00Z',
      reviewed_by: 'Мария Георгиева',
      reviewed_at: '2024-01-25T16:00:00Z',
      review_comment: 'Одобрено, много добра документация!',
    },
    {
      id: 'v-1-1',
      document_id: 'doc-1',
      version_number: 1,
      content: `# Технически спецификации

## Обзор
Първоначална версия на документацията.

## Изисквания
- Node.js >= 18`,
      change_summary: 'Първоначална версия',
      status: 'approved',
      author_id: '2',
      author_name: 'Иван Петров',
      created_at: '2024-01-20T10:00:00Z',
      reviewed_by: 'Мария Георгиева',
      reviewed_at: '2024-01-20T12:00:00Z',
      review_comment: 'Добро начало!',
    },
  ],
  'doc-2': [
    {
      id: 'v-2-2',
      document_id: 'doc-2',
      version_number: 2,
      content: `# Ръководство за потребителя v2

## Въведение
Това ръководство описва основните функции на системата.

## Вход в системата
1. Отидете на login страницата
2. Въведете email и парола
3. Натиснете \"Вход\"

## Създаване на документ
1. Кликнете на \"Нов документ\"
2. Въведете заглавие и описание
3. Запазете документа`,
      change_summary: 'Добавена секция за създаване на документ',
      status: 'draft',
      author_id: '2',
      author_name: 'Иван Петров',
      created_at: '2024-01-23T10:00:00Z',
      reviewed_by: null,
      reviewed_at: null,
      review_comment: null,
    },
    {
      id: 'v-2-1',
      document_id: 'doc-2',
      version_number: 1,
      content: `# Ръководство за потребителя

## Въведение
Това ръководство описва основните функции на системата.

## Вход в системата
1. Отидете на login страницата
2. Въведете email и парола
3. Натиснете \"Вход\"`,
      change_summary: 'Първоначална версия',
      status: 'approved',
      author_id: '2',
      author_name: 'Иван Петров',
      created_at: '2024-01-22T09:00:00Z',
      reviewed_by: 'Мария Георгиева',
      reviewed_at: '2024-01-22T11:00:00Z',
      review_comment: 'Одобрено',
    },
  ],
  'doc-3': [
    {
      id: 'v-3-1',
      document_id: 'doc-3',
      version_number: 1,
      content: `# Архитектурен план

## Компоненти
- Frontend: React
- Backend: Spring Boot
- Database: PostgreSQL

## Диаграма
[Тук ще бъде добавена диаграма]`,
      change_summary: 'Първоначална версия',
      status: 'draft',
      author_id: '2',
      author_name: 'Иван Петров',
      created_at: '2024-01-24T11:00:00Z',
      reviewed_by: null,
      reviewed_at: null,
      review_comment: null,
    },
  ],
};

export const mockAuditLogs = [
  { id: 'log-1', user_id: '2', user_name: 'Иван Петров', action: 'create_version', resource_type: 'version', resource_id: 'v-1-3', resource_name: 'v3 of Технически спецификации', details: null, created_at: '2024-01-26T10:00:00Z' },
  { id: 'log-2', user_id: '3', user_name: 'Мария Георгиева', action: 'approve', resource_type: 'version', resource_id: 'v-1-2', resource_name: 'v2 of Технически спецификации', details: 'Одобрено', created_at: '2024-01-25T16:00:00Z' },
  { id: 'log-3', user_id: '2', user_name: 'Иван Петров', action: 'submit_for_review', resource_type: 'version', resource_id: 'v-1-2', resource_name: 'v2 of Технически спецификации', details: null, created_at: '2024-01-25T14:30:00Z' },
  { id: 'log-4', user_id: '2', user_name: 'Иван Петров', action: 'create_document', resource_type: 'document', resource_id: 'doc-3', resource_name: 'Архитектурен план', details: null, created_at: '2024-01-24T11:00:00Z' },
  { id: 'log-5', user_id: '2', user_name: 'Иван Петров', action: 'create_document', resource_type: 'document', resource_id: 'doc-2', resource_name: 'Ръководство за потребителя', details: null, created_at: '2024-01-22T09:00:00Z' },
];

export const mockComments = {
  'v-1-2': [
    { id: 'c-1', version_id: 'v-1-2', author_id: '3', author_name: 'Мария Георгиева', content: 'Много добра документация! Може ли да добавите още примери?', created_at: '2024-01-25T15:00:00Z' },
    { id: 'c-2', version_id: 'v-1-2', author_id: '2', author_name: 'Иван Петров', content: 'Благодаря! Ще добавя примери в следващата версия.', created_at: '2024-01-25T15:30:00Z' },
  ],
};

// Mock API delay simulation
export const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));
"
Observation: Create successful: /app/frontend/src/lib/mockData.js