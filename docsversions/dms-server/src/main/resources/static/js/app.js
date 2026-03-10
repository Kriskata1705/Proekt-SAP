// ========================================
// DMS Application
// ========================================

// Current state
let currentDocumentId = null;
let currentDocumentTitle = '';

// DOM Elements
const loginPage = document.getElementById('login-page');
const appPage = document.getElementById('app-page');
const documentsView = document.getElementById('documents-view');
const versionsView = document.getElementById('versions-view');
const documentsGrid = document.getElementById('documents-grid');
const versionsList = document.getElementById('versions-list');
const docTitle = document.getElementById('doc-title');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    if (isAuthenticated()) {
        showApp();
        loadDocuments();
    } else {
        showLogin();
    }
    
    initEventListeners();
});

// Event Listeners
function initEventListeners() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Logout
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    // Navigation
    document.getElementById('back-to-docs').addEventListener('click', showDocumentsView);
    
    // Create document
    document.getElementById('create-doc-btn').addEventListener('click', () => {
        openModal('create-doc-modal');
    });
    
    document.getElementById('create-doc-form').addEventListener('submit', handleCreateDocument);
    
    // Create version
    document.getElementById('create-version-btn').addEventListener('click', () => {
        openModal('create-version-modal');
    });
    
    document.getElementById('create-version-form').addEventListener('submit', handleCreateVersion);
    
    // Modal close buttons
    document.querySelectorAll('.modal-close, .modal-cancel, .modal-overlay').forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay') || 
                e.target.classList.contains('modal-close') || 
                e.target.classList.contains('modal-cancel')) {
                closeAllModals();
            }
        });
    });
}

// Page transitions
function showLogin() {
    loginPage.classList.add('active');
    appPage.classList.remove('active');
}

function showApp() {
    loginPage.classList.remove('active');
    appPage.classList.add('active');
    
    // Update user info
    document.getElementById('current-user').textContent = getCurrentUser();
    // Role will be determined by what actions are available
    document.getElementById('user-role').textContent = 'User';
}

function showDocumentsView() {
    documentsView.classList.add('active');
    versionsView.classList.remove('active');
    currentDocumentId = null;
}

function showVersionsView(docId, title) {
    currentDocumentId = docId;
    currentDocumentTitle = title;
    docTitle.textContent = title;
    
    documentsView.classList.remove('active');
    versionsView.classList.add('active');
    
    loadVersions(docId);
}

// Handlers
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const button = e.target.querySelector('button[type="submit"]');
    
    button.disabled = true;
    button.innerHTML = '<span class="spinner" style="width:20px;height:20px;border-width:2px;"></span>';
    
    try {
        await login(username, password);
        showToast('Успешен вход!', 'success');
        showApp();
        loadDocuments();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        button.disabled = false;
        button.innerHTML = '<span>Вход</span><i class="fas fa-arrow-right"></i>';
    }
}

