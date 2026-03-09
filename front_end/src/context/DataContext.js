
Action: file_editor create /app/frontend/src/context/DataContext.js --file-text "import { createContext, useContext, useState, useCallback } from 'react';
import { mockDocuments, mockVersions, mockAuditLogs, mockComments, mockUsers, delay } from '../lib/mockData';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [documents, setDocuments] = useState(mockDocuments);
  const [versions, setVersions] = useState(mockVersions);
  const [auditLogs, setAuditLogs] = useState(mockAuditLogs);
  const [comments, setComments] = useState(mockComments);
  const [users, setUsers] = useState(mockUsers);

  // ==================== DOCUMENTS ====================
  const getDocuments = useCallback(async () => {
    await delay();
    return documents;
  }, [documents]);

  const getDocument = useCallback(async (id) => {
    await delay();
    return documents.find(d => d.id === id);
  }, [documents]);

  const createDocument = useCallback(async (data, user) => {
    await delay();
    const newDoc = {
      id: `doc-${Date.now()}`,
      title: data.title,
      description: data.description || '',
      owner_id: user.id,
      owner_name: user.name,
      active_version_id: null,
      active_version_number: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      total_versions: 0,
    };
    setDocuments(prev => [...prev, newDoc]);
    setVersions(prev => ({ ...prev, [newDoc.id]: [] }));
    
    // Add audit log
    const log = {
      id: `log-${Date.now()}`,
      user_id: user.id,
      user_name: user.name,
      action: 'create_document',
      resource_type: 'document',
      resource_id: newDoc.id,
      resource_name: newDoc.title,
      details: null,
      created_at: new Date().toISOString(),
    };
    setAuditLogs(prev => [log, ...prev]);
    
    return newDoc;
  }, []);

  const updateDocument = useCallback(async (id, data, user) => {
    await delay();
    setDocuments(prev => prev.map(d => 
      d.id === id ? { ...d, ...data, updated_at: new Date().toISOString() } : d
    ));
    
    const doc = documents.find(d => d.id === id);
    const log = {
      id: `log-${Date.now()}`,
      user_id: user.id,
      user_name: user.name,
      action: 'update_document',
      resource_type: 'document',
      resource_id: id,
      resource_name: doc?.title || data.title,
      details: null,
      created_at: new Date().toISOString(),
    };
    setAuditLogs(prev => [log, ...prev]);
    
    return documents.find(d => d.id === id);
  }, [documents]);

  const deleteDocument = useCallback(async (id, user) => {
    await delay();
    const doc = documents.find(d => d.id === id);
    setDocuments(prev => prev.filter(d => d.id !== id));
    setVersions(prev => {
      const newVersions = { ...prev };
      delete newVersions[id];
      return newVersions;
    });
    
    const log = {
      id: `log-${Date.now()}`,
      user_id: user.id,
      user_name: user.name,
      action: 'delete_document',
      resource_type: 'document',
      resource_id: id,
      resource_name: doc?.title || id,
      details: null,
      created_at: new Date().toISOString(),
    };
    setAuditLogs(prev => [log, ...prev]);
  }, [documents]);

  // ==================== VERSIONS ====================
  const getVersions = useCallback(async (docId) => {
    await delay();
    return versions[docId] || [];
  }, [versions]);

  const getVersion = useCallback(async (docId, versionId) => {
    await delay();
    const docVersions = versions[docId] || [];
    return docVersions.find(v => v.id === versionId);
  }, [versions]);

  const createVersion = useCallback(async (docId, data, user) => {
    await delay();
    const docVersions = versions[docId] || [];
    const nextNumber = docVersions.length > 0 
      ? Math.max(...docVersions.map(v => v.version_number)) + 1 
      : 1;
    
    const newVersion = {
      id: `v-${docId}-${nextNumber}`,
      document_id: docId,
      version_number: nextNumber,
      content: data.content,
      change_summary: data.change_summary || '',
      status: 'draft',
      author_id: user.id,
      author_name: user.name,
      created_at: new Date().toISOString(),
      reviewed_by: null,
      reviewed_at: null,
      review_comment: null,
    };
    
    setVersions(prev => ({
      ...prev,
      [docId]: [newVersion, ...(prev[docId] || [])],
    }));
    
    setDocuments(prev => prev.map(d => 
      d.id === docId ? { ...d, total_versions: (d.total_versions || 0) + 1, updated_at: new Date().toISOString() } : d
    ));
    
    const doc = documents.find(d => d.id === docId);
    const log = {
      id: `log-${Date.now()}`,
      user_id: user.id,
      user_name: user.name,
      action: 'create_version',
      resource_type: 'version',
      resource_id: newVersion.id,
      resource_name: `v${nextNumber} of ${doc?.title}`,
      details: null,
      created_at: new Date().toISOString(),
    };
    setAuditLogs(prev => [log, ...prev]);
    
    return newVersion;
  }, [versions, documents]);

  const updateVersion = useCallback(async (docId, versionId, data, user) => {
    await delay();
    setVersions(prev => ({
      ...prev,
      [docId]: (prev[docId] || []).map(v => 
        v.id === versionId ? { ...v, ...data } : v
      ),
    }));
    
    const version = versions[docId]?.find(v => v.id === versionId);
    const doc = documents.find(d => d.id === docId);
    const log = {
      id: `log-${Date.now()}`,
      user_id: user.id,
      user_name: user.name,
      action: 'update_version',
      resource_type: 'version',
      resource_id: versionId,
      resource_name: `v${version?.version_number} of ${doc?.title}`,
      details: null,
      created_at: new Date().toISOString(),
    };
    setAuditLogs(prev => [log, ...prev]);
  }, [versions, documents]);

  const submitForReview = useCallback(async (docId, versionId, user) => {
    await delay();
    setVersions(prev => ({
      ...prev,
      [docId]: (prev[docId] || []).map(v => 
        v.id === versionId ? { ...v, status: 'pending' } : v
      ),
    }));
    
    const version = versions[docId]?.find(v => v.id === versionId);
    const doc = documents.find(d => d.id === docId);
    const log = {
      id: `log-${Date.now()}`,
      user_id: user.id,
      user_name: user.name,
      action: 'submit_for_review',
      resource_type: 'version',
      resource_id: versionId,
      resource_name: `v${version?.version_number} of ${doc?.title}`,
      details: null,
      created_at: new Date().toISOString(),
    };
    setAuditLogs(prev => [log, ...prev]);
  }, [versions, documents]);

  const reviewVersion = useCallback(async (docId, versionId, action, comment, user) => {
    await delay();
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    
    setVersions(prev => ({
      ...prev,
      [docId]: (prev[docId] || []).map(v => 
        v.id === versionId ? { 
          ...v, 
          status: newStatus,
          reviewed_by: user.name,
          reviewed_at: new Date().toISOString(),
          review_comment: comment,
        } : v
      ),
    }));
    
    // If approved, set as active version
    if (newStatus === 'approved') {
      const version = versions[docId]?.find(v => v.id === versionId);
      setDocuments(prev => prev.map(d => 
        d.id === docId ? { 
          ...d, 
          active_version_id: versionId,
          active_version_number: version?.version_number,
          updated_at: new Date().toISOString(),
        } : d
      ));
    }
    
    const version = versions[docId]?.find(v => v.id === versionId);
    const doc = documents.find(d => d.id === docId);
    const log = {
      id: `log-${Date.now()}`,
      user_id: user.id,
      user_name: user.name,
      action: action,
      resource_type: 'version',
      resource_id: versionId,
      resource_name: `v${version?.version_number} of ${doc?.title}`,
      details: comment,
      created_at: new Date().toISOString(),
    };
    setAuditLogs(prev => [log, ...prev]);
  }, [versions, documents]);

  // ==================== COMMENTS ====================
  const getComments = useCallback(async (versionId) => {
    await delay();
    return comments[versionId] || [];
  }, [comments]);

  const addComment = useCallback(async (versionId, content, user) => {
    await delay();
    const newComment = {
      id: `c-${Date.now()}`,
      version_id: versionId,
      author_id: user.id,
      author_name: user.name,
      content,
      created_at: new Date().toISOString(),
    };
    
    setComments(prev => ({
      ...prev,
      [versionId]: [...(prev[versionId] || []), newComment],
    }));
    
    return newComment;
  }, []);

  // ==================== AUDIT LOGS ====================
  const getAuditLogs = useCallback(async (limit = 100) => {
    await delay();
    return auditLogs.slice(0, limit);
  }, [auditLogs]);

  // ==================== USERS ====================
  const getUsers = useCallback(async () => {
    await delay();
    return users;
  }, [users]);

  const updateUser = useCallback(async (id, data) => {
    await delay();
    setUsers(prev => prev.map(u => 
      u.id === id ? { ...u, ...data } : u
    ));
  }, []);

  const deleteUser = useCallback(async (id) => {
    await delay();
    setUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  // ==================== STATS ====================
  const getStats = useCallback(async () => {
    await delay();
    const allVersions = Object.values(versions).flat();
    return {
      total_documents: documents.length,
      total_versions: allVersions.length,
      pending_reviews: allVersions.filter(v => v.status === 'pending').length,
      total_users: users.length,
      recent_activity: auditLogs.slice(0, 5),
    };
  }, [documents, versions, users, auditLogs]);

  return (
    <DataContext.Provider value={{
      // Documents
      getDocuments,
      getDocument,
      createDocument,
      updateDocument,
      deleteDocument,
      // Versions
      getVersions,
      getVersion,
      createVersion,
      updateVersion,
      submitForReview,
      reviewVersion,
      // Comments
      getComments,
      addComment,
      // Audit Logs
      getAuditLogs,
      // Users
      getUsers,
      updateUser,
      deleteUser,
      // Stats
      getStats,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
"
Observation: Create successful: /app/frontend/src/context/DataContext.js