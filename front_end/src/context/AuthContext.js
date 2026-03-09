
Action: file_editor create /app/frontend/src/context/AuthContext.js --file-text "import { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers, delay } from '../lib/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    await delay(500);
    
    // Mock login - find user by email
    const foundUser = mockUsers.find(u => u.email === email);
    if (!foundUser) {
      throw new Error('Невалиден email или парола');
    }
    
    // In real app, this would come from your Spring Boot backend
    const token = 'mock-jwt-token-' + foundUser.id;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(foundUser));
    setUser(foundUser);
    
    return { user: foundUser, token };
  };

  const register = async (data) => {
    await delay(500);
    
    // Check if email exists
    if (mockUsers.find(u => u.email === data.email)) {
      throw new Error('Email вече съществува');
    }
    
    // Create new user (mock)
    const newUser = {
      id: String(mockUsers.length + 1),
      email: data.email,
      name: data.name,
      role: data.role || 'reader',
      created_at: new Date().toISOString(),
    };
    
    const token = 'mock-jwt-token-' + newUser.id;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    
    return { user: newUser, token };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
"
Observation: Create successful: /app/frontend/src/context/AuthContext.js