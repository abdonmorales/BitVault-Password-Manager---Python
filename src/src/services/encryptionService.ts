import CryptoJS from 'crypto-js';

// En una implementación real, deberías generar y guardar esta clave
// de manera segura por usuario, no usar una codificada
const DEFAULT_SECRET_KEY = 'default-encryption-key-bitvault';

// Utiliza la clave del entorno si existe, o la predeterminada
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY || DEFAULT_SECRET_KEY;

// Encripta una cadena
export const encrypt = (text: string, key: string = SECRET_KEY): string => {
  return CryptoJS.AES.encrypt(text, key).toString();
};

// Desencripta una cadena encriptada
export const decrypt = (cipherText: string, key: string = SECRET_KEY): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Error al desencriptar:', error);
    return '';
  }
};

// Encripta un objeto completo
export const encryptObject = (obj: any, key: string = SECRET_KEY): string => {
  const jsonString = JSON.stringify(obj);
  return encrypt(jsonString, key);
};

// Desencripta y parsea un objeto
export const decryptObject = <T>(cipherText: string, key: string = SECRET_KEY): T | null => {
  try {
    const jsonString = decrypt(cipherText, key);
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Error al desencriptar objeto:', error);
    return null;
  }
};

// Genera un hash para comprobar la integridad de los datos
export const generateHash = (data: string): string => {
  return CryptoJS.SHA256(data).toString();
};
