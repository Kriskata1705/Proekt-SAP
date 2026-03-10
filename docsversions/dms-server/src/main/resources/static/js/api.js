// ========================================
// DMS API Module
// ========================================

const API_BASE = 'http://localhost:8080';

// Get auth token from localStorage
function getAuthToken() {
    return localStorage.getItem('dms_auth');
}

// Get current username
function getCurrentUser() {
    return localStorage.getItem('dms_user') || 'user';
}

// Save auth data
function saveAuth(username, password) {
    const token = btoa(username + ':' + password);
    localStorage.setItem('dms_auth', token);
    localStorage.setItem('dms_user', username);
}

// Clear auth data
function clearAuth() {
    localStorage.removeItem('dms_auth');
    localStorage.removeItem('dms_user');
}

// Check if authenticated
function isAuthenticated() {
    return !!getAuthToken();
}

// Make API request
async function api(endpoint, method = 'GET', body = null) {
    const token = getAuthToken();
    
    const options = {
        method: method,
        headers: {
            'Authorization': 'Basic ' + token,
            'Content-Type': 'application/json'
        }
    };
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    const response = await fetch(API_BASE + endpoint, options);
    
    if (response.status === 401) {
        clearAuth();
        window.location.reload();
        throw new Error('Неоторизиран достъп');
    }
    
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Грешка при заявката' }));
        throw new Error(error.message || 'Грешка при заявката');
    }
    
    // Handle empty responses
    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

// Login
async function login(username, password) {
    const token = btoa(username + ':' + password);
    
    const response = await fetch(API_BASE + '/documents', {
        headers: {
            'Authorization': 'Basic ' + token
        }
    });
    
    if (response.status === 401) {
        throw new Error('Невалидни потребителски данни');
    }
    
    if (!response.ok) {
        throw new Error('Грешка при свързване със сървъра');
    }
    
    saveAuth(username, password);
    return true;
}

// Documents API
async function getDocuments() {
    return await api('/documents');
}

async function createDocument(title) {
    return await api('/documents', 'POST', { title: title });
}

// Versions API
async function getVersions(documentId) {
    return await api('/documents/' + documentId + '/versions');
}

async function createVersion(documentId, content) {
    return await api('/documents/' + documentId + '/versions', 'POST', { content: content });
}

async function submitForReview(versionId) {
    return await api('/documents/versions/' + versionId + '/submit', 'POST');
}

async function approveVersion(versionId) {
    return await api('/documents/versions/' + versionId + '/approve', 'POST');
}

async function rejectVersion(versionId) {
    return await api('/documents/versions/' + versionId + '/reject', 'POST');
}

async function activateVersion(documentId, versionId) {
    return await api('/documents/' + documentId + '/versions/' + versionId + '/activate', 'POST');
}

async function getActiveVersion(documentId) {
    return await api('/documents/' + documentId + '/active');
}
