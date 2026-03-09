
Action: file_editor create /app/frontend/src/pages/DocumentDetail.js --file-text "import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Pencil, 
  Download,
  GitCompare,
  Send,
  CheckCircle,
  XCircle,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Shell } from '../components/layout/Shell';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Textarea } from '../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { VersionTimeline } from '../components/VersionTimeline';
import { DiffViewer } from '../components/DiffViewer';
import { StatusBadge } from '../components/StatusBadge';
import { formatDate } from '../lib/utils';
import { toast } from 'sonner';

export default function DocumentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getDocument, getVersions, submitForReview, reviewVersion, getComments, addComment } = useData();
  
  const [document, setDocument] = useState(null);
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  
  // Review dialog
  const [reviewDialog, setReviewDialog] = useState({ open: false, action: null });
  const [reviewComment, setReviewComment] = useState('');
  
  // Diff dialog
  const [diffDialog, setDiffDialog] = useState({ open: false });
  const [diffV1, setDiffV1] = useState('');
  const [diffV2, setDiffV2] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [doc, vers] = await Promise.all([
        getDocument(id),
        getVersions(id)
      ]);
      
      if (!doc) {
        navigate('/documents');
        return;
      }
      
      setDocument(doc);
      setVersions(vers);
      
      if (vers.length > 0) {
        setSelectedVersion(vers[0]);
        const cmts = await getComments(vers[0].id);
        setComments(cmts);
      }
    } catch (err) {
      console.error('Error loading document:', err);
      navigate('/documents');
    } finally {
      setLoading(false);
    }
  };

  const handleVersionClick = async (version) => {
    setSelectedVersion(version);
    const cmts = await getComments(version.id);
    setComments(cmts);
  };

  const handleSubmitForReview = async () => {
    if (!selectedVersion) return;
    try {
      await submitForReview(id, selectedVersion.id, user);
      toast.success('Версията е изпратена за преглед');
      loadData();
    } catch (err) {
      toast.error('Грешка при изпращане');
    }
  };

  const handleReview = async () => {
    if (!selectedVersion || !reviewDialog.action) return;
    try {
      await reviewVersion(id, selectedVersion.id, reviewDialog.action, reviewComment, user);
      toast.success(reviewDialog.action === 'approve' ? 'Версията е одобрена' : 'Версията е отхвърлена');
      setReviewDialog({ open: false, action: null });
      setReviewComment('');
      loadData();
    } catch (err) {
      toast.error('Грешка при преглед');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedVersion) return;
    setSubmittingComment(true);
    try {
      await addComment(selectedVersion.id, newComment, user);
      const cmts = await getComments(selectedVersion.id);
      setComments(cmts);
      setNewComment('');
      toast.success('Коментарът е добавен');
    } catch (err) {
      toast.error('Грешка при добавяне на коментар');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleExport = (format) => {
    if (!selectedVersion) return;
    
    const content = `${document.title}\n${'='.repeat(document.title.length)}\n\nВерсия: ${selectedVersion.version_number}\nАвтор: ${selectedVersion.author_name}\nДата: ${formatDate(selectedVersion.created_at)}\n\n${selectedVersion.content}`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.title}_v${selectedVersion.version_number}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(`Експортирано като ${format.toUpperCase()}`);
  };

  const handleShowDiff = () => {
    if (versions.length < 2) {
      toast.error('Нужни са поне 2 версии за сравнение');
      return;
    }
    setDiffV1(String(versions[1]?.version_number || 1));
    setDiffV2(String(versions[0]?.version_number || 2));
    setDiffDialog({ open: true });
  };

  const getDiffVersions = () => {
    const v1 = versions.find(v => v.version_number === parseInt(diffV1));
    const v2 = versions.find(v => v.version_number === parseInt(diffV2));
    return { v1, v2 };
  };

  const canEdit = user?.role === 'admin' || document?.owner_id === user?.id;
  const canReview = ['admin', 'reviewer'].includes(user?.role);
  const canComment = ['admin', 'author', 'reviewer'].includes(user?.role);

  if (loading) {
    return (
      <Shell>
        <div className=\"animate-pulse space-y-4\">
          <div className=\"h-8 w-64 bg-zinc-800 rounded\" />
          <div className=\"h-96 bg-zinc-800 rounded-lg\" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className=\"space-y-6\" data-testid=\"document-detail-page\">
        {/* Header */}
        <div className=\"flex flex-col sm:flex-row sm:items-center justify-between gap-4\">
          <div className=\"flex items-center gap-4\">
            <Button 
              variant=\"ghost\" 
              size=\"icon\"
              onClick={() => navigate('/documents')}
              className=\"text-zinc-400 hover:text-white\"
              data-testid=\"back-btn\"
            >
              <ArrowLeft className=\"w-5 h-5\" />
            </Button>
            <div>
              <h1 className=\"text-2xl font-bold text-white\">{document?.title}</h1>
              <p className=\"text-zinc-400 text-sm mt-0.5\">
                {document?.description || 'Без описание'}
              </p>
            </div>
          </div>
          
          <div className=\"flex items-center gap-2 flex-wrap\">
            {versions.length >= 2 && (
              <Button 
                variant=\"outline\" 
                onClick={handleShowDiff}
                className=\"border-zinc-700 text-zinc-300 hover:text-white\"
                data-testid=\"compare-versions-btn\"
              >
                <GitCompare className=\"w-4 h-4 mr-2\" />
                Сравни
              </Button>
            )}
            
            {selectedVersion?.status === 'approved' && (
              <Button 
                variant=\"outline\"
                onClick={() => handleExport('txt')}
                className=\"border-zinc-700 text-zinc-300 hover:text-white\"
                data-testid=\"export-btn\"
              >
                <Download className=\"w-4 h-4 mr-2\" />
                Експорт
              </Button>
            )}
            
            {canEdit && (
              <Link to={`/documents/${id}/versions/new`}>
                <Button className=\"bg-blue-600 hover:bg-blue-700\" data-testid=\"new-version-btn\">
                  <Plus className=\"w-4 h-4 mr-2\" />
                  Нова версия
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Content */}
        <div className=\"grid grid-cols-1 lg:grid-cols-3 gap-6\">
          {/* Version Timeline */}
          <Card className=\"bg-[#18181b] border-zinc-800 lg:col-span-1\">
            <CardHeader>
              <CardTitle className=\"text-white text-lg\">История на версиите</CardTitle>
            </CardHeader>
            <CardContent>
              {versions.length === 0 ? (
                <div className=\"text-center py-8 text-zinc-500\">
                  <p>Няма версии</p>
                  {canEdit && (
                    <Link to={`/documents/${id}/versions/new`}>
                      <Button className=\"mt-4 bg-blue-600 hover:bg-blue-700\" size=\"sm\">
                        <Plus className=\"w-4 h-4 mr-2\" />
                        Създай първа версия
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <VersionTimeline
                  versions={versions}
                  activeVersionId={document?.active_version_id}
                  selectedVersionId={selectedVersion?.id}
                  onVersionClick={handleVersionClick}
                />
              )}
            </CardContent>
          </Card>

          {/* Version Content */}
          <Card className=\"bg-[#18181b] border-zinc-800 lg:col-span-2\">
            {selectedVersion ? (
              <Tabs defaultValue=\"content\">
                <CardHeader className=\"pb-0\">
                  <div className=\"flex items-center justify-between\">
                    <div className=\"flex items-center gap-3\">
                      <span className=\"font-mono text-lg text-white\">
                        v{selectedVersion.version_number}
                      </span>
                      <StatusBadge status={selectedVersion.status} />
                    </div>
                    
                    <TabsList className=\"bg-zinc-800/50\">
                      <TabsTrigger value=\"content\" className=\"data-[state=active]:bg-zinc-700\">
                        Съдържание
                      </TabsTrigger>
                      <TabsTrigger value=\"comments\" className=\"data-[state=active]:bg-zinc-700\">
                        Коментари ({comments.length})
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <div className=\"flex items-center gap-4 text-sm text-zinc-500 mt-2\">
                    <span>{selectedVersion.author_name}</span>
                    <span>{formatDate(selectedVersion.created_at)}</span>
                  </div>
                </CardHeader>
                
                <CardContent className=\"pt-4\">
                  <TabsContent value=\"content\" className=\"mt-0\">
                    {/* Actions */}
                    {selectedVersion.status === 'draft' && canEdit && (
                      <div className=\"flex gap-2 mb-4\">
                        <Link to={`/documents/${id}/versions/${selectedVersion.id}/edit`}>
                          <Button variant=\"outline\" size=\"sm\" className=\"border-zinc-700\">
                            <Pencil className=\"w-4 h-4 mr-2\" />
                            Редактирай
                          </Button>
                        </Link>
                        <Button 
                          size=\"sm\" 
                          onClick={handleSubmitForReview}
                          className=\"bg-amber-600 hover:bg-amber-700\"
                          data-testid=\"submit-review-btn\"
                        >
                          <Send className=\"w-4 h-4 mr-2\" />
                          Изпрати за преглед
                        </Button>
                      </div>
                    )}
                    
                    {selectedVersion.status === 'pending' && canReview && (
                      <div className=\"flex gap-2 mb-4\">
                        <Button 
                          size=\"sm\" 
                          onClick={() => setReviewDialog({ open: true, action: 'approve' })}
                          className=\"bg-emerald-600 hover:bg-emerald-700\"
                          data-testid=\"approve-btn\"
                        >
                          <CheckCircle className=\"w-4 h-4 mr-2\" />
                          Одобри
                        </Button>
                        <Button 
                          size=\"sm\"
                          variant=\"outline\"
                          onClick={() => setReviewDialog({ open: true, action: 'reject' })}
                          className=\"border-rose-600 text-rose-400 hover:bg-rose-600/20\"
                          data-testid=\"reject-btn\"
                        >
                          <XCircle className=\"w-4 h-4 mr-2\" />
                          Отхвърли
                        </Button>
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className=\"bg-[#09090b] rounded-md p-4 font-mono text-sm text-zinc-300 whitespace-pre-wrap max-h-[500px] overflow-auto\">
                      {selectedVersion.content}
                    </div>
                    
                    {selectedVersion.change_summary && (
                      <p className=\"mt-4 text-sm text-zinc-500\">
                        <span className=\"text-zinc-400\">Промени:</span> {selectedVersion.change_summary}
                      </p>
                    )}
                    
                    {selectedVersion.reviewed_by && (
                      <div className=\"mt-4 p-3 bg-zinc-800/50 rounded-md\">
                        <p className=\"text-sm text-zinc-400\">
                          Прегледана от <span className=\"text-white\">{selectedVersion.reviewed_by}</span>
                          {' '}на {formatDate(selectedVersion.reviewed_at)}
                        </p>
                        {selectedVersion.review_comment && (
                          <p className=\"text-sm text-zinc-300 mt-1 italic\">
                            \"{selectedVersion.review_comment}\"
                          </p>
                        )}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value=\"comments\" className=\"mt-0\">
                    <div className=\"space-y-4\">
                      {comments.length === 0 ? (
                        <p className=\"text-center text-zinc-500 py-8\">Няма коментари</p>
                      ) : (
                        comments.map(comment => (
                          <div key={comment.id} className=\"p-3 bg-zinc-800/50 rounded-md\">
                            <div className=\"flex items-center justify-between\">
                              <span className=\"text-sm font-medium text-white\">{comment.author_name}</span>
                              <span className=\"text-xs text-zinc-500\">{formatDate(comment.created_at)}</span>
                            </div>
                            <p className=\"text-sm text-zinc-300 mt-1\">{comment.content}</p>
                          </div>
                        ))
                      )}
                      
                      {canComment && (
                        <div className=\"pt-4 border-t border-zinc-800\">
                          <Textarea
                            placeholder=\"Добави коментар...\"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className=\"bg-[#09090b] border-zinc-700 text-white\"
                            data-testid=\"comment-input\"
                          />
                          <Button 
                            onClick={handleAddComment}
                            disabled={!newComment.trim() || submittingComment}
                            className=\"mt-2 bg-blue-600 hover:bg-blue-700\"
                            data-testid=\"add-comment-btn\"
                          >
                            <MessageSquare className=\"w-4 h-4 mr-2\" />
                            {submittingComment ? 'Добавяне...' : 'Добави'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            ) : (
              <CardContent className=\"py-16 text-center\">
                <p className=\"text-zinc-500\">Изберете версия за преглед</p>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Review Dialog */}
        <Dialog open={reviewDialog.open} onOpenChange={(open) => setReviewDialog({ open, action: reviewDialog.action })}>
          <DialogContent className=\"bg-[#18181b] border-zinc-800\">
            <DialogHeader>
              <DialogTitle className=\"text-white\">
                {reviewDialog.action === 'approve' ? 'Одобряване на версия' : 'Отхвърляне на версия'}
              </DialogTitle>
              <DialogDescription className=\"text-zinc-400\">
                {reviewDialog.action === 'approve' 
                  ? 'Тази версия ще стане активна след одобрение.'
                  : 'Версията ще бъде маркирана като отхвърлена.'
                }
              </DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder=\"Коментар (незадължителен)...\"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className=\"bg-[#09090b] border-zinc-700 text-white\"
              data-testid=\"review-comment-input\"
            />
            <DialogFooter>
              <Button variant=\"outline\" onClick={() => setReviewDialog({ open: false, action: null })} className=\"border-zinc-700\">
                Отказ
              </Button>
              <Button 
                onClick={handleReview}
                className={reviewDialog.action === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}
                data-testid=\"confirm-review-btn\"
              >
                {reviewDialog.action === 'approve' ? 'Одобри' : 'Отхвърли'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diff Dialog */}
        <Dialog open={diffDialog.open} onOpenChange={(open) => setDiffDialog({ open })}>
          <DialogContent className=\"bg-[#18181b] border-zinc-800 max-w-4xl\">
            <DialogHeader>
              <DialogTitle className=\"text-white\">Сравнение на версии</DialogTitle>
            </DialogHeader>
            
            <div className=\"flex gap-4 mb-4\">
              <div className=\"flex-1\">
                <label className=\"text-sm text-zinc-400 mb-1 block\">Версия 1</label>
                <Select value={diffV1} onValueChange={setDiffV1}>
                  <SelectTrigger className=\"bg-[#09090b] border-zinc-700\">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className=\"bg-[#18181b] border-zinc-700\">
                    {versions.map(v => (
                      <SelectItem key={v.id} value={String(v.version_number)}>
                        v{v.version_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className=\"flex-1\">
                <label className=\"text-sm text-zinc-400 mb-1 block\">Версия 2</label>
                <Select value={diffV2} onValueChange={setDiffV2}>
                  <SelectTrigger className=\"bg-[#09090b] border-zinc-700\">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className=\"bg-[#18181b] border-zinc-700\">
                    {versions.map(v => (
                      <SelectItem key={v.id} value={String(v.version_number)}>
                        v{v.version_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className=\"max-h-[500px] overflow-auto\">
              {(() => {
                const { v1, v2 } = getDiffVersions();
                if (!v1 || !v2) return <p className=\"text-zinc-500\">Изберете версии за сравнение</p>;
                return (
                  <DiffViewer 
                    oldText={v1.content} 
                    newText={v2.content}
                    oldLabel={`v${v1.version_number}`}
                    newLabel={`v${v2.version_number}`}
                  />
                );
              })()}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Shell>
  );
}
"
Observation: Create successful: /app/frontend/src/pages/DocumentDetail.js