function handleLogout() {
    clearAuth();
    showToast('Излязохте от системата', 'info');
    showLogin();
    
    // Clear form
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

async function handleCreateDocument(e) {
    e.preventDefault();
    
    const titleInput = document.getElementById('doc-title-input');
    const title = titleInput.value.trim();
    
    if (!title) return;
    
    try {
        await createDocument(title);
        showToast('Документът е създаден успешно!', 'success');
        closeAllModals();
        titleInput.value = '';
        loadDocuments();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function handleCreateVersion(e) {
    e.preventDefault();
    
    const contentInput = document.getElementById('version-content-input');
    const content = contentInput.value.trim();
    
    if (!content || !currentDocumentId) return;
    
    try {
        await createVersion(currentDocumentId, content);
        showToast('Версията е създадена успешно!', 'success');
        closeAllModals();
        contentInput.value = '';
        loadVersions(currentDocumentId);
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Load data
async function loadDocuments() {
    documentsGrid.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
    
    try {
        const documents = await getDocuments();
        renderDocuments(documents);
    } catch (error) {
        showToast(error.message, 'error');
        documentsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Грешка при зареждане</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

async function loadVersions(documentId) {
    versionsList.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
    
    try {
        const versions = await getVersions(documentId);
        renderVersions(versions);
    } catch (error) {
        showToast(error.message, 'error');
        versionsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Грешка при зареждане</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// Render functions
function renderDocuments(documents) {
    if (!documents || documents.length === 0) {
        documentsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <h3>Няма документи</h3>
                <p>Създайте първия си документ</p>
            </div>
        `;
        return;
    }
    
    documentsGrid.innerHTML = documents.map((doc, index) => `
        <div class="document-card" 
             data-id="${doc.id}" 
             data-title="${escapeHtml(doc.title)}"
             data-testid="document-card-${index}"
             style="animation-delay: ${index * 0.1}s">
            <div class="card-icon">
                <i class="fas fa-file-alt"></i>
            </div>
            <h3>${escapeHtml(doc.title)}</h3>
            <div class="card-meta">
                <span><i class="fas fa-calendar"></i> ${formatDate(doc.createdAt)}</span>
            </div>
        </div>
    `).join('');
    
    // Add click listeners
    document.querySelectorAll('.document-card').forEach(card => {
        card.addEventListener('click', () => {
            showVersionsView(card.dataset.id, card.dataset.title);
        });
    });
}

function renderVersions(versions) {
    if (!versions || versions.length === 0) {
        versionsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-code-branch"></i>
                <h3>Няма версии</h3>
                <p>Създайте първата версия на документа</p>
            </div>
        `;
        return;
    }
    
    // Sort by version number descending
    versions.sort((a, b) => b.versionNumber - a.versionNumber);
    
    versionsList.innerHTML = versions.map((version, index) => `
        <div class="version-card" 
             data-id="${version.id}"
             data-testid="version-card-${index}"
             style="animation-delay: ${index * 0.1}s">
            <div class="version-header">
                <div class="version-info">
                    <span class="version-number">v${version.versionNumber}</span>
                    <span class="status-badge ${version.status.toLowerCase()}">${getStatusText(version.status)}</span>
                </div>
            </div>
            <div class="version-content">${escapeHtml(version.content)}</div>
            <div class="version-actions">
                ${getVersionActions(version)}
            </div>
        </div>
    `).join('');
    
    // Add action listeners
    addVersionActionListeners();
}

function getStatusText(status) {
    const statusMap = {
        'DRAFT': 'Чернова',
        'IN_REVIEW': 'В преглед',
        'APPROVED': 'Одобрена',
        'REJECTED': 'Отхвърлена',
        'ACTIVE': 'Активна'
    };
    return statusMap[status] || status;
}

function getVersionActions(version) {
    let actions = '';
    
    if (version.status === 'DRAFT') {
        actions += `
            <button class="btn-action btn-submit" data-action="submit" data-id="${version.id}" data-testid="submit-version-${version.id}">
                <i class="fas fa-paper-plane"></i> Изпрати за преглед
            </button>
        `;
    }
    
    if (version.status === 'IN_REVIEW') {
        actions += `
            <button class="btn-action btn-approve" data-action="approve" data-id="${version.id}" data-testid="approve-version-${version.id}">
                <i class="fas fa-check"></i> Одобри
            </button>
            <button class="btn-action btn-reject" data-action="reject" data-id="${version.id}" data-testid="reject-version-${version.id}">
                <i class="fas fa-times"></i> Отхвърли
            </button>
        `;
    }
    
    if (version.status === 'APPROVED') {
        actions += `
            <button class="btn-action btn-activate" data-action="activate" data-id="${version.id}" data-testid="activate-version-${version.id}">
                <i class="fas fa-bolt"></i> Активирай
            </button>
        `;
    }
    
    return actions;
}

function addVersionActionListeners() {
    document.querySelectorAll('.version-actions button').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const action = btn.dataset.action;
            const versionId = btn.dataset.id;
            
            btn.disabled = true;
            const originalHtml = btn.innerHTML;
            btn.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-width:2px;"></span>';
            
            try {
                switch (action) {
                    case 'submit':
                        await submitForReview(versionId);
                        showToast('Версията е изпратена за преглед', 'success');
                        break;
                    case 'approve':
                        await approveVersion(versionId);
                        showToast('Версията е одобрена', 'success');
                        break;
                    case 'reject':
                        await rejectVersion(versionId);
                        showToast('Версията е отхвърлена', 'warning');
                        break;
                    case 'activate':
                        await activateVersion(currentDocumentId, versionId);
                        showToast('Версията е активирана', 'success');
                        break;
                }
                loadVersions(currentDocumentId);
            } catch (error) {
                showToast(error.message, 'error');
                btn.disabled = false;
                btn.innerHTML = originalHtml;
            }
        });
    });
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// Toast notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${escapeHtml(message)}</span>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
    
    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });
}

// Utility functions
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('bg-BG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
