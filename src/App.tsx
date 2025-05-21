import React, { useState, useEffect } from 'react';
import './App.css';
import { useTranslation } from 'react-i18next';
import MasterKeyAuth from './components/MasterKeyAuth';
import PasswordList from './components/PasswordList';
import AddPasswordForm from './components/AddPasswordForm';
import ImportExport from './components/ImportExport';
import LanguageSwitcher from './components/LanguageSwitcher';
import { PasswordEntry } from './models/passwordEntry';
import { 
  getPasswords, 
  addPassword, 
  updatePassword, 
  deletePassword 
} from './services/passwordService';

function App() {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [masterKey, setMasterKey] = useState('');
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  const [editingPassword, setEditingPassword] = useState<PasswordEntry | undefined>(undefined);

  // Load passwords when the user authenticates
  useEffect(() => {
    if (isAuthenticated && masterKey) {
      loadPasswords();
    }
  }, [isAuthenticated, masterKey]);

  const handleAuthentication = (key: string) => {
    setMasterKey(key);
    setIsAuthenticated(true);
  };

  const loadPasswords = () => {
    const loadedPasswords = getPasswords(masterKey);
    setPasswords(loadedPasswords);
  };

  const handleAddPassword = (passwordData: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingPassword) {
      // We're updating an existing password
      const updatedEntry: PasswordEntry = {
        ...editingPassword,
        ...passwordData,
        updatedAt: new Date()
      };
      const success = updatePassword(updatedEntry, masterKey);
      if (success) {
        setEditingPassword(undefined);
        loadPasswords();
      }
    } else {
      // We're adding a new password
      addPassword(passwordData, masterKey);
      loadPasswords();
    }
    setShowAddForm(false);
  };

  const handleDeletePassword = (id: string) => {
    const success = deletePassword(id, masterKey);
    if (success) {
      loadPasswords();
    }
  };

  const handleEditPassword = (entry: PasswordEntry) => {
    setEditingPassword(entry);
    setShowAddForm(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setMasterKey('');
    setPasswords([]);
    setShowAddForm(false);
    setShowImportExport(false);
    setEditingPassword(undefined);
  };

  if (!isAuthenticated) {
    return <MasterKeyAuth onAuthenticated={handleAuthentication} />;
  }

  return (
    <div className="bitvault-app">
      <header className="app-header">
        <div className="app-title">
          <h1>{t('common.app.title')}</h1>
          <LanguageSwitcher />
        </div>
        <div className="header-actions">
          {showAddForm || showImportExport ? (
            <button 
              onClick={() => {
                setShowAddForm(false);
                setShowImportExport(false);
                setEditingPassword(undefined);
              }} 
              className="back-button"
            >
              {t('common.actions.back')}
            </button>
          ) : (
            <>
              <button 
                onClick={() => setShowAddForm(true)} 
                className="add-button"
              >
                {t('passwords.add')}
              </button>
              <button 
                onClick={() => setShowImportExport(true)} 
                className="import-export-button"
              >
                {t('importExport.title')}
              </button>
              <button 
                onClick={handleLogout} 
                className="logout-button"
              >
                {t('common.actions.logout')}
              </button>
            </>
          )}
        </div>
      </header>

      <main className="app-content">
        {showAddForm ? (
          <AddPasswordForm 
            onSubmit={handleAddPassword} 
            initialData={editingPassword}
            onCancel={() => {
              setShowAddForm(false);
              setEditingPassword(undefined);
            }}
          />
        ) : showImportExport ? (
          <ImportExport 
            masterKey={masterKey} 
            onImportComplete={loadPasswords}
          />
        ) : (
          <PasswordList 
            entries={passwords}
            onDelete={handleDeletePassword}
            onEdit={handleEditPassword}
            masterKey={masterKey}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>{t('common.app.title')} - {t('common.app.subtitle')} &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
