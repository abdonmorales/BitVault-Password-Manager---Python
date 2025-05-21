import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { exportPasswords, importPasswords } from '../services/passwordService';

interface ImportExportProps {
  masterKey: string;
  onImportComplete: () => void;
}

const ImportExport: React.FC<ImportExportProps> = ({ masterKey, onImportComplete }) => {
  const [importData, setImportData] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { t } = useTranslation();

  const handleExport = () => {
    try {
      const data = exportPasswords(masterKey);
      
      // Create a Blob object with the data
      const blob = new Blob([data], { type: 'application/json' });
      
      // Create a URL for the Blob object
      const url = URL.createObjectURL(blob);
      
      // Create a link element for download
      const a = document.createElement('a');
      a.href = url;
      a.download = `bitvault_backup_${new Date().toISOString().slice(0, 10)}.json`;
      
      // Simulate a click to start the download
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSuccess(t('common.messages.success_exporting'));
      setError('');
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(t('common.messages.error_exporting'));
      setSuccess('');
    }
  };

  const handleImport = () => {
    try {
      if (!importData.trim()) {
        setError(t('importExport.import.empty_data'));
        return;
      }
      
      const success = importPasswords(importData, masterKey);
      
      if (success) {
        setSuccess(t('common.messages.success_importing'));
        setError('');
        setImportData('');
        
        // Notify parent component that import is complete
        onImportComplete();
        
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(t('common.messages.error_importing'));
        setSuccess('');
      }
    } catch (err) {
      setError(t('common.messages.error_importing'));
      setSuccess('');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImportData(event.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="import-export-container">
      <h2>{t('importExport.title')}</h2>
      
      <div className="import-export-section">
        <h3>{t('importExport.export.title')}</h3>
        <p>{t('importExport.export.description')}</p>
        <button 
          onClick={handleExport} 
          className="export-btn"
        >
          {t('importExport.export.button')}
        </button>
      </div>
      
      <div className="import-export-section">
        <h3>{t('importExport.import.title')}</h3>
        <p>{t('importExport.import.description')}</p>
        
        <div className="import-controls">
          <div className="file-input-container">
            <input
              type="file"
              id="fileInput"
              accept=".json"
              onChange={handleFileSelect}
              className="file-input"
            />
            <label htmlFor="fileInput" className="file-input-label">
              {t('importExport.import.select_file')}
            </label>
            {importData && <span className="file-selected">{t('importExport.import.file_selected')}</span>}
          </div>
          
          <button 
            onClick={handleImport} 
            className="import-btn"
            disabled={!importData}
          >
            {t('importExport.import.button')}
          </button>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
};

export default ImportExport;
