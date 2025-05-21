import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  return (
    <div className="language-switcher">
      <button 
        onClick={() => changeLanguage('en')} 
        className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
      >
        EN
      </button>
      <button 
        onClick={() => changeLanguage('es')} 
        className={`lang-btn ${i18n.language === 'es' ? 'active' : ''}`}
      >
        ES
      </button>
    </div>
  );
};

export default LanguageSwitcher;
