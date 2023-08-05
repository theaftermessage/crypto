import * as CryptoJS from 'crypto-js';

interface EncryptedFileData {
  iv: string;
  data: string;
  metadata: string;
}

export default function decryptFile(jsonFile: string, key: string) {
  const encryptionKey = CryptoJS.enc.Hex!.parse(key);

  const encryptedDataObject: EncryptedFileData = JSON.parse(jsonFile || "");

  const iv = CryptoJS.enc.Hex!.parse(encryptedDataObject!.iv);
  const decryptedFileData = CryptoJS.AES!.decrypt(encryptedDataObject!.data, encryptionKey, { iv: iv })!.toString(CryptoJS.enc.Utf8);
  const decryptedMetadata = CryptoJS.AES!.decrypt(encryptedDataObject!.metadata, encryptionKey, { iv: iv })!.toString(CryptoJS.enc.Utf8);

  const data = JSON.stringify({
    decryptedFileData,
    decryptedMetadata
  });

  return data;
}