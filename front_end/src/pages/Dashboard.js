
Action: file_editor create /app/frontend/src/pages/Dashboard.js --file-text "import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Clock, 
  Users, 
  GitBranch,
  Plus,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Shell } from '../components/layout/Shell';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { formatRelativeDate, getActionLabel } from '../lib/utils';
import { StatusBadge } from '../components/StatusBadge';

export default function Dashboard() {
  const { user } = useAuth();
  const { getStats, getDocuments } = useData();
  const [stats, setStats] = useState(null);
  const [recentDocs, setRecentDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, docs] = await Promise.all([
          getStats(),
          getDocuments()
        ]);
        setStats(statsData);
        setRecentDocs(docs.slice(0, 5));
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [getStats, getDocuments]);

  const canCreate = ['admin', 'author'].includes(user?.role);

  return (
    <Shell>
      <div className=\"space-y-8\" data-testid=\"dashboard-page\">
        {/* Header */}
        <div className=\"flex items-center justify-between\">
          <div>
            <h1 className=\"text-2xl sm:text-3xl font-bold text-white\">
              Добре дошли, {user?.name?.split(' ')[0]}!
            </h1>
            <p className=\"text-zinc-400 mt-1\">
              Преглед на документите и активността в системата
            </p>
          </div>
          {canCreate && (
            <Link to=\"/documents/new\">
              <Button className=\"bg-blue-600 hover:bg-blue-700\" data-testid=\"new-document-btn\">
                <Plus className=\"w-4 h-4 mr-2\" />
                Нов документ
              </Button>
            </Link>
          )}
        </div>

        {/* Stats Grid */}
        <div className=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4\">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className=\"bg-[#18181b] border-zinc-800 hover:border-zinc-700 transition-colors\">
              <CardContent className=\"p-6\">
                <div className=\"flex items-center justify-between\">
                  <div>
                    <p className=\"text-sm text-zinc-400\">Документи</p>
                    <p className=\"text-3xl font-bold text-white mt-1\">
                      {loading ? '...' : stats?.total_documents || 0}
                    </p>
                  </div>
                  <div className=\"w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center\">
                    <FileText className=\"w-6 h-6 text-blue-400\" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className=\"bg-[#18181b] border-zinc-800 hover:border-zinc-700 transition-colors\">
              <CardContent className=\"p-6\">
                <div className=\"flex items-center justify-between\">
                  <div>
                    <p className=\"text-sm text-zinc-400\">Версии</p>
                    <p className=\"text-3xl font-bold text-white mt-1\">
                      {loading ? '...' : stats?.total_versions || 0}
                    </p>
                  </div>
                  <div className=\"w-12 h-12 rounded-lg bg-emerald-600/20 flex items-center justify-center\">
                    <GitBranch className=\"w-6 h-6 text-emerald-400\" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className=\"bg-[#18181b] border-zinc-800 hover:border-zinc-700 transition-colors\">
              <CardContent className=\"p-6\">
                <div className=\"flex items-center justify-between\">
                  <div>
                    <p className=\"text-sm text-zinc-400\">Чакащи преглед</p>
                    <p className=\"text-3xl font-bold text-white mt-1\">
                      {loading ? '...' : stats?.pending_reviews || 0}
                    </p>
                  </div>
                  <div className=\"w-12 h-12 rounded-lg bg-amber-600/20 flex items-center justify-center\">
                    <Clock className=\"w-6 h-6 text-amber-400\" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className=\"bg-[#18181b] border-zinc-800 hover:border-zinc-700 transition-colors\">
              <CardContent className=\"p-6\">
                <div className=\"flex items-center justify-between\">
                  <div>
                    <p className=\"text-sm text-zinc-400\">Потребители</p>
                    <p className=\"text-3xl font-bold text-white mt-1\">
                      {loading ? '...' : stats?.total_users || 0}
                    </p>
                  </div>
                  <div className=\"w-12 h-12 rounded-lg bg-purple-600/20 flex items-center justify-center\">
                    <Users className=\"w-6 h-6 text-purple-400\" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Content Grid */}
        <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6\">
          {/* Recent Documents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className=\"bg-[#18181b] border-zinc-800\">
              <CardHeader className=\"flex flex-row items-center justify-between pb-2\">
                <CardTitle className=\"text-lg text-white\">Последни документи</CardTitle>
                <Link to=\"/documents\">
                  <Button variant=\"ghost\" size=\"sm\" className=\"text-zinc-400 hover:text-white\">
                    Виж всички
                    <ArrowRight className=\"w-4 h-4 ml-1\" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className=\"space-y-3\">
                    {[1, 2, 3].map(i => (
                      <div key={i} className=\"h-16 bg-zinc-800/50 rounded-md animate-pulse\" />
                    ))}
                  </div>
                ) : recentDocs.length === 0 ? (
                  <div className=\"text-center py-8 text-zinc-500\">
                    <FileText className=\"w-12 h-12 mx-auto mb-2 opacity-50\" />
                    <p>Няма документи</p>
                  </div>
                ) : (
                  <div className=\"space-y-2\">
                    {recentDocs.map(doc => (
                      <Link
                        key={doc.id}
                        to={`/documents/${doc.id}`}
                        className=\"block p-3 rounded-md hover:bg-zinc-800/50 transition-colors\"
                        data-testid={`recent-doc-${doc.id}`}
                      >
                        <div className=\"flex items-center justify-between\">
                          <div className=\"min-w-0 flex-1\">
                            <p className=\"text-white font-medium truncate\">{doc.title}</p>
                            <p className=\"text-sm text-zinc-500 truncate\">{doc.owner_name}</p>
                          </div>
                          {doc.active_version_number && (
                            <span className=\"text-xs text-zinc-500 font-mono ml-2\">
                              v{doc.active_version_number}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className=\"bg-[#18181b] border-zinc-800\">
              <CardHeader className=\"flex flex-row items-center justify-between pb-2\">
                <CardTitle className=\"text-lg text-white\">Последна активност</CardTitle>
                {['admin', 'author', 'reviewer'].includes(user?.role) && (
                  <Link to=\"/audit-log\">
                    <Button variant=\"ghost\" size=\"sm\" className=\"text-zinc-400 hover:text-white\">
                      Виж всички
                      <ArrowRight className=\"w-4 h-4 ml-1\" />
                    </Button>
                  </Link>
                )}
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className=\"space-y-3\">
                    {[1, 2, 3].map(i => (
                      <div key={i} className=\"h-12 bg-zinc-800/50 rounded-md animate-pulse\" />
                    ))}
                  </div>
                ) : !stats?.recent_activity?.length ? (
                  <div className=\"text-center py-8 text-zinc-500\">
                    <Clock className=\"w-12 h-12 mx-auto mb-2 opacity-50\" />
                    <p>Няма активност</p>
                  </div>
                ) : (
                  <div className=\"space-y-3\">
                    {stats.recent_activity.map(log => (
                      <div
                        key={log.id}
                        className=\"flex items-start gap-3 p-2\"
                        data-testid={`activity-${log.id}`}
                      >
                        <div className=\"w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0\">
                          {log.action === 'approve' && <CheckCircle className=\"w-4 h-4 text-emerald-400\" />}
                          {log.action === 'reject' && <XCircle className=\"w-4 h-4 text-rose-400\" />}
                          {!['approve', 'reject'].includes(log.action) && <AlertCircle className=\"w-4 h-4 text-zinc-400\" />}
                        </div>
                        <div className=\"min-w-0 flex-1\">
                          <p className=\"text-sm text-zinc-300\">
                            <span className=\"font-medium text-white\">{log.user_name}</span>
                            {' '}
                            <span className=\"text-zinc-400\">{getActionLabel(log.action)}</span>
                          </p>
                          <p className=\"text-xs text-zinc-500 truncate\">{log.resource_name}</p>
                          <p className=\"text-xs text-zinc-600\">{formatRelativeDate(log.created_at)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Shell>
  );
}
"
Observation: Create successful: /app/frontend/src/pages/Dashboard.js