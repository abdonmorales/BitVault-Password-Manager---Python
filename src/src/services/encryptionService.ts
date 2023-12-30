import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY; // Store your key in .env file

export const encryptPassword = (password: string): string => {
	return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
};

export const decryptPassword = (cipherText: string): string => {
	const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
	return bytes.toString(CryptoJS.enc.Utf8);
};
