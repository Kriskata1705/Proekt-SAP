Now let me create the main App.js with routing:
Action: file_editor create /app/frontend/src/App.js --file-text "import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import DocumentDetail from './pages/DocumentDetail';
import DocumentCreate from './pages/DocumentCreate';
import VersionCreate from './pages/VersionCreate';
import VersionEdit from './pages/VersionEdit';
import AuditLog from './pages/AuditLog';
import Users from './pages/Users';
import Settings from './pages/Settings';

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className=\"min-h-screen bg-[#09090b] flex items-center justify-center\">
        <div className=\"animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500\" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to=\"/login\" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to=\"/dashboard\" replace />;
  }
  
  return children;
}

// Public Route Component (redirects to dashboard if logged in)
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className=\"min-h-screen bg-[#09090b] flex items-center justify-center\">
        <div className=\"animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500\" />
      </div>
    );
  }
  
  if (user) {
    return <Navigate to=\"/dashboard\" replace />;
  }
  
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path=\"/login\" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path=\"/register\" element={<PublicRoute><Register /></PublicRoute>} />
      
      {/* Protected Routes */}
      <Route path=\"/dashboard\" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path=\"/documents\" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
      <Route path=\"/documents/new\" element={<ProtectedRoute allowedRoles={['admin', 'author']}><DocumentCreate /></ProtectedRoute>} />
      <Route path=\"/documents/:id\" element={<ProtectedRoute><DocumentDetail /></ProtectedRoute>} />
      <Route path=\"/documents/:id/edit\" element={<ProtectedRoute allowedRoles={['admin', 'author']}><DocumentCreate /></ProtectedRoute>} />
      <Route path=\"/documents/:id/versions/new\" element={<ProtectedRoute allowedRoles={['admin', 'author']}><VersionCreate /></ProtectedRoute>} />
      <Route path=\"/documents/:id/versions/:versionId/edit\" element={<ProtectedRoute allowedRoles={['admin', 'author']}><VersionEdit /></ProtectedRoute>} />
      <Route path=\"/audit-log\" element={<ProtectedRoute allowedRoles={['admin', 'author', 'reviewer']}><AuditLog /></ProtectedRoute>} />
      <Route path=\"/users\" element={<ProtectedRoute allowedRoles={['admin']}><Users /></ProtectedRoute>} />
      <Route path=\"/settings\" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      
      {/* Default redirect */}
      <Route path=\"/\" element={<Navigate to=\"/dashboard\" replace />} />
      <Route path=\"*\" element={<Navigate to=\"/dashboard\" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
          <Toaster 
            position=\"top-right\" 
            toastOptions={{
              style: {
                background: '#18181b',
                border: '1px solid #27272a',
                color: '#fafafa',
              },
            }}
          />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
"
Observation: Overwrite successful: /app/frontend/src/App.js