
Action: file_editor create /app/frontend/src/pages/Documents.js --file-text "import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  FileText, 
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  GitBranch
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Shell } from '../components/layout/Shell';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { formatRelativeDate } from '../lib/utils';
import { StatusBadge } from '../components/StatusBadge';

export default function Documents() {
  const { user } = useAuth();
  const { getDocuments, deleteDocument, getVersions } = useData();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [docStatuses, setDocStatuses] = useState({});

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const docs = await getDocuments();
      setDocuments(docs);
      
      // Load latest version status for each document
      const statuses = {};
      for (const doc of docs) {
        const versions = await getVersions(doc.id);
        if (versions.length > 0) {
          statuses[doc.id] = versions[0].status;
        }
      }
      setDocStatuses(statuses);
    } catch (err) {
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteDocument(deleteId, user);
      setDocuments(prev => prev.filter(d => d.id !== deleteId));
    } catch (err) {
      console.error('Error deleting document:', err);
    } finally {
      setDeleteId(null);
    }
  };

  const filteredDocs = documents.filter(doc =>
    doc.title.toLowerCase().includes(search.toLowerCase()) ||
    doc.description.toLowerCase().includes(search.toLowerCase())
  );

  const canCreate = ['admin', 'author'].includes(user?.role);
  const canEdit = (doc) => user?.role === 'admin' || doc.owner_id === user?.id;

  return (
    <Shell>
      <div className=\"space-y-6\" data-testid=\"documents-page\">
        {/* Header */}
        <div className=\"flex flex-col sm:flex-row sm:items-center justify-between gap-4\">
          <div>
            <h1 className=\"text-2xl font-bold text-white\">Документи</h1>
            <p className=\"text-zinc-400 mt-1\">Управление на документи и версии</p>
          </div>
          {canCreate && (
            <Link to=\"/documents/new\">
              <Button className=\"bg-blue-600 hover:bg-blue-700\" data-testid=\"create-document-btn\">
                <Plus className=\"w-4 h-4 mr-2\" />
                Нов документ
              </Button>
            </Link>
          )}
        </div>

        {/* Search */}
        <div className=\"relative max-w-md\">
          <Search className=\"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500\" />
          <Input
            placeholder=\"Търсене на документи...\"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className=\"pl-10 bg-[#18181b] border-zinc-700 text-white placeholder:text-zinc-500\"
            data-testid=\"search-documents-input\"
          />
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4\">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className=\"h-40 bg-zinc-800/50 rounded-lg animate-pulse\" />
            ))}
          </div>
        ) : filteredDocs.length === 0 ? (
          <Card className=\"bg-[#18181b] border-zinc-800\">
            <CardContent className=\"py-16 text-center\">
              <FileText className=\"w-16 h-16 mx-auto mb-4 text-zinc-700\" />
              <h3 className=\"text-lg font-medium text-white mb-2\">
                {search ? 'Няма намерени документи' : 'Няма документи'}
              </h3>
              <p className=\"text-zinc-500 mb-4\">
                {search 
                  ? 'Опитайте с друга ключова дума'
                  : 'Създайте първия си документ за да започнете'
                }
              </p>
              {canCreate && !search && (
                <Link to=\"/documents/new\">
                  <Button className=\"bg-blue-600 hover:bg-blue-700\">
                    <Plus className=\"w-4 h-4 mr-2\" />
                    Създай документ
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4\">
            {filteredDocs.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className=\"bg-[#18181b] border-zinc-800 hover:border-zinc-700 transition-colors h-full\"
                  data-testid={`document-card-${doc.id}`}
                >
                  <CardContent className=\"p-5\">
                    <div className=\"flex items-start justify-between gap-2\">
                      <Link 
                        to={`/documents/${doc.id}`}
                        className=\"flex-1 min-w-0\"
                      >
                        <h3 className=\"font-semibold text-white hover:text-blue-400 transition-colors truncate\">
                          {doc.title}
                        </h3>
                      </Link>
                      
                      {canEdit(doc) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant=\"ghost\" size=\"icon\" className=\"h-8 w-8 text-zinc-400 hover:text-white\">
                              <MoreVertical className=\"w-4 h-4\" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align=\"end\" className=\"bg-[#18181b] border-zinc-700\">
                            <DropdownMenuItem 
                              className=\"text-zinc-300 cursor-pointer\"
                              onClick={() => navigate(`/documents/${doc.id}`)}
                            >
                              <Eye className=\"w-4 h-4 mr-2\" />
                              Преглед
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className=\"text-zinc-300 cursor-pointer\"
                              onClick={() => navigate(`/documents/${doc.id}/edit`)}
                            >
                              <Pencil className=\"w-4 h-4 mr-2\" />
                              Редактирай
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className=\"bg-zinc-700\" />
                            <DropdownMenuItem 
                              className=\"text-rose-400 cursor-pointer\"
                              onClick={() => setDeleteId(doc.id)}
                            >
                              <Trash2 className=\"w-4 h-4 mr-2\" />
                              Изтрий
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    
                    <p className=\"text-sm text-zinc-500 mt-2 line-clamp-2\">
                      {doc.description || 'Без описание'}
                    </p>
                    
                    <div className=\"flex items-center gap-3 mt-4 pt-4 border-t border-zinc-800\">
                      <div className=\"flex items-center gap-1.5 text-xs text-zinc-500\">
                        <GitBranch className=\"w-3.5 h-3.5\" />
                        <span>{doc.total_versions} версии</span>
                      </div>
                      
                      {doc.active_version_number && (
                        <span className=\"text-xs font-mono text-emerald-500\">
                          v{doc.active_version_number} активна
                        </span>
                      )}
                      
                      {docStatuses[doc.id] && (
                        <StatusBadge status={docStatuses[doc.id]} />
                      )}
                    </div>
                    
                    <div className=\"flex items-center justify-between mt-3 text-xs text-zinc-600\">
                      <span>{doc.owner_name}</span>
                      <span>{formatRelativeDate(doc.updated_at)}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent className=\"bg-[#18181b] border-zinc-800\">
            <AlertDialogHeader>
              <AlertDialogTitle className=\"text-white\">Изтриване на документ</AlertDialogTitle>
              <AlertDialogDescription className=\"text-zinc-400\">
                Сигурни ли сте, че искате да изтриете този документ? Това действие е необратимо и ще изтрие всички версии.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className=\"bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700\">
                Отказ
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className=\"bg-rose-600 hover:bg-rose-700 text-white\"
                data-testid=\"confirm-delete-btn\"
              >
                Изтрий
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Shell>
  );
}
"
Observation: Create successful: /app/frontend/src/pages/Documents.js