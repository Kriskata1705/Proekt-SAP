
Action: file_editor create /app/frontend/src/pages/Register.js --file-text "import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GitBranch, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'reader',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Паролите не съвпадат');
      return;
    }

    if (formData.password.length < 6) {
      setError('Паролата трябва да е поне 6 символа');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Грешка при регистрация');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=\"min-h-screen bg-[#09090b] flex items-center justify-center p-4 grid-pattern\">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className=\"w-full max-w-md\"
      >
        <Card className=\"bg-[#18181b] border-zinc-800\">
          <CardHeader className=\"text-center\">
            <div className=\"mx-auto w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4\">
              <GitBranch className=\"w-7 h-7 text-white\" />
            </div>
            <CardTitle className=\"text-2xl text-white\">Регистрация</CardTitle>
            <CardDescription className=\"text-zinc-400\">
              Създайте нов акаунт в системата
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className=\"space-y-4\">
              {error && (
                <Alert variant=\"destructive\" className=\"bg-rose-500/10 border-rose-500/30 text-rose-400\">
                  <AlertCircle className=\"h-4 w-4\" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className=\"space-y-2\">
                <Label htmlFor=\"name\" className=\"text-zinc-300\">Име</Label>
                <Input
                  id=\"name\"
                  type=\"text\"
                  placeholder=\"Иван Петров\"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  className=\"bg-[#09090b] border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500\"
                  data-testid=\"register-name-input\"
                />
              </div>
              
              <div className=\"space-y-2\">
                <Label htmlFor=\"email\" className=\"text-zinc-300\">Email</Label>
                <Input
                  id=\"email\"
                  type=\"email\"
                  placeholder=\"email@example.com\"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  className=\"bg-[#09090b] border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500\"
                  data-testid=\"register-email-input\"
                />
              </div>

              <div className=\"space-y-2\">
                <Label htmlFor=\"role\" className=\"text-zinc-300\">Роля</Label>
                <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
                  <SelectTrigger className=\"bg-[#09090b] border-zinc-700 text-white\" data-testid=\"register-role-select\">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className=\"bg-[#18181b] border-zinc-700\">
                    <SelectItem value=\"reader\">Читател</SelectItem>
                    <SelectItem value=\"author\">Автор</SelectItem>
                    <SelectItem value=\"reviewer\">Рецензент</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className=\"space-y-2\">
                <Label htmlFor=\"password\" className=\"text-zinc-300\">Парола</Label>
                <div className=\"relative\">
                  <Input
                    id=\"password\"
                    type={showPassword ? 'text' : 'password'}
                    placeholder=\"••••••••\"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    required
                    className=\"bg-[#09090b] border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 pr-10\"
                    data-testid=\"register-password-input\"
                  />
                  <button
                    type=\"button\"
                    onClick={() => setShowPassword(!showPassword)}
                    className=\"absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300\"
                  >
                    {showPassword ? <EyeOff className=\"w-4 h-4\" /> : <Eye className=\"w-4 h-4\" />}
                  </button>
                </div>
              </div>

              <div className=\"space-y-2\">
                <Label htmlFor=\"confirmPassword\" className=\"text-zinc-300\">Потвърди парола</Label>
                <Input
                  id=\"confirmPassword\"
                  type={showPassword ? 'text' : 'password'}
                  placeholder=\"••••••••\"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  required
                  className=\"bg-[#09090b] border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500\"
                  data-testid=\"register-confirm-password-input\"
                />
              </div>
            </CardContent>
            
            <CardFooter className=\"flex flex-col gap-4\">
              <Button 
                type=\"submit\" 
                className=\"w-full bg-blue-600 hover:bg-blue-700 text-white\"
                disabled={loading}
                data-testid=\"register-submit-btn\"
              >
                {loading ? 'Регистрация...' : 'Регистрация'}
              </Button>
              
              <p className=\"text-sm text-zinc-500 text-center\">
                Вече имате акаунт?{' '}
                <Link to=\"/login\" className=\"text-blue-400 hover:text-blue-300\">
                  Вход
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
"
Observation: Create successful: /app/frontend/src/pages/Register.js