import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PasswordEntry } from '../models/passwordEntry';
import { generatePassword, evaluatePasswordStrength } from '../utils/passwordUtils';

interface AddPasswordFormProps {
  onSubmit: (passwordData: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: PasswordEntry;
  onCancel: () => void;
}

const AddPasswordForm: React.FC<AddPasswordFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '' });
  const [isEditMode, setIsEditMode] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setUsername(initialData.username);
      setPassword(initialData.password);
      setUrl(initialData.url || '');
      setNotes(initialData.notes || '');
      setCategory(initialData.category || '');
      setIsEditMode(true);
    }
  }, [initialData]);

  useEffect(() => {
    if (password) {
      setPasswordStrength(evaluatePasswordStrength(password, t));
    } else {
      setPasswordStrength({ score: 0, feedback: '' });
    }
  }, [password, t]);

  const handleGeneratePassword = () => {
    const newPassword = generatePassword(16, true, true, true, true);
    setPassword(newPassword);
    setShowPassword(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      username,
      password,
      url: url || undefined,
      notes: notes || undefined,
      category: category || undefined
    });
    
    // Don't reset form if in edit mode
    if (!isEditMode) {
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle('');
    setUsername('');
    setPassword('');
    setUrl('');
    setNotes('');
    setCategory('');
    setShowPassword(false);
  };

  const getStrengthColor = () => {
    switch (passwordStrength.score) {
      case 1: return '#ff4d4d'; // Red - very weak
      case 2: return '#ffa64d'; // Orange - weak
      case 3: return '#ffff4d'; // Yellow - acceptable
      case 4: return '#4dff4d'; // Light green - strong
      case 5: return '#4dff88'; // Green - very strong
      default: return '#ccc'; // Gray - no password
    }
  };

  return (
    <div className="password-form-container">
      <h2>{isEditMode ? t('passwords.edit') : t('passwords.add')}</h2>
      <form onSubmit={handleSubmit} className="password-form">
        <div className="form-group">
          <label htmlFor="title">{t('passwords.title')} *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder={t('passwords.placeholders.title')}
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">{t('passwords.username')} *</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder={t('passwords.placeholders.username')}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">{t('passwords.password')} *</label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={t('passwords.placeholders.password')}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password-btn"
            >
              {showPassword ? t('common.actions.hide') : t('common.actions.show')}
            </button>
            <button 
              type="button" 
              onClick={handleGeneratePassword}
              className="generate-password-btn"
            >
              {t('passwords.generate')}
            </button>
          </div>
          {password && (
            <div className="password-strength">
              <div 
                className="strength-meter" 
                style={{ 
                  width: `${(passwordStrength.score / 5) * 100}%`,
                  backgroundColor: getStrengthColor()
                }} 
              />
              <span className="strength-text">{passwordStrength.feedback}</span>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="url">{t('passwords.url')}</label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t('passwords.placeholders.url')}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">{t('passwords.category')}</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder={t('passwords.placeholders.category')}
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">{t('passwords.notes')}</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('passwords.placeholders.notes')}
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-btn">
            {t('common.actions.cancel')}
          </button>
          <button type="submit" className="submit-btn">
            {isEditMode ? t('common.actions.update') : t('common.actions.save')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPasswordForm;