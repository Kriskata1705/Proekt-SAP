
Action: file_editor create /app/frontend/src/pages/DocumentCreate.js --file-text "import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function DocumentCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createDocument } = useData();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Заглавието е задължително');
      return;
    }
    
    setLoading(true);
    try {
      const doc = await createDocument(formData, user);
      toast.success('Документът е създаден');
      navigate(`/documents/${doc.id}`);
    } catch (err) {
      toast.error('Грешка при създаване');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <div className=\"max-w-2xl mx-auto\" data-testid=\"document-create-page\">
        {/* Header */}
        <div className=\"flex items-center gap-4 mb-6\">
          <Button 
            variant=\"ghost\" 
            size=\"icon\"
            onClick={() => navigate('/documents')}
            className=\"text-zinc-400 hover:text-white\"
          >
            <ArrowLeft className=\"w-5 h-5\" />
          </Button>
          <h1 className=\"text-2xl font-bold text-white\">Нов документ</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className=\"bg-[#18181b] border-zinc-800\">
            <CardHeader>
              <CardTitle className=\"text-white\">Информация за документа</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className=\"space-y-6\">
                <div className=\"space-y-2\">
                  <Label htmlFor=\"title\" className=\"text-zinc-300\">Заглавие *</Label>
                  <Input
                    id=\"title\"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder=\"Въведете заглавие на документа\"
                    className=\"bg-[#09090b] border-zinc-700 text-white placeholder:text-zinc-500\"
                    data-testid=\"document-title-input\"
                  />
                </div>
                
                <div className=\"space-y-2\">
                  <Label htmlFor=\"description\" className=\"text-zinc-300\">Описание</Label>
                  <Textarea
                    id=\"description\"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder=\"Кратко описание на документа (незадължително)\"
                    rows={4}
                    className=\"bg-[#09090b] border-zinc-700 text-white placeholder:text-zinc-500\"
                    data-testid=\"document-description-input\"
                  />
                </div>
                
                <div className=\"flex gap-3 pt-4\">
                  <Button 
                    type=\"button\"
                    variant=\"outline\"
                    onClick={() => navigate('/documents')}
                    className=\"border-zinc-700 text-zinc-300\"
                  >
                    Отказ
                  </Button>
                  <Button 
                    type=\"submit\"
                    disabled={loading}
                    className=\"bg-blue-600 hover:bg-blue-700\"
                    data-testid=\"save-document-btn\"
                  >
                    <Save className=\"w-4 h-4 mr-2\" />
                    {loading ? 'Създаване...' : 'Създай документ'}
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
Observation: Create successful: /app/frontend/src/pages/DocumentCreate.js