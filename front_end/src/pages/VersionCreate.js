
Action: file_editor create /app/frontend/src/pages/VersionCreate.js --file-text "import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Shell } from '../components/layout/Shell';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';

export default function VersionCreate() {
  const { id: docId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getDocument, getVersions, createVersion } = useData();
  
  const [document, setDocument] = useState(null);
  const [formData, setFormData] = useState({
    content: '',
    change_summary: '',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [docId]);

  const loadData = async () => {
    try {
      const [doc, versions] = await Promise.all([
        getDocument(docId),
        getVersions(docId)
      ]);
      
      if (!doc) {
        navigate('/documents');
        return;
      }
      
      setDocument(doc);
      
      // Pre-fill content from last version if exists
      if (versions.length > 0) {
        setFormData(prev => ({
          ...prev,
          content: versions[0].content
        }));
      }
    } catch (err) {
      console.error('Error loading document:', err);
      navigate('/documents');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      toast.error('Съдържанието е задължително');
      return;
    }
    
    setLoading(true);
    try {
      await createVersion(docId, formData, user);
      toast.success('Версията е създадена');
      navigate(`/documents/${docId}`);
    } catch (err) {
      toast.error('Грешка при създаване');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
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
      <div className=\"max-w-4xl mx-auto\" data-testid=\"version-create-page\">
        {/* Header */}
        <div className=\"flex items-center gap-4 mb-6\">
          <Button 
            variant=\"ghost\" 
            size=\"icon\"
            onClick={() => navigate(`/documents/${docId}`)}
            className=\"text-zinc-400 hover:text-white\"
          >
            <ArrowLeft className=\"w-5 h-5\" />
          </Button>
          <div>
            <h1 className=\"text-2xl font-bold text-white\">Нова версия</h1>
            <p className=\"text-zinc-400 text-sm\">{document?.title}</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className=\"bg-[#18181b] border-zinc-800\">
            <CardHeader>
              <CardTitle className=\"text-white\">Съдържание на версията</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className=\"space-y-6\">
                <div className=\"space-y-2\">
                  <Label htmlFor=\"content\" className=\"text-zinc-300\">Съдържание *</Label>
                  <Textarea
                    id=\"content\"
                    value={formData.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                    placeholder=\"Въведете съдържанието на документа...\"
                    rows={16}
                    className=\"bg-[#09090b] border-zinc-700 text-white placeholder:text-zinc-500 font-mono text-sm\"
                    data-testid=\"version-content-input\"
                  />
                </div>
                
                <div className=\"space-y-2\">
                  <Label htmlFor=\"change_summary\" className=\"text-zinc-300\">Описание на промените</Label>
                  <Input
                    id=\"change_summary\"
                    value={formData.change_summary}
                    onChange={(e) => handleChange('change_summary', e.target.value)}
                    placeholder=\"Кратко описание на направените промени\"
                    className=\"bg-[#09090b] border-zinc-700 text-white placeholder:text-zinc-500\"
                    data-testid=\"version-summary-input\"
                  />
                </div>
                
                <div className=\"flex gap-3 pt-4\">
                  <Button 
                    type=\"button\"
                    variant=\"outline\"
                    onClick={() => navigate(`/documents/${docId}`)}
                    className=\"border-zinc-700 text-zinc-300\"
                  >
                    Отказ
                  </Button>
                  <Button 
                    type=\"submit\"
                    disabled={loading}
                    className=\"bg-blue-600 hover:bg-blue-700\"
                    data-testid=\"save-version-btn\"
                  >
                    <Save className=\"w-4 h-4 mr-2\" />
                    {loading ? 'Създаване...' : 'Създай версия'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Shell>
  );
}
"
Observation: Create successful: /app/frontend/src/pages/VersionCreate.js