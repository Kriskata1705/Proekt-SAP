
Action: file_editor create /app/frontend/src/pages/Login.js --file-text "import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GitBranch, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Грешка при вход');
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
            <CardTitle className=\"text-2xl text-white\">DocVersion</CardTitle>
            <CardDescription className=\"text-zinc-400\">
              Система за управление на версии на документи
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
                <Label htmlFor=\"email\" className=\"text-zinc-300\">Email</Label>
                <Input
                  id=\"email\"
                  type=\"email\"
                  placeholder=\"email@example.com\"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className=\"bg-[#09090b] border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500\"
                  data-testid=\"login-email-input\"
                />
              </div>
              
              <div className=\"space-y-2\">
                <Label htmlFor=\"password\" className=\"text-zinc-300\">Парола</Label>
                <div className=\"relative\">
                  <Input
                    id=\"password\"
                    type={showPassword ? 'text' : 'password'}
                    placeholder=\"••••••••\"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className=\"bg-[#09090b] border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 pr-10\"
                    data-testid=\"login-password-input\"
                  />
                  <button
                    type=\"button\"
                    onClick={() => setShowPassword(!showPassword)}
                    className=\"absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300\"
                    data-testid=\"toggle-password-btn\"
                  >
                    {showPassword ? <EyeOff className=\"w-4 h-4\" /> : <Eye className=\"w-4 h-4\" />}
                  </button>
                </div>
              </div>

              {/* Demo credentials hint */}
              <div className=\"text-xs text-zinc-500 bg-zinc-800/50 rounded-md p-3\">
                <p className=\"font-medium text-zinc-400 mb-1\">Демо акаунти:</p>
                <p>admin@example.com, author@example.com, reviewer@example.com</p>
                <p className=\"mt-1 text-zinc-600\">(всяка парола работи за демото)</p>
              </div>
            </CardContent>
            
            <CardFooter className=\"flex flex-col gap-4\">
              <Button 
                type=\"submit\" 
                className=\"w-full bg-blue-600 hover:bg-blue-700 text-white\"
                disabled={loading}
                data-testid=\"login-submit-btn\"
              >
                {loading ? 'Влизане...' : 'Вход'}
              </Button>
              
              <p className=\"text-sm text-zinc-500 text-center\">
                Нямате акаунт?{' '}
                <Link to=\"/register\" className=\"text-blue-400 hover:text-blue-300\">
                  Регистрация
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
Observation: Create successful: /app/frontend/src/pages/Login.js