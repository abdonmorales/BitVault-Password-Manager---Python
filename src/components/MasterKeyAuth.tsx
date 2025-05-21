import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { setupMasterKey, verifyMasterKey, masterKeyExists } from '../services/passwordService';

interface MasterKeyAuthProps {
  onAuthenticated: (masterKey: string) => void;
}

const MasterKeyAuth: React.FC<MasterKeyAuthProps> = ({ onAuthenticated }) => {
  const { t } = useTranslation();
  const [masterKey, setMasterKey] = useState('');
  const [confirmMasterKey, setConfirmMasterKey] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const isSetupMode = !masterKeyExists();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isSetupMode) {
      // Setup mode: creating a new master key
      if (masterKey.length < 8) {
        setError(t('auth.errors.min_length'));
        return;
      }
      
      if (masterKey !== confirmMasterKey) {
        setError(t('auth.errors.not_matching'));
        return;
      }
      
      setupMasterKey(masterKey);
      onAuthenticated(masterKey);
    } else {
      // Verification mode: checking existing master key
      if (verifyMasterKey(masterKey)) {
        onAuthenticated(masterKey);
      } else {
        setError(t('auth.errors.incorrect'));
      }
    }
  };
  
  return (
    <div className="master-key-container">
      <div className="master-key-form">
        <h2>{isSetupMode ? t('auth.setupTitle') : t('auth.loginTitle')}</h2>
        
        <p className="info-text">
          {isSetupMode 
            ? t('auth.setupInfo')
            : t('auth.loginInfo')
          }
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="masterKey">{t('auth.masterKey')}</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="masterKey"
                value={masterKey}
                onChange={(e) => setMasterKey(e.target.value)}
                autoFocus
                placeholder={t('auth.placeholder.enter')}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password-btn"
              >
                {showPassword ? t('common.actions.hide') : t('common.actions.show')}
              </button>
            </div>
          </div>
          
          {isSetupMode && (
            <div className="form-group">
              <label htmlFor="confirmMasterKey">{t('auth.confirmMasterKey')}</label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmMasterKey"
                value={confirmMasterKey}
                onChange={(e) => setConfirmMasterKey(e.target.value)}
                placeholder={t('auth.placeholder.confirm')}
                required
              />
            </div>
          )}
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="primary-button">
            {isSetupMode ? t('auth.createButton') : t('auth.loginButton')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MasterKeyAuth;
