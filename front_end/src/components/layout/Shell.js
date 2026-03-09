
Action: file_editor create /app/frontend/src/components/layout/Shell.js --file-text "import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Clock, 
  Users, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  GitBranch
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const navItems = [
  { icon: LayoutDashboard, label: 'Табло', path: '/dashboard', roles: ['admin', 'author', 'reviewer', 'reader'] },
  { icon: FileText, label: 'Документи', path: '/documents', roles: ['admin', 'author', 'reviewer', 'reader'] },
  { icon: Clock, label: 'Лог на действията', path: '/audit-log', roles: ['admin', 'author', 'reviewer'] },
  { icon: Users, label: 'Потребители', path: '/users', roles: ['admin'] },
];

export function Shell({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.role || 'reader')
  );

  return (
    <div className=\"min-h-screen bg-[#09090b] flex\">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className=\"fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden\"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 240 }}
        className={cn(
          \"fixed lg:relative h-screen bg-[#18181b] border-r border-zinc-800 z-50 flex flex-col\",
          mobileOpen ? \"translate-x-0\" : \"-translate-x-full lg:translate-x-0\",
          \"transition-transform lg:transition-none\"
        )}
      >
        {/* Logo */}
        <div className=\"h-16 flex items-center px-4 border-b border-zinc-800\">
          <Link to=\"/dashboard\" className=\"flex items-center gap-3\">
            <div className=\"w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center\">
              <GitBranch className=\"w-5 h-5 text-white\" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className=\"font-bold text-white whitespace-nowrap overflow-hidden\"
                >
                  DocVersion
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Navigation */}
        <nav className=\"flex-1 p-3 space-y-1\">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`nav-${item.path.slice(1)}`}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  \"flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors\",
                  isActive 
                    ? \"bg-blue-600/20 text-blue-400\" 
                    : \"text-zinc-400 hover:text-white hover:bg-zinc-800\"
                )}
              >
                <item.icon className=\"w-5 h-5 flex-shrink-0\" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className=\"whitespace-nowrap\"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Collapse button - Desktop only */}
        <div className=\"hidden lg:block p-3 border-t border-zinc-800\">
          <Button
            variant=\"ghost\"
            size=\"sm\"
            onClick={() => setCollapsed(!collapsed)}
            className=\"w-full justify-center text-zinc-400 hover:text-white\"
            data-testid=\"sidebar-collapse-btn\"
          >
            {collapsed ? <ChevronRight className=\"w-5 h-5\" /> : <ChevronLeft className=\"w-5 h-5\" />}
          </Button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className=\"flex-1 flex flex-col min-h-screen\">
        {/* Header */}
        <header className=\"h-16 bg-[#18181b]/70 backdrop-blur-xl border-b border-zinc-800 flex items-center justify-between px-4 sticky top-0 z-30\">
          {/* Mobile menu button */}
          <Button
            variant=\"ghost\"
            size=\"icon\"
            className=\"lg:hidden text-zinc-400\"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-testid=\"mobile-menu-btn\"
          >
            {mobileOpen ? <X className=\"w-5 h-5\" /> : <Menu className=\"w-5 h-5\" />}
          </Button>

          <div className=\"flex-1\" />

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant=\"ghost\" className=\"flex items-center gap-2 text-zinc-300\" data-testid=\"user-menu-btn\">
                <Avatar className=\"w-8 h-8\">
                  <AvatarFallback className=\"bg-blue-600 text-white text-sm\">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className=\"hidden sm:inline\">{user?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align=\"end\" className=\"w-48 bg-[#18181b] border-zinc-800\">
              <div className=\"px-2 py-1.5\">
                <p className=\"text-sm font-medium text-white\">{user?.name}</p>
                <p className=\"text-xs text-zinc-500\">{user?.email}</p>
              </div>
              <DropdownMenuSeparator className=\"bg-zinc-800\" />
              <DropdownMenuItem 
                className=\"text-zinc-400 hover:text-white focus:text-white cursor-pointer\"
                onClick={() => navigate('/settings')}
                data-testid=\"settings-menu-item\"
              >
                <Settings className=\"w-4 h-4 mr-2\" />
                Настройки
              </DropdownMenuItem>
              <DropdownMenuSeparator className=\"bg-zinc-800\" />
              <DropdownMenuItem 
                className=\"text-rose-400 hover:text-rose-300 focus:text-rose-300 cursor-pointer\"
                onClick={handleLogout}
                data-testid=\"logout-menu-item\"
              >
                <LogOut className=\"w-4 h-4 mr-2\" />
                Изход
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page content */}
        <main className=\"flex-1 p-4 sm:p-6 lg:p-8\">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
"
Observation: Create successful: /app/frontend/src/components/layout/Shell.js