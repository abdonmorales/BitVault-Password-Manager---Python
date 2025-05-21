import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PasswordEntry } from '../models/passwordEntry';

interface PasswordItemProps {
  entry: PasswordEntry;
  onDelete: (id: string) => void;
  onEdit: (entry: PasswordEntry) => void;
  masterKey: string;
}

const PasswordItem: React.FC<PasswordItemProps> = ({ entry, onDelete, onEdit, masterKey }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { t } = useTranslation();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleDeleteClick = () => {
    if (confirmDelete) {
      onDelete(entry.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000); // Reset after 3 seconds
    }
  };

  const handleEditClick = () => {
    onEdit(entry);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  // Render password based on show/hide state
  const displayPassword = showPassword ? entry.password : '••••••••••••';

  return (
    <div className="password-item">
      <div className="password-header">
        <h3>{entry.title}</h3>
        <div className="password-actions">
          <button onClick={handleEditClick} className="edit-btn">
            {t('common.actions.edit')}
          </button>
          <button 
            onClick={handleDeleteClick} 
            className={`delete-btn ${confirmDelete ? 'confirm' : ''}`}
          >
            {confirmDelete ? t('common.actions.confirm') : t('common.actions.delete')}
          </button>
        </div>
      </div>
      <div className="password-details">
        <div className="detail-row">
          <span className="detail-label">{t('passwords.username')}:</span>
          <span className="detail-value">{entry.username}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">{t('passwords.password')}:</span>
          <div className="password-field">
            <span className="detail-value">{displayPassword}</span>
            <button 
              onClick={handleTogglePassword} 
              className="toggle-password"
            >
              {showPassword ? t('common.actions.hide') : t('common.actions.show')}
            </button>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(entry.password);
                alert(t('common.messages.copied'));
              }} 
              className="copy-btn"
            >
              {t('common.actions.copy')}
            </button>
          </div>
        </div>
        {entry.url && (
          <div className="detail-row">
            <span className="detail-label">{t('passwords.url')}:</span>
            <a 
              href={entry.url.startsWith('http') ? entry.url : `https://${entry.url}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="detail-value"
            >
              {entry.url}
            </a>
          </div>
        )}
        {entry.category && (
          <div className="detail-row">
            <span className="detail-label">{t('passwords.category')}:</span>
            <span className="detail-value category">{entry.category}</span>
          </div>
        )}
        {entry.notes && (
          <div className="detail-row">
            <span className="detail-label">{t('passwords.notes')}:</span>
            <span className="detail-value notes">{entry.notes}</span>
          </div>
        )}
        <div className="detail-row dates">
          <span className="date">{t('passwords.created')}: {formatDate(entry.createdAt)}</span>
          <span className="date">{t('passwords.updated')}: {formatDate(entry.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default PasswordItem;
