
Action: file_editor create /app/frontend/src/pages/AuditLog.js --file-text "import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  FileText, 
  User, 
  CheckCircle, 
  XCircle,
  MessageSquare,
  Download,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Shell } from '../components/layout/Shell';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { formatDate, getActionLabel } from '../lib/utils';

const actionIcons = {
  'create_document': FileText,
  'update_document': FileText,
  'delete_document': FileText,
  'create_version': FileText,
  'update_version': FileText,
  'submit_for_review': Clock,
  'approve': CheckCircle,
  'reject': XCircle,
  'add_comment': MessageSquare,
  'export': Download,
  'login': User,
  'register': User,
  'update_user': User,
  'delete_user': User,
};

const actionColors = {
  'create_document': 'text-blue-400 bg-blue-600/20',
  'update_document': 'text-blue-400 bg-blue-600/20',
  'delete_document': 'text-rose-400 bg-rose-600/20',
  'create_version': 'text-emerald-400 bg-emerald-600/20',
  'update_version': 'text-emerald-400 bg-emerald-600/20',
  'submit_for_review': 'text-amber-400 bg-amber-600/20',
  'approve': 'text-emerald-400 bg-emerald-600/20',
  'reject': 'text-rose-400 bg-rose-600/20',
  'add_comment': 'text-purple-400 bg-purple-600/20',
  'export': 'text-cyan-400 bg-cyan-600/20',
  'login': 'text-zinc-400 bg-zinc-600/20',
  'register': 'text-zinc-400 bg-zinc-600/20',
  'update_user': 'text-amber-400 bg-amber-600/20',
  'delete_user': 'text-rose-400 bg-rose-600/20',
};

export default function AuditLog() {
  const { user } = useAuth();
  const { getAuditLogs } = useData();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await getAuditLogs(200);
      setLogs(data);
    } catch (err) {
      console.error('Error loading audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.user_name.toLowerCase().includes(search.toLowerCase()) ||
      log.resource_name.toLowerCase().includes(search.toLowerCase()) ||
      getActionLabel(log.action).toLowerCase().includes(search.toLowerCase());
    
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    
    return matchesSearch && matchesAction;
  });

  const uniqueActions = [...new Set(logs.map(log => log.action))];

  return (
    <Shell>
      <div className=\"space-y-6\" data-testid=\"audit-log-page\">
        {/* Header */}
        <div>
          <h1 className=\"text-2xl font-bold text-white\">Лог на действията</h1>
          <p className=\"text-zinc-400 mt-1\">История на всички действия в системата</p>
        </div>

        {/* Filters */}
        <div className=\"flex flex-col sm:flex-row gap-4\">
          <div className=\"relative flex-1 max-w-md\">
            <Search className=\"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500\" />
            <Input
              placeholder=\"Търсене...\"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className=\"pl-10 bg-[#18181b] border-zinc-700 text-white placeholder:text-zinc-500\"
              data-testid=\"search-logs-input\"
            />
          </div>
          
          <Select value={filterAction} onValueChange={setFilterAction}>
            <SelectTrigger className=\"w-48 bg-[#18181b] border-zinc-700 text-white\" data-testid=\"filter-action-select\">
              <SelectValue placeholder=\"Филтър по действие\" />
            </SelectTrigger>
            <SelectContent className=\"bg-[#18181b] border-zinc-700\">
              <SelectItem value=\"all\">Всички действия</SelectItem>
              {uniqueActions.map(action => (
                <SelectItem key={action} value={action}>
                  {getActionLabel(action)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Logs List */}
        <Card className=\"bg-[#18181b] border-zinc-800\">
          <CardContent className=\"p-0\">
            {loading ? (
              <div className=\"space-y-2 p-4\">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className=\"h-16 bg-zinc-800/50 rounded animate-pulse\" />
                ))}
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className=\"py-16 text-center\">
                <Clock className=\"w-16 h-16 mx-auto mb-4 text-zinc-700\" />
                <h3 className=\"text-lg font-medium text-white mb-2\">Няма записи</h3>
                <p className=\"text-zinc-500\">
                  {search || filterAction !== 'all' 
                    ? 'Опитайте с други филтри'
                    : 'Все още няма записани действия'
                  }
                </p>
              </div>
            ) : (
              <div className=\"divide-y divide-zinc-800\">
                {filteredLogs.map((log, index) => {
                  const Icon = actionIcons[log.action] || Clock;
                  const colorClass = actionColors[log.action] || 'text-zinc-400 bg-zinc-600/20';
                  
                  return (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className=\"flex items-start gap-4 p-4 hover:bg-zinc-800/30 transition-colors\"
                      data-testid={`audit-log-${log.id}`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                        <Icon className=\"w-5 h-5\" />
                      </div>
                      
                      <div className=\"flex-1 min-w-0\">
                        <p className=\"text-sm text-zinc-300\">
                          <span className=\"font-medium text-white\">{log.user_name}</span>
                          {' '}
                          <span className=\"text-zinc-400\">{getActionLabel(log.action)}</span>
                        </p>
                        <p className=\"text-sm text-zinc-500 truncate\">{log.resource_name}</p>
                        {log.details && (
                          <p className=\"text-xs text-zinc-600 mt-1 italic\">\"{log.details}\"</p>
                        )}
                      </div>
                      
                      <div className=\"text-xs text-zinc-600 flex-shrink-0\">
                        {formatDate(log.created_at)}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
"
Observation: Create successful: /app/frontend/src/pages/AuditLog.js