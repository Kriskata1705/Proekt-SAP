
Action: file_editor create /app/frontend/src/pages/Settings.js --file-text "import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Shell } from '../components/layout/Shell';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { RoleBadge } from '../components/StatusBadge';
import { toast } from 'sonner';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Името е задължително');
      return;
    }
    
    setLoading(true);
    try {
      updateUser({ ...user, name });
      toast.success('Профилът е актуализиран');
    } catch (err) {
      toast.error('Грешка при запазване');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <div className=\"max-w-2xl mx-auto space-y-6\" data-testid=\"settings-page\">
        {/* Header */}
        <div>
          <h1 className=\"text-2xl font-bold text-white\">Настройки</h1>
          <p className=\"text-zinc-400 mt-1\">Управление на вашия профил</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className=\"bg-[#18181b] border-zinc-800\">
            <CardHeader>
              <CardTitle className=\"text-white flex items-center gap-2\">
                <User className=\"w-5 h-5\" />
                Профил
              </CardTitle>
              <CardDescription className=\"text-zinc-400\">
                Информация за вашия акаунт
              </CardDescription>
            </CardHeader>
            <CardContent className=\"space-y-6\">
              <div className=\"space-y-2\">
                <Label htmlFor=\"email\" className=\"text-zinc-300\">Email</Label>
                <Input
                  id=\"email\"
                  value={user?.email || ''}
                  disabled
                  className=\"bg-[#09090b] border-zinc-700 text-zinc-500\"
                />
                <p className=\"text-xs text-zinc-600\">Email адресът не може да бъде променян</p>
              </div>
              
              <div className=\"space-y-2\">
                <Label htmlFor=\"name\" className=\"text-zinc-300\">Име</Label>
                <Input
                  id=\"name\"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className=\"bg-[#09090b] border-zinc-700 text-white\"
                  data-testid=\"settings-name-input\"
                />
              </div>
              
              <div className=\"space-y-2\">
                <Label className=\"text-zinc-300\">Роля</Label>
                <div className=\"pt-1\">
                  <RoleBadge role={user?.role || 'reader'} />
                </div>
                <p className=\"text-xs text-zinc-600\">Ролята може да бъде променена само от администратор</p>
              </div>
              
              <div className=\"pt-4\">
                <Button 
                  onClick={handleSave}
                  disabled={loading || name === user?.name}
                  className=\"bg-blue-600 hover:bg-blue-700\"
                  data-testid=\"save-settings-btn\"
                >
                  <Save className=\"w-4 h-4 mr-2\" />
                  {loading ? 'Запазване...' : 'Запази промените'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* API Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className=\"bg-[#18181b] border-zinc-800\">
            <CardHeader>
              <CardTitle className=\"text-white\">API Конфигурация</CardTitle>
              <CardDescription className=\"text-zinc-400\">
                Информация за връзка с бекенда
              </CardDescription>
            </CardHeader>
            <CardContent className=\"space-y-4\">
              <div>
                <Label className=\"text-zinc-300 text-sm\">Backend URL</Label>
                <code className=\"block mt-1 p-2 bg-[#09090b] rounded text-sm text-zinc-400 font-mono\">
                  {process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080'}
                </code>
              </div>
              <p className=\"text-xs text-zinc-600\">
                За да свържете със Spring Boot бекенда, уверете се че REACT_APP_BACKEND_URL е конфигуриран правилно в .env файла.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Shell>
  );
}
"
Observation: Create successful: /app/frontend/src/pages/Settings.js