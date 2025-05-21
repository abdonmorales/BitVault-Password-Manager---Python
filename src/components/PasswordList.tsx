import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PasswordItem from './PasswordItem';
import { PasswordEntry } from '../models/passwordEntry';

interface PasswordListProps {
  entries: PasswordEntry[];
  onDelete: (id: string) => void;
  onEdit: (entry: PasswordEntry) => void;
  masterKey: string;
}

const PasswordList: React.FC<PasswordListProps> = ({ entries, onDelete, onEdit, masterKey }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const { t } = useTranslation();
  
  // Get all unique categories
  const categories = Array.from(new Set(entries.map(entry => entry.category || t('passwords.filter.uncategorized'))));
  
  // Filter entries based on search term and category
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = searchTerm === '' || 
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.url && entry.url.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (entry.notes && entry.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesCategory = filterCategory === '' || 
      (entry.category || t('passwords.filter.uncategorized')) === filterCategory;
      
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="password-list-container">
      <div className="password-list-filters">
        <input
          type="text"
          placeholder={t('passwords.placeholders.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
          className="category-filter"
        >
          <option value="">{t('passwords.filter.all_categories')}</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      
      {filteredEntries.length === 0 ? (
        <div className="no-passwords-message">
          {entries.length === 0 
            ? t('common.messages.no_passwords')
            : t('common.messages.no_matches')}
        </div>
      ) : (
        <div className="password-list">
          {filteredEntries.map(entry => (
            <PasswordItem 
              key={entry.id} 
              entry={entry} 
              onDelete={onDelete}
              onEdit={onEdit}
              masterKey={masterKey}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PasswordList;