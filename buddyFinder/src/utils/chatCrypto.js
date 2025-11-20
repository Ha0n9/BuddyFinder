import CryptoJS from 'crypto-js';

const BASE_KEY = import.meta.env.VITE_CHAT_AES_KEY || 'buddyfinder-local-key';

const deriveKey = (scope) => CryptoJS.SHA256(`${BASE_KEY}:${scope}`).toString();

const encrypt = (scope, plaintext) => {
  if (!plaintext) return '';
  const key = deriveKey(scope);
  return CryptoJS.AES.encrypt(plaintext, key).toString();
};

const decrypt = (scope, cipher) => {
  if (!cipher) return '';
  const key = deriveKey(scope);
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, key);
    const decoded = bytes.toString(CryptoJS.enc.Utf8);
    return decoded || '[Encrypted message]';
  } catch (error) {
    return '[Encrypted message]';
  }
};

export const encryptMatchMessage = (matchId, plaintext) =>
  encrypt(`match-${matchId}`, plaintext);

export const decryptMatchMessage = (matchId, cipher) =>
  decrypt(`match-${matchId}`, cipher);

export const encryptGroupMessage = (roomId, plaintext) =>
  encrypt(`group-${roomId}`, plaintext);

export const decryptGroupMessage = (roomId, cipher) =>
  decrypt(`group-${roomId}`, cipher);
