import { PasswordEntry } from '../models/passwordEntry';
import { encrypt, decrypt, encryptObject, decryptObject, generateHash } from './encryptionService';

const STORAGE_KEY = 'bitvault_passwords';
const MASTER_KEY_HASH = 'bitvault_master_key_hash';

// Verificar si existe una clave maestra
export const masterKeyExists = (): boolean => {
  return localStorage.getItem(MASTER_KEY_HASH) !== null;
};

// Configurar clave maestra
export const setupMasterKey = (masterKey: string): void => {
  const keyHash = generateHash(masterKey);
  localStorage.setItem(MASTER_KEY_HASH, keyHash);
};

// Verificar la clave maestra
export const verifyMasterKey = (masterKey: string): boolean => {
  const storedHash = localStorage.getItem(MASTER_KEY_HASH);
  if (!storedHash) return false;
  return storedHash === generateHash(masterKey);
};

// Guardar las contraseñas en el almacenamiento local
export const savePasswords = (passwords: PasswordEntry[], masterKey: string): void => {
  const encryptedData = encryptObject(passwords, masterKey);
  localStorage.setItem(STORAGE_KEY, encryptedData);
};

// Obtener las contraseñas del almacenamiento local
export const getPasswords = (masterKey: string): PasswordEntry[] => {
  const encryptedData = localStorage.getItem(STORAGE_KEY);
  if (!encryptedData) return [];
  
  const passwords = decryptObject<PasswordEntry[]>(encryptedData, masterKey);
  return passwords || [];
};

// Añadir una nueva contraseña
export const addPassword = (password: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>, masterKey: string): PasswordEntry => {
  const passwords = getPasswords(masterKey);
  
  const newPassword: PasswordEntry = {
    ...password,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  passwords.push(newPassword);
  savePasswords(passwords, masterKey);
  
  return newPassword;
};

// Actualizar una contraseña existente
export const updatePassword = (password: PasswordEntry, masterKey: string): boolean => {
  const passwords = getPasswords(masterKey);
  const index = passwords.findIndex(p => p.id === password.id);
  
  if (index === -1) return false;
  
  passwords[index] = {
    ...password,
    updatedAt: new Date()
  };
  
  savePasswords(passwords, masterKey);
  return true;
};

// Eliminar una contraseña
export const deletePassword = (id: string, masterKey: string): boolean => {
  const passwords = getPasswords(masterKey);
  const index = passwords.findIndex(p => p.id === id);
  
  if (index === -1) return false;
  
  passwords.splice(index, 1);
  savePasswords(passwords, masterKey);
  return true;
};

// Generar un ID único
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Exportar contraseñas a un archivo
export const exportPasswords = (masterKey: string): string => {
  const passwords = getPasswords(masterKey);
  return JSON.stringify(passwords, null, 2);
};

// Importar contraseñas desde un archivo
export const importPasswords = (jsonData: string, masterKey: string): boolean => {
  try {
    const passwords = JSON.parse(jsonData) as PasswordEntry[];
    savePasswords(passwords, masterKey);
    return true;
  } catch (error) {
    console.error('Error al importar contraseñas:', error);
    return false;
  }
};